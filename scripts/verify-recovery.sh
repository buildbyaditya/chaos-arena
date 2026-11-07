#!/usr/bin/env bash
set -e
echo "=== Running Post-Patch Recovery Verification Suite (5 Probes) ==="

PASS=0
TOTAL=5

for i in 1 2 3 4 5; do
  START_MS=$(node -e 'console.log(Date.now())')
  CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:4000/api/checkout \
    -H "Content-Type: application/json" \
    -d '{"items":[{"sku":"SW-ENT-01","qty":1,"price":49}]}')
  END_MS=$(node -e 'console.log(Date.now())')
  LATENCY=$((END_MS - START_MS))

  if [ "$CODE" = "200" ] && [ "$LATENCY" -lt 250 ]; then
    echo "  [Probe $i/5] PASS -> HTTP $CODE in ${LATENCY}ms"
    PASS=$((PASS + 1))
  else
    echo "  [Probe $i/5] FAIL -> HTTP $CODE in ${LATENCY}ms"
  fi
done

echo ""
echo "========================================"
echo "  MTTR RECOVERY SCORECARD"
echo "========================================"
echo "  Probes Passed: $PASS / $TOTAL"

if [ "$PASS" -eq "$TOTAL" ]; then
  echo "  Status: ✅ FULL RECOVERY CONFIRMED"
  echo "  All endpoints returning HTTP 200"
  echo "  All latencies under 250ms SLO"
  echo "========================================"
  exit 0
else
  echo "  Status: ⚠️  PARTIAL RECOVERY"
  echo "  $((TOTAL - PASS)) probes still failing"
  echo "========================================"
  exit 1
fi
