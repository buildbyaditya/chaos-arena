#!/usr/bin/env bash
echo "=== Last 15 Application Log Entries (logs/app.log) ==="
if [ -f "logs/app.log" ]; then
  tail -n 15 logs/app.log
else
  echo "No log file found at logs/app.log"
fi

