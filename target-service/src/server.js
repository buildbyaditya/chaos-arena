const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const {
  logEvent,
  recordMetric,
  getMetricsSummary,
  updateCombatState,
  getCombatState,
  LOG_FILE
} = require('./utils/logger');

const checkoutRoute = require('./routes/checkout');
const inventoryRoute = require('./routes/inventory');
const arenaRoute = require('./routes/arena');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Request telemetry middleware (records latency, HTTP status, and writes structured logs)
app.use((req, res, next) => {
  const start = Date.now();
  const originalPath = req.originalUrl || req.path;

  res.on('finish', () => {
    // Avoid polluting production business metrics with dashboard pollers or telemetry endpoints
    if (
      originalPath === '/metrics' ||
      originalPath === '/dashboard' ||
      originalPath.startsWith('/dashboard/assets') ||
      originalPath === '/health' ||
      originalPath === '/api/combat-event' ||
      originalPath.startsWith('/api/arena/status') ||
      originalPath === '/favicon.ico'
    ) {
      return;
    }

    const latency = Date.now() - start;
    recordMetric({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: originalPath,
      status: res.statusCode,
      latency_ms: latency
    });

    if (res.statusCode < 500) {
      logEvent('INFO', `${req.method} ${originalPath} -> ${res.statusCode} (${latency}ms)`, {
        method: req.method,
        path: originalPath,
        status: res.statusCode,
        latency_ms: latency
      });
    }
  });

  next();
});

// GET /health - Basic liveness probe & rolling P99 summary
app.get('/health', (req, res) => {
  const summary = getMetricsSummary();
  const httpCode = summary.status === 'HEALTHY' ? 200 : 503;
  res.status(httpCode).json({
    service: 'chaos-arena-target-service',
    ...summary
  });
});

// GET /metrics - Telemetry summary, rolling window, recent logs, and tactical combat state
app.get('/metrics', (req, res) => {
  const summary = getMetricsSummary();
  const combat = getCombatState();

  let recentLogs = [];
  if (fs.existsSync(LOG_FILE)) {
    const lines = fs.readFileSync(LOG_FILE, 'utf8').trim().split('\n').filter(Boolean);
    recentLogs = lines.slice(-12).map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return { raw: l };
      }
    });
  }

  res.status(200).json({
    ...summary,
    combat_state: combat,
    recent_logs: recentLogs.reverse()
  });
});

// POST /api/combat-event - Update real-time anime war-room combat state across agents and CLI scripts
app.post('/api/combat-event', (req, res) => {
  const { phase, sender, text, fault, details } = req.body || {};
  const updatedState = updateCombatState({ phase, sender, text, fault, details });
  logEvent('INFO', `Combat event received: ${phase || 'EVENT'} from ${sender || 'ANONYMOUS'}`, {
    phase,
    sender,
    text,
    fault
  });
  res.status(200).json({
    ok: true,
    combat_state: updatedState
  });
});

// Serve static assets for dashboard (bot sprites, transparent role mechas)
app.use('/dashboard/assets', express.static(path.join(__dirname, '../../dashboard/assets')));
app.use('/assets', express.static(path.join(__dirname, '../../assets')));

// GET / and GET /dashboard - Cyberbrutalist Tactical War Room Monitor
app.get(['/', '/dashboard'], (req, res) => {
  if (fs.existsSync(path.join(__dirname, '../../index.html'))) {
    res.sendFile(path.join(__dirname, '../../index.html'));
  } else {
    res.sendFile(path.join(__dirname, '../../dashboard/index.html'));
  }
});

// Mount business routes and arena simulation endpoints
app.use('/api/checkout', checkoutRoute);
app.use('/api/inventory', inventoryRoute);
app.use('/api/arena', arenaRoute);

// Central error-handling middleware with full stack traces
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const fullPath = req.originalUrl || req.path;

  logEvent('ERROR', `Unhandled exception in ${req.method} ${fullPath}: ${err.message}`, {
    method: req.method,
    path: fullPath,
    status,
    error: err.message,
    stack: err.stack
  });

  res.status(status).json({
    ok: false,
    error: err.message,
    path: fullPath
  });
});

app.listen(PORT, () => {
  logEvent('INFO', `ChaosArena Target Service listening on http://localhost:${PORT} (Dashboard: http://localhost:${PORT}/dashboard)`);
});
