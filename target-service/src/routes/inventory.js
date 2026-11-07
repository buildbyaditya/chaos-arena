const express = require('express');
const router = express.Router();

const INVENTORY = [
  { sku: 'BLADE-HEX-01', name: 'Tactical Quantum Compute Blade Hex-01', stock: 18, price_usd: 1250, status: 'NOMINAL' },
  { sku: 'MESH-ROUTER-99', name: 'Switch Neural Mesh Router Rack-99', stock: 45, price_usd: 820, status: 'NOMINAL' },
  { sku: 'SW-CORE-BRIDGE', name: 'Switch Multi-Agent Hardware Protocol Bridge', stock: 120, price_usd: 490, status: 'NOMINAL' },
  { sku: 'OPTIC-TRANS-400', name: '400G Dense Wavelength Transceiver Blade', stock: 64, price_usd: 1650, status: 'NOMINAL' },
  { sku: 'CRYPTO-VAULT-SRE', name: 'Hardware SRE Sentinel Key Vault', stock: 32, price_usd: 940, status: 'NOMINAL' }
];

router.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    warehouse: 'ap-south-switch-mesh',
    blade_cluster: 'SEC-09-RACK-4',
    total_skus: INVENTORY.length,
    items: INVENTORY
  });
});

module.exports = router;
