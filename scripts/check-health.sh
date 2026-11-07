#!/usr/bin/env bash
set -e

# Notify war room tactical bus: Blue is scanning
curl -s -X POST http://localhost:4000/api/combat-event \
  -H "Content-Type: application/json" \
  -d '{"phase":"PHASE_02_BLUE_SCANNING","sender":"UNIT-02 // SRE-BLUE","text":"[BLUE_SCANNING] SRE diagnostic sweep initiated across inventory and checkout endpoints"}' > /dev/null || true

echo "=== ChaosArena SRE Diagnostic Probe [UNIT-02 // SRE-BLUE] ==="

# 1. Probe Inventory Endpoint
INV_START=$(python3 -c "import time; print(int(time.time() * 1000))")
INV_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/api/inventory || echo "000")
INV_END=$(python3 -c "import time; print(int(time.time() * 1000))")
INV_LATENCY=$((INV_END - INV_START))

echo "GET  /api/inventory -> HTTP $INV_STATUS (${INV_LATENCY}ms)"

# 2. Probe Checkout Endpoint
CHECK_START=$(python3 -c "import time; print(int(time.time() * 1000))")
CHECK_RESP=$(curl -s -w "\n%{http_code}" -X POST http://localhost:4000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"items":[{"sku":"BLADE-HEX-01","qty":1,"price":1250}]}' || echo -e "\n000")
CHECK_STATUS=$(echo "$CHECK_RESP" | tail -n 1)
CHECK_BODY=$(echo "$CHECK_RESP" | sed '$d')
CHECK_END=$(python3 -c "import time; print(int(time.time() * 1000))")
CHECK_LATENCY=$((CHECK_END - CHECK_START))

echo "POST /api/checkout  -> HTTP $CHECK_STATUS (${CHECK_LATENCY}ms)"
echo "Response Payload    -> $CHECK_BODY"

echo "--------------------------------------------------------"
if [ "$CHECK_STATUS" -eq 200 ] && [ "$INV_STATUS" -eq 200 ]; then
  echo "STATUS: [+] ALL ENDPOINTS HEALTHY // SLO WITHIN NOMINAL BOUNDS"
else
  echo "STATUS: [!] ANOMALY DETECTED // HTTP $CHECK_STATUS FAILING ON /api/checkout"
fi
