# ChaosArena — Technical & System Requirements

## 1. System Prerequisites
- **Runtime:** Node.js >= 20.x, npm >= 10.x, Python >= 3.11 (optional for helper scripts)
- **Containers:** Docker & Docker Compose (for Switch Console + Mattermost local bridge)
- **AI Coding Agents:** Claude Code / OpenCode / Codex connected via Switch Agent Protocol
- **Git:** Local Git repository initialized (used by Blue Team agent for diff verification and clean rollbacks)

## 2. Repository Structure Requirements
```text
chaos-arena/
├── target-service/             # The production microservice under test
│   ├── src/
│   │   ├── server.js           # Express server (Port 4000)
│   │   ├── routes/
│   │   │   ├── checkout.js     # Endpoint 1: POST /api/checkout
│   │   │   ├── inventory.js    # Endpoint 2: GET /api/inventory
│   │   │   └── pricing.js      # Endpoint 3: POST /api/pricing
│   │   └── utils/
│   │       └── logger.js       # Writes structured JSON logs to ../logs/app.log
│   ├── tests/
│   │   └── health.test.js      # Automated verification suite
│   └── package.json
├── dashboard/                  # Real-time visual status monitor for the demo video
│   └── index.html              # Polls /health & /metrics every 1s (Green/Red UI)
├── scripts/
│   ├── check-health.sh         # Runs curl probes + latency benchmark (used by Blue Agent)
│   ├── tail-logs.sh            # Outputs last 30 lines of structured error logs
│   └── verify-recovery.sh      # Runs test suite and confirms P99 < 100ms & HTTP 200
├── logs/
│   └── app.log                 # Shared runtime log file
├── room.template.yaml          # Switch room & multi-agent configuration
├── context.md                  # Master AI agent context
├── agent.md                    # Agent personas & strict operational boundaries
└── README.md                   # Reproducible quickstart guide
```

## 3. Functional Requirements
1. **FR-01 (Target Service):** Must expose `GET /health`, `GET /metrics`, `POST /api/checkout`, and `GET /api/inventory`, logging all requests, latencies, and stack traces to `logs/app.log`.
2. **FR-02 (Red Team Sabotage):** `@Chaos-Red` must be able to inject realistic application-level bugs into `target-service/src/routes/` (e.g., N+1 CPU delay loop, unguarded undefined property access, broken tax calculation, or simulated DB timeout) without revealing the file or line number in chat.
3. **FR-03 (Symptom Broadcast):** After injecting a fault, `@Chaos-Red` must trigger a probe request so the error appears in `logs/app.log` and announce only the *external symptoms* in the Switch room, tagging `@SRE-Blue`.
4. **FR-04 (Blue Team Investigation):** `@SRE-Blue` must automatically respond to `@Chaos-Red`'s alert by executing `./scripts/check-health.sh` and `./scripts/tail-logs.sh`, locating the faulty code in `target-service/src/`, and posting a structured Root Cause Analysis (RCA) with a proposed patch diff.
5. **FR-05 (Human-in-the-Loop Gatekeeper):** `@SRE-Blue` is strictly forbidden from modifying files in `target-service/src/` until a human user replies in the room with an explicit approval command (`@SRE-Blue approve` or `@SRE-Blue heal`).
6. **FR-06 (Automated Verification):** Upon applying the fix, `@SRE-Blue` must run `./scripts/verify-recovery.sh` and post the before/after recovery scorecard in the room.