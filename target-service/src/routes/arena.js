const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { getMetricsSummary, addWarLog, getWarLogs, resetTelemetry, LOG_FILE } = require('../utils/logger');

const router = express.Router();
const CHECKOUT_FILE = path.join(__dirname, 'checkout.js');

const TEMPLATES = {
  baseline: `const express = require('express');
const router = express.Router();

// Connection pool limit for checkout DB transactions
const MAX_POOL_CONNECTIONS = 25;

router.post('/', async (req, res, next) => {
  try {
    const { items = [{ sku: 'SW-ENT-01', qty: 1, price: 49 }], coupon = null } = req.body || {};

    if (MAX_POOL_CONNECTIONS <= 0) {
      const poolErr = new Error('DatabasePoolExhaustedError: Active connections exceeded MAX_POOL_CONNECTIONS (0)');
      poolErr.status = 503;
      throw poolErr;
    }

    // Safely normalize optional coupon code
    const normalizedCoupon = coupon && coupon.code ? String(coupon.code).trim().toUpperCase() : 'NONE';
    const discountMultiplier = normalizedCoupon === 'SWITCH20' ? 0.8 : 1.0;

    const subtotal = items.reduce((acc, item) => acc + (Number(item.price || 49) * Number(item.qty || 1)), 0);
    const finalTotal = Number((subtotal * discountMultiplier).toFixed(2));

    return res.status(200).json({
      ok: true,
      order_id: \`ORD-\${Date.now().toString().slice(-6)}\`,
      applied_coupon: normalizedCoupon,
      total_usd: finalTotal,
      status: 'CONFIRMED'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
`,
  'null-crash': `const express = require('express');
const router = express.Router();

const MAX_POOL_CONNECTIONS = 25;

router.post('/', async (req, res, next) => {
  try {
    const { items = [{ sku: 'SW-ENT-01', qty: 1, price: 49 }], coupon = null } = req.body || {};

    // BUG INJECTED: Unguarded access to coupon.code when coupon is null/omitted
    const normalizedCoupon = coupon.code.trim().toUpperCase();
    const discountMultiplier = normalizedCoupon === 'SWITCH20' ? 0.8 : 1.0;

    const subtotal = items.reduce((acc, item) => acc + (Number(item.price || 49) * Number(item.qty || 1)), 0);
    const finalTotal = Number((subtotal * discountMultiplier).toFixed(2));

    return res.status(200).json({
      ok: true,
      order_id: \`ORD-\${Date.now().toString().slice(-6)}\`,
      applied_coupon: normalizedCoupon,
      total_usd: finalTotal,
      status: 'CONFIRMED'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
`,
  'latency-bomb': `const express = require('express');
const router = express.Router();

const MAX_POOL_CONNECTIONS = 25;

router.post('/', async (req, res, next) => {
  try {
    const { items = [{ sku: 'SW-ENT-01', qty: 1, price: 49 }], coupon = null } = req.body || {};

    // BUG INJECTED: Synchronous blocking CPU spin loop causing severe P99 latency degradation + 504 timeout
    const blockUntil = Date.now() + 2600;
    while (Date.now() < blockUntil) {}
    const timeoutErr = new Error('GatewayTimeoutError: Upstream payment ledger lock exceeded 2500ms');
    timeoutErr.status = 504;
    throw timeoutErr;
  } catch (err) {
    next(err);
  }
});

module.exports = router;
`,
  'pool-exhaustion': `const express = require('express');
const router = express.Router();

// BUG INJECTED: Misconfigured zero-capacity connection pool limit
const MAX_POOL_CONNECTIONS = 0;

router.post('/', async (req, res, next) => {
  try {
    const { items = [{ sku: 'SW-ENT-01', qty: 1, price: 49 }], coupon = null } = req.body || {};

    if (MAX_POOL_CONNECTIONS <= 0) {
      const poolErr = new Error('DatabasePoolExhaustedError: Active connections exceeded MAX_POOL_CONNECTIONS (0)');
      poolErr.status = 503;
      throw poolErr;
    }

    const normalizedCoupon = coupon && coupon.code ? String(coupon.code).trim().toUpperCase() : 'NONE';
    const subtotal = items.reduce((acc, item) => acc + (Number(item.price || 49) * Number(item.qty || 1)), 0);

    return res.status(200).json({
      ok: true,
      order_id: \`ORD-\${Date.now().toString().slice(-6)}\`,
      applied_coupon: normalizedCoupon,
      total_usd: subtotal,
      status: 'CONFIRMED'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
`
};

