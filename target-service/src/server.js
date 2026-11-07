const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { logEvent, recordMetric, getMetricsSummary, LOG_FILE } = require('./utils/logger');
const checkoutRoute = require('./routes/checkout');
const inventoryRoute = require('./routes/inventory');
const arenaRoute = require('./routes/arena');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Request telemetry middleware
app.use((req, res, next) => {
  const start = Date.now();
  // Capture the original URL before Express sub-routers rewrite req.path
  const originalPath = req.originalUrl || req.path;
  res.on('finish', () => {
    // Skip polluting metrics with dashboard polling or arena control requests
    if (originalPath === '/metrics' || originalPath === '/dashboard' || originalPath.startsWith('/api/arena')) return;
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

app.get('/health', (req, res) => {
  const summary = getMetricsSummary();
  const httpCode = summary.status === 'HEALTHY' ? 200 : 503;
  res.status(httpCode).json({
    service: 'chaos-arena-target-service',
    ...summary
  });
});

app.get('/metrics', (req, res) => {
  const summary = getMetricsSummary();
  let recentLogs = [];
  if (fs.existsSync(LOG_FILE)) {
    const lines = fs.readFileSync(LOG_FILE, 'utf8').trim().split('\n').filter(Boolean);
    recentLogs = lines.slice(-12).map(l => {
      try { return JSON.parse(l); } catch { return { raw: l }; }
    });
  }
  res.status(200).json({
    ...summary,
    recent_logs: recentLogs.reverse()
  });
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dashboard/index.html'));
});

app.use('/api/checkout', checkoutRoute);
app.use('/api/inventory', inventoryRoute);
app.use('/api/arena', arenaRoute);

// Central error handler with full stack trace logging
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

