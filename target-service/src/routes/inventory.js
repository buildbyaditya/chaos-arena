const express = require('express');
const router = express.Router();

const INVENTORY = [
  { sku: 'GPU-H100', name: 'NVIDIA H100 Node', stock: 14, price_usd: 2800 },
  { sku: 'SW-ENT-01', name: 'Switch Enterprise Seat', stock: 250, price_usd: 49 },
  { sku: 'DEV-BOX-PRO', name: 'Cloud Sandbox Pro', stock: 82, price_usd: 120 }
];

router.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    warehouse: 'ap-south-1',
    items: INVENTORY
  });
});

module.exports = router;
