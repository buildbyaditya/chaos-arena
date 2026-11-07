#!/usr/bin/env bash
echo "=== ChaosArena Live Health Probe ==="

INV_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/api/inventory || echo "000")
echo "GET  /api/inventory -> HTTP $INV_CODE"

START_MS=$(node -e 'console.log(Date.now())')
CHK_RESP=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:4000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"items":[{"sku":"SW-ENT-01","qty":2,"price":49}]}' || echo "HTTP_STATUS:000")
END_MS=$(node -e 'console.log(Date.now())')
LATENCY=$((END_MS - START_MS))

CHK_CODE=$(echo "$CHK_RESP" | grep "HTTP_STATUS:" | cut -d':' -f2)
CHK_BODY=$(echo "$CHK_RESP" | sed '/HTTP_STATUS:/d')

echo "POST /api/checkout  -> HTTP $CHK_CODE (${LATENCY}ms)"
echo "Response Payload    -> $CHK_BODY"

if [ "$CHK_CODE" != "200" ] || [ "$LATENCY" -gt 1000 ]; then
  echo "STATUS: 🚨 CRITICAL OUTAGE DETECTED"
  exit 1
else
  echo "STATUS: ✅ ALL ENDPOINTS HEALTHY"
  exit 0
fi
