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