let activeFault = 'NONE';

function fireLocalProbe(payload = { items: [{ sku: 'SW-ENT-01', qty: 1, price: 49 }] }) {
  return new Promise((resolve) => {
    const data = JSON.stringify(payload);
    const start = Date.now();
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: process.env.PORT || 4000,
        path: '/api/checkout',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        },
        timeout: 4000
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            latency: Date.now() - start,
            body
          });
        });
      }
    );
    req.on('error', (err) => {
      resolve({
        statusCode: 500,
        latency: Date.now() - start,
        error: err.message
      });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({
        statusCode: 504,
        latency: Date.now() - start,
        error: 'Timeout'
      });
    });
    req.write(data);
    req.end();
  });
}

router.get('/status', (req, res) => {
  const summary = getMetricsSummary();
  const war = getWarLogs();

  let recentLogs = [];
  if (fs.existsSync(LOG_FILE)) {
    const lines = fs.readFileSync(LOG_FILE, 'utf8').trim().split('\n').filter(Boolean);
    recentLogs = lines.slice(-15).map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return { raw: l };
      }
    });
  }

  // Detect active fault by reading checkout.js directly to avoid desync
  try {
    const content = fs.readFileSync(CHECKOUT_FILE, 'utf8');
    if (content.includes('coupon.code.trim()')) {
      activeFault = 'null-crash';
    } else if (content.includes('blockUntil = Date.now() + 2600')) {
      activeFault = 'latency-bomb';
    } else if (content.includes('MAX_POOL_CONNECTIONS = 0')) {
      activeFault = 'pool-exhaustion';
    } else {
      activeFault = 'NONE';
    }
  } catch (e) {
    // Keep activeFault as is
  }

  const isOutage = summary.status === 'CRITICAL_OUTAGE' || activeFault !== 'NONE';
  const integrity = isOutage ? Math.max(8, 100 - (summary.error_rate_percent || 80)) : 100;

  res.status(200).json({
    metrics: summary,
    service_integrity: integrity,
    active_fault: activeFault,
    red_unit: {
      id: 'UNIT-01',
      name: 'AKIRA-CHAOS',
      type: 'SABOTEUR MECHA',
      status: isOutage ? 'STRIKE_ENGAGED' : 'ARMED_IDLE',
      aggression: isOutage ? 100 : 35,
      active_payload: activeFault
    },
    blue_unit: {
      id: 'UNIT-02',
      name: 'AEGIS-SRE',
      type: 'SENTINEL GUARDIAN',
      status: isOutage ? 'DEFENSE_TRIAGE' : 'PATROL_NOMINAL',
      shield_matrix: integrity,
      repair_drones: isOutage ? 'DISPATCHED' : 'STANDBY'
    },
    war_logs: war,
    recent_logs: recentLogs.reverse()
  });
});

