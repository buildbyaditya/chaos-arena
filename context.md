# Master Context for AI Builder (`context.md`)

## 1. Mission
We are building **ChaosArena** for the **Flip the Switch Hackathon**. Our goal is to deliver a 100% working, reproducible, visually impressive multi-agent demo running on **Switch** within 3 hours.

## 2. Core Architecture
```text
[ Human Engineer in Switch Room (#chaos-gameday) ]
         │
         ├──► 1. Commands @Chaos-Red to inject fault
         │           │
         │           ▼
         │    [ @Chaos-Red Agent ]
         │      - Modifies target-service/src/routes/*.js
         │      - Fires test requests to generate real error logs
         │      - Posts ONLY symptoms in room & pings @SRE-Blue
         │
         ├──► 2. @SRE-Blue wakes up via Switch room event
         │           │
         │           ▼
         │    [ @SRE-Blue Agent ]
         │      - Runs ./scripts/check-health.sh & ./scripts/tail-logs.sh
         │      - Diagnoses stack trace & locates broken code
         │      - Posts RCA + proposed git diff in room
         │      - Waits for Human "@SRE-Blue heal" command
         │
         └──► 3. Human replies "@SRE-Blue heal"
                     │
                     ▼
              [ @SRE-Blue Agent ]
                - Applies fix to target-service/src/routes/*.js
                - Runs ./scripts/verify-recovery.sh
                - Posts Green MTTR Scorecard
```

## 3. Implementation Rules for Building the Repo
1. **Keep `target-service` Fast & Self-Contained:**
   - Use Node.js + Express with `--watch` (or `nodemon`) so any file edit by `@Chaos-Red` or `@SRE-Blue` hot-reloads the server in < 500ms without needing Docker rebuilds.
   - No external databases required; use an in-memory store (`src/data/store.js`) so nothing external can flake during the demo.
2. **Build a Single-File Live Dashboard (`dashboard/index.html`):**
   - Use clean Tailwind CSS (via CDN) with dark mode.
   - Poll `http://localhost:4000/health` every 1,000ms.
   - Display 3 big cards: **System Status (HEALTHY / CRITICAL OUTAGE)**, **P99 Latency (ms)**, and **Error Rate (%)**, plus a live scrolling feed of recent HTTP responses.
3. **Make Diagnostic Scripts Deterministic:**
   - `scripts/check-health.sh`: Hits `/health` and `/api/checkout` with test payloads, printing HTTP status codes and response times.
   - `scripts/tail-logs.sh`: Prints the last 25 lines of `logs/app.log`.
   - `scripts/verify-recovery.sh`: Runs 5 test requests across all endpoints and outputs `✅ ALL CHECKS PASSED` or `❌ CHECKS FAILED`.