# ChaosArena Context & Architectural Specification (`context.md`)

## 1. Executive Summary & Hackathon Mission
We are building **ChaosArena** for the **Flip the Switch Hackathon** (Track 01: Best Business Workflow, $2,000). 
Our mission is to prove that multi-agent AI systems inside team communication channels solve real enterprise reliability challenges. Rather than deploying isolated terminal chatbots, ChaosArena orchestrates an adversarial Red-Team vs. Blue-Team incident response GameDay in a shared Mattermost room bridged by Switch.

---

## 2. Core Architecture & Telemetry Bus
```text
[HUMAN INCIDENT COMMANDER]
            │
            ▼
     [SWITCH CONSOLE]
            │
            ├──► Mattermost Bridge: Channel #chaos-gameday
            │           │
            │           ├──► [UNIT-01: CHAOS-RED] (Addressing: owner-only)
            │           │         │
            │           │         ├──► Injects deterministic faults into checkout.js
            │           │         ├──► Emits PHASE_01_RED_STRIKE to telemetry bus
            │           │         └──► Broadcasts external symptoms & tags @sre-blue
            │           │
            │           └──► [UNIT-02: @SRE-BLUE] (Addressing: anyone)
            │                     │
            │                     ├──► Wakes up autonomously upon tag
            │                     ├──► Executes ./scripts/check-health.sh (PHASE_02_BLUE_SCANNING)
            │                     ├──► Executes ./scripts/tail-logs.sh (PHASE_03_AUTH_REQUIRED)
            │                     ├──► Posts RCA & surgical git diff in chat
            │                     └──► Halts for human sign-off: "@sre-blue heal"
            │
            ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      TARGET-SERVICE (PORT 4000)                        │
 │   POST /api/checkout  │  GET /api/inventory  │  POST /api/combat-event │
 │   GET  /health        │  GET /metrics        │  GET  /api/arena/status │
 └────────────────────────────────────────────────────────────────────────┘
            │
            ▼
 [CYBERBRUTALIST TACTICAL WAR ROOM] (http://localhost:4000/dashboard)
  - 1-second polling against /metrics & /api/arena/status
  - Real-time 5-phase combat state machine
  - Dynamic mecha bot animations (attack charge, laser beams, repair shields)
  - Live P99 latency, error rate HUD, and MTTR stopwatch
```

---

## 3. The 5-Phase Tactical Combat State Machine

1. **PHASE_00_STANDBY**:
   - System baseline nominal.
   - P99 latency ~12ms, 0% error rate, all HTTP probes 200 OK.
   - Both units in armed standby / patrol mode.

2. **PHASE_01_RED_STRIKE**:
   - Triggered by `./scripts/chaos-inject.sh` or dashboard attack button.
   - Injects failure mode into `target-service/src/routes/checkout.js`.
   - Starts MTTR outage stopwatch.
   - Red mecha charges forward, fires laser strike beam, server core sparks `[BREACHED]`.

3. **PHASE_02_BLUE_SCANNING**:
   - Triggered by `./scripts/check-health.sh` when `@sre-blue` probes endpoints.
   - Blue mecha activates radar scanner, testing `/api/inventory` and `/api/checkout`.

4. **PHASE_03_AUTH_REQUIRED**:
   - Triggered by `./scripts/tail-logs.sh` when `@sre-blue` inspects `logs/app.log`.
   - Offending AST line isolated (e.g. `checkout.js:11`).
   - Surgical diff formulated and posted in chat.
   - Agent halts execution awaiting human command: `@sre-blue heal`.

5. **PHASE_04_HEAL_VERIFIED**:
   - Triggered by `./scripts/verify-recovery.sh` or dashboard heal button.
   - Baseline code restored and verified with 5 sequential transactions.
   - MTTR stopwatch locks in final recovery time (< 2.5s).
   - Blue mecha projects green repair beam, monolith health returns to 100%.

---

## 4. Track 01 Judging Alignment (Flip the Switch Hackathon)

- **Use of Switch (30%)**:
  Switch is the foundational communication layer. Without Switch's selective addressing (`owner-only` for Red, `anyone` for Blue) and room bridge to Mattermost, the agents cannot cross-communicate or trigger autonomous wake-ups.
- **Technical Execution (25%)**:
  Zero flakiness. Sub-300ms hot reload (`node --watch`), structured JSON logging with exact stack traces, in-memory sliding window, and deterministic bash scripts.
- **Creativity & Impact (25%)**:
  Solves a major enterprise problem: validating resilience via automated Chaos GameDays with strict human-in-the-loop governance.
- **Presentation (20%)**:
  Cyberbrutalist visual war room with high-fidelity anime mecha bots, live telemetry HUD, and comprehensive documentation. Strict zero emojis throughout.