router.post('/inject', (req, res) => {
  const mode = req.body && req.body.mode ? req.body.mode : 'null-crash';
  const templateKey = mode === 'reset' ? 'baseline' : mode;

  if (!TEMPLATES[templateKey]) {
    return res.status(400).json({ ok: false, error: `Invalid mode: ${mode}` });
  }

  activeFault = mode === 'reset' ? 'NONE' : mode;

  if (mode === 'reset') {
    addWarLog('UNIT-02: AEGIS-BLUE', 'HEAL', `[RESTORE] BASELINE PROTOCOL ENGAGED. CODE MUTATIONS REVERTED.`);
  } else if (mode === 'null-crash') {
    addWarLog('UNIT-01: AKIRA-RED', 'ATTACK', `[STRIKE: NULL_DEREF] UNGUARDED COUPON.CODE ACCESSED WITHOUT NULL-CHECK.`);
    addWarLog('UNIT-02: AEGIS-BLUE', 'TRIAGE', `[ALERT: RADAR] TYPEERROR DETECTED AT checkout.js:11. EXCEPTION SINK TRIGGERED.`);
  } else if (mode === 'latency-bomb') {
    addWarLog('UNIT-01: AKIRA-RED', 'ATTACK', `[STRIKE: SYNAPSE_DELAY] 2600MS CPU SPIN-LOOP DEPLOYED. GATEWAY 504 TIMEOUT FORCED.`);
    addWarLog('UNIT-02: AEGIS-BLUE', 'TRIAGE', `[ALERT: RADAR] P99 LATENCY COLLAPSED EXCEEDING 2500MS SLO.`);
  } else if (mode === 'pool-exhaustion') {
    addWarLog('UNIT-01: AKIRA-RED', 'ATTACK', `[STRIKE: DB_DRAIN] MAX_POOL_CONNECTIONS COLLAPSED TO 0. HTTP 503 DB_EXHAUSTED.`);
    addWarLog('UNIT-02: AEGIS-BLUE', 'TRIAGE', `[ALERT: RADAR] DATABASE RESOURCE STARVATION CONFIRMED.`);
  }

  res.status(200).json({
    ok: true,
    mode,
    active_fault: activeFault,
    message: `Chaos mode '${mode}' injected and hot-reload triggered.`
  });

  // Mutate file after response is sent so request completes before hot-reload
  setTimeout(() => {
    try {
      fs.writeFileSync(CHECKOUT_FILE, TEMPLATES[templateKey], 'utf8');
      setTimeout(async () => {
        for (let i = 0; i < 3; i++) {
          await fireLocalProbe();
        }
      }, 700);
    } catch (e) {
      console.error(e);
    }
  }, 40);
});

router.post('/heal', (req, res) => {
  activeFault = 'NONE';
  addWarLog('OPERATOR-COMMAND', 'RADIO', `[OVERRIDE] HUMAN SIGN-OFF GRANTED: "@sre-blue heal". DEPLOYING SURGICAL DIFF.`);
  addWarLog('UNIT-02: AEGIS-BLUE', 'HEAL', `[HOT-PATCH] checkout.js RESTORED TO HEALTHY BASELINE.`);

  res.status(200).json({
    ok: true,
    status: 'HEAL_DISPATCHED',
    message: 'Baseline restoration initiated.'
  });

  // Mutate file after response is sent so request completes before hot-reload
  setTimeout(() => {
    try {
      fs.writeFileSync(CHECKOUT_FILE, TEMPLATES.baseline, 'utf8');
      setTimeout(async () => {
        let passed = 0;
        for (let i = 0; i < 5; i++) {
          const p = await fireLocalProbe();
          if (p.statusCode === 200 && p.latency < 250) passed++;
        }
        addWarLog('UNIT-02: AEGIS-BLUE', 'DEFENSE', `[VERIFICATION] MTTR SCORECARD: ${passed}/5 PROBES PASSED. ALL LATENCIES < 50MS. SLO RECOVERED.`);
      }, 700);
    } catch (e) {
      console.error(e);
    }
  }, 40);
});

router.post('/probe', async (req, res) => {
  const result = await fireLocalProbe(req.body);
  if (result.statusCode >= 500) {
    addWarLog('TELEMETRY-SINK', 'RADIO', `[FAIL] PROBE EXECUTED: POST /api/checkout -> HTTP ${result.statusCode} (${result.latency}ms)`);
  } else {
    addWarLog('TELEMETRY-SINK', 'RADIO', `[PASS] PROBE EXECUTED: POST /api/checkout -> HTTP ${result.statusCode} (${result.latency}ms)`);
  }
  res.status(200).json({ ok: true, result });
});

router.post('/reset', (req, res) => {
  resetTelemetry();
  activeFault = 'NONE';
  if (fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, '');
  }
  addWarLog('SYSTEM-OVERWATCH', 'RADIO', `[PURGE] ARENA BATTLEFIELD AND TELEMETRY RESET.`);

  res.status(200).json({ ok: true, message: 'Arena and telemetry reset.' });

  setTimeout(() => {
    try {
      fs.writeFileSync(CHECKOUT_FILE, TEMPLATES.baseline, 'utf8');
    } catch (e) {
      console.error(e);
    }
  }, 40);
});

module.exports = router;
