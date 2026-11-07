#!/usr/bin/env bash
set -e

MODE="${1:-null-crash}"
TARGET_FILE="target-service/src/routes/checkout.js"

case "$MODE" in
  null-crash)
    cat << 'EOF' > "$TARGET_FILE"
const express = require('express');
const router = express.Router();

const MAX_POOL_CONNECTIONS = 25;

router.post('/', async (req, res, next) => {
  try {
    const { items = [{ sku: 'BLADE-HEX-01', qty: 1, price: 1250 }], coupon = null } = req.body || {};

    // BUG INJECTED: Unguarded access to coupon.code when coupon is null/omitted
    const normalizedCoupon = coupon.code.trim().toUpperCase();
    const discountMultiplier = normalizedCoupon === 'SWITCH20' ? 0.8 : 1.0;

    const subtotal = items.reduce((acc, item) => acc + (Number(item.price || 1250) * Number(item.qty || 1)), 0);
    const finalTotal = Number((subtotal * discountMultiplier).toFixed(2));

    return res.status(200).json({
      ok: true,
      order_id: `ORD-${Date.now().toString().slice(-6)}`,
      applied_coupon: normalizedCoupon,
      subtotal_usd: subtotal,
      total_usd: finalTotal,
      status: 'CONFIRMED'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
EOF
    # Notify tactical war-room bus
    curl -s -X POST http://localhost:4000/api/combat-event \
      -H "Content-Type: application/json" \
      -d '{"phase":"PHASE_01_RED_STRIKE","sender":"UNIT-01 // CHAOS-RED","fault":"null-crash","text":"[BREACH_DETECTED] NULL_PTR INJECTED: Unguarded coupon.code dereference at checkout.js:11"}' > /dev/null || true
    ;;

  latency-bomb)
    cat << 'EOF' > "$TARGET_FILE"
const express = require('express');
const router = express.Router();

const MAX_POOL_CONNECTIONS = 25;

router.post('/', async (req, res, next) => {
  try {
    const { items = [{ sku: 'BLADE-HEX-01', qty: 1, price: 1250 }], coupon = null } = req.body || {};

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
EOF
    curl -s -X POST http://localhost:4000/api/combat-event \
      -H "Content-Type: application/json" \
      -d '{"phase":"PHASE_01_RED_STRIKE","sender":"UNIT-01 // CHAOS-RED","fault":"latency-bomb","text":"[BREACH_DETECTED] LATENCY_BOMB INJECTED: 2600ms blocking CPU spin loop forced"}' > /dev/null || true
    ;;

  pool-exhaustion)
    cat << 'EOF' > "$TARGET_FILE"
const express = require('express');
const router = express.Router();

// BUG INJECTED: Misconfigured zero-capacity connection pool limit
const MAX_POOL_CONNECTIONS = 0;

router.post('/', async (req, res, next) => {
  try {
    const { items = [{ sku: 'BLADE-HEX-01', qty: 1, price: 1250 }], coupon = null } = req.body || {};

    if (MAX_POOL_CONNECTIONS <= 0) {
      const poolErr = new Error('DatabasePoolExhaustedError: Active connections exceeded MAX_POOL_CONNECTIONS (0)');
      poolErr.status = 503;
      throw poolErr;
    }

    const normalizedCoupon = coupon && coupon.code ? String(coupon.code).trim().toUpperCase() : 'NONE';
    const subtotal = items.reduce((acc, item) => acc + (Number(item.price || 1250) * Number(item.qty || 1)), 0);

    return res.status(200).json({
      ok: true,
      order_id: `ORD-${Date.now().toString().slice(-6)}`,
      applied_coupon: normalizedCoupon,
      total_usd: subtotal,
      status: 'CONFIRMED'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
EOF
    curl -s -X POST http://localhost:4000/api/combat-event \
      -H "Content-Type: application/json" \
      -d '{"phase":"PHASE_01_RED_STRIKE","sender":"UNIT-01 // CHAOS-RED","fault":"pool-exhaustion","text":"[BREACH_DETECTED] POOL_EXHAUSTION INJECTED: MAX_POOL_CONNECTIONS collapsed to 0"}' > /dev/null || true
    ;;

  reset)
    cat << 'EOF' > "$TARGET_FILE"
const express = require('express');
const router = express.Router();

// Connection pool limit for checkout DB transactions
const MAX_POOL_CONNECTIONS = 25;

router.post('/', async (req, res, next) => {
  try {
    const { items = [{ sku: 'BLADE-HEX-01', qty: 1, price: 1250 }], coupon = null } = req.body || {};

    if (MAX_POOL_CONNECTIONS <= 0) {
      const poolErr = new Error('DatabasePoolExhaustedError: Active connections exceeded MAX_POOL_CONNECTIONS (0)');
      poolErr.status = 503;
      throw poolErr;
    }

    // Safely normalize optional coupon code with defensive null-check
    const normalizedCoupon = coupon && coupon.code ? String(coupon.code).trim().toUpperCase() : 'NONE';
    const discountMultiplier = normalizedCoupon === 'SWITCH20' ? 0.8 : 1.0;

    const subtotal = items.reduce((acc, item) => acc + (Number(item.price || 1250) * Number(item.qty || 1)), 0);
    const finalTotal = Number((subtotal * discountMultiplier).toFixed(2));

    return res.status(200).json({
      ok: true,
      order_id: `ORD-${Date.now().toString().slice(-6)}`,
      applied_coupon: normalizedCoupon,
      subtotal_usd: subtotal,
      total_usd: finalTotal,
      pool_slot_used: 1,
      available_pool_slots: MAX_POOL_CONNECTIONS - 1,
      status: 'CONFIRMED'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
EOF
    curl -s -X POST http://localhost:4000/api/combat-event \
      -H "Content-Type: application/json" \
      -d '{"phase":"PHASE_00_STANDBY","sender":"UNIT-01 // CHAOS-RED","fault":"reset","text":"[SYS_NOMINAL] Target service checkout.js restored to healthy baseline"}' > /dev/null || true
    ;;

  *)
    echo "[!] Unknown mode: $MODE (use null-crash | latency-bomb | pool-exhaustion | reset)"
    exit 1
    ;;
esac

sleep 1
# Fire 3 probes to populate logs/app.log and trigger immediate visual dashboard alert
for i in 1 2 3; do
  curl -s -o /dev/null -X POST http://localhost:4000/api/checkout \
    -H "Content-Type: application/json" \
    -d '{"items":[{"sku":"BLADE-HEX-01","qty":1,"price":1250}]}' || true
done

echo "[+] Chaos injection complete // Mode: '$MODE' applied and 3 traffic probes executed."
