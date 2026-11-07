const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../../../logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}
if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, '');
}

const telemetry = {
  requests: [], // { timestamp, method, path, status, latency_ms, error }
  lastFaultNote: null
};

function recordMetric(entry) {
  telemetry.requests.push(entry);
  if (telemetry.requests.length > 40) {
    telemetry.requests.shift();
  }
}

function logEvent(level, message, meta = {}) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  };
  const line = JSON.stringify(payload) + '\n';
  fs.appendFileSync(LOG_FILE, line, 'utf8');
  if (level === 'ERROR') {
    console.error(`[ERROR] ${payload.timestamp} - ${message}`, meta.stack || '');
  } else {
    console.log(`[${level}] ${payload.timestamp} - ${message}`);
  }
}

function getMetricsSummary() {
  const recent = telemetry.requests.slice(-15);
  if (recent.length === 0) {
    return {
      status: 'HEALTHY',
      p99_latency_ms: 12,
      error_rate_percent: 0,
      total_requests: 0,
      recent_events: []
    };
  }
  const latencies = recent.map(r => r.latency_ms).sort((a, b) => a - b);
  const p99Index = Math.max(0, Math.floor(latencies.length * 0.99) - 1);
  const p99 = latencies[p99Index] || latencies[latencies.length - 1] || 12;
  const errors = recent.filter(r => r.status >= 500).length;
  const errorRate = Math.round((errors / recent.length) * 100);

  const isOutage = errorRate >= 20 || p99 > 1000;

  return {
    status: isOutage ? 'CRITICAL_OUTAGE' : 'HEALTHY',
    p99_latency_ms: p99,
    error_rate_percent: errorRate,
    total_requests: telemetry.requests.length,
    recent_events: recent.slice().reverse()
  };
}

module.exports = {
  logEvent,
  recordMetric,
  getMetricsSummary,
  LOG_FILE
};
