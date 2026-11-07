const express = require('express');
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
      order_id: `ORD-${Date.now().toString().slice(-6)}`,
      applied_coupon: normalizedCoupon,
      total_usd: finalTotal,
      status: 'CONFIRMED'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
