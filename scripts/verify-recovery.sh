#!/usr/bin/env bash
set -e

echo "=== Running Post-Patch Recovery Verification Suite (5 Probes) ==="

PASSED=0
TOTAL=5

for i in $(seq 1 $TOTAL); do
  START=$(python3 -c "import time; print(int(time.time() * 1000))")
  
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:4000/api/checkout \
    -H "Content-Type: application/json" \
    -d '{"items":[{"sku":"BLADE-HEX-01","qty":1,"price":1250}]}' || true)
  if [ -z "$HTTP_CODE" ]; then HTTP_CODE="000"; fi
  
  END=$(python3 -c "import time; print(int(time.time() * 1000))")
  LATENCY=$((END - START))
  
  if [ "$HTTP_CODE" = "200" ] && [ "$LATENCY" -lt 250 ]; then
    echo "  [Probe $i/$TOTAL] PASS -> HTTP 200 in ${LATENCY}ms"
    PASSED=$((PASSED + 1))
  else
    echo "  [Probe $i/$TOTAL] FAIL -> HTTP $HTTP_CODE in ${LATENCY}ms"
  fi
  sleep 0.1
done

echo ""
echo "========================================"
echo "  MTTR RECOVERY SCORECARD"
echo "========================================"
echo "  Probes Passed: $PASSED / $TOTAL"

if [ "$PASSED" -eq "$TOTAL" ]; then
  # Notify war room tactical bus: Recovery verified
  curl -s -X POST http://localhost:4000/api/combat-event \
    -H "Content-Type: application/json" \
    -d '{"phase":"PHASE_04_HEAL_VERIFIED","sender":"UNIT-02 // SRE-BLUE","text":"[HEAL_VERIFIED] 5/5 probes verified. All latencies < 250ms. MTTR score locked."}' > /dev/null || true

  echo "  Status: [+] FULL RECOVERY CONFIRMED"
  echo "  All endpoints returning HTTP 200"
  echo "  All latencies under 250ms SLO"
  echo "========================================"
  exit 0
else
  echo "  Status: [!] VERIFICATION FAILED (SLO BREACH PERSISTS)"
  echo "========================================"
  exit 1
fi
