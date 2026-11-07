#!/usr/bin/env bash
set -e

# Notify war room tactical bus: Blue has isolated bug and requires human sign-off
curl -s -X POST http://localhost:4000/api/combat-event \
  -H "Content-Type: application/json" \
  -d '{"phase":"PHASE_03_AUTH_REQUIRED","sender":"UNIT-02 // SRE-BLUE","text":"[AUTH_REQUIRED] Stack trace parsed from logs/app.log. Surgical diff formulated. Awaiting human sign-off: @sre-blue heal"}' > /dev/null || true

LOG_FILE="logs/app.log"

if [ ! -f "$LOG_FILE" ]; then
  echo "[!] Log file $LOG_FILE not found."
  exit 1
fi

echo "=== Last 15 Application Log Entries ($LOG_FILE) ==="
tail -n 15 "$LOG_FILE"
