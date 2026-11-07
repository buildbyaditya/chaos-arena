const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { logEvent, recordMetric, getMetricsSummary, LOG_FILE } = require('./utils/logger');
const checkoutRoute = require('./routes/checkout');
const inventoryRoute = require('./routes/inventory');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Request telemetry middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    // Skip polluting metrics with dashboard polling requests
    if (req.path === '/metrics' || req.path === '/dashboard') return;
    const latency = Date.now() - start;
    recordMetric({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      latency_ms: latency
    });
    if (res.statusCode < 500) {
      logEvent('INFO', `${req.method} ${req.path} -> ${res.statusCode} (${latency}ms)`, {
        method: req.method,
        path: req.path,
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

// Central error handler with full stack trace logging
app.use((err, req, res, next) => {
  const status = err.status || 500;
  logEvent('ERROR', `Unhandled exception in ${req.method} ${req.path}: ${err.message}`, {
    method: req.method,
    path: req.path,
    status,
    error: err.message,
    stack: err.stack
  });
  res.status(status).json({
    ok: false,
    error: err.message,
    path: req.path
  });
});

app.listen(PORT, () => {
  logEvent('INFO', `ChaosArena Target Service listening on http://localhost:${PORT} (Dashboard: http://localhost:${PORT}/dashboard)`);
});
