# // CHAOS-ARENA

> Autonomous Red-Team vs. Blue-Team Self-Healing GameDays inside [Switch](https://switchagents.ai)
> Flip the Switch Hackathon // Track 01: Best Business Workflow ($2,000)

---

## [MISSION] WHAT IS CHAOS-ARENA?

ChaosArena pits two autonomous AI anime-styled combat agents against each other in a shared Mattermost war room powered by Switch:

- **UNIT-01: AKIRA-CHAOS (@chaos-red)** - Red-Team Saboteur Mecha that injects realistic production faults into live microservices.
- **UNIT-02: AEGIS-SRE (@sre-blue)** - Blue-Team SRE Sentinel Mecha that autonomously detects outages, traces AST exceptions, formulates surgical diffs, and requests human sign-off before hot-patching.

A real-time cyberbrutalist war-room dashboard streams telemetry, health probes, P99 latencies, and tactical comms transmissions in real-time.

---

## [ARCHITECTURE] SYSTEM TOPOLOGY

```
[HUMAN OPERATOR]
       │
       ▼
[SWITCH CONSOLE] ─────────▶ [MATTERMOST BRIDGE] (#chaos-gameday)
       │                              │
       ├──────────────────────────────┼─────────────────────────────┐
       ▼                                                            ▼
[UNIT-01: AKIRA-CHAOS]                                    [UNIT-02: AEGIS-SRE]
(@chaos-red // Owner-Only)                                (@sre-blue // Anyone)
       │                                                            │
       │  [STRIKE: INJECT FAULT]                [TRIAGE & HOTPATCH] │
       ▼                                                            ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      TARGET-SERVICE (PORT 4000)                        │
│   POST /api/checkout  │  GET /api/inventory  │  GET /api/arena/status  │
│   GET  /health        │  GET /metrics        │  POST /api/arena/heal   │
└────────────────────────────────────────────────────────────────────────┘
       │                                                            ▲
       └──────────────────────────────┬─────────────────────────────┘
                                      ▼
                        [CYBERBRUTALIST DASHBOARD]
                       (http://localhost:4000/dashboard)
```

---

## [QUICK START] EXECUTION INSTRUCTIONS

### 1. Install & Boot Microservice

```bash
npm install
npm start
```

The target service starts on `http://localhost:4000` with `node --watch` sub-300ms hot-reload.

### 2. Access the Cyberbrutalist War Room Monitor

Open your browser to:
```
http://localhost:4000/dashboard
```

The monitor features cyberbrutalist styling, anime bot combat cards, interactive weapons/defense panels, a dual tension bar, live telemetry feeds, and zero emojis.

### 3. CLI Chaos Modes (Used by @chaos-red)

```bash
# Strike 1: Null-pointer dereference in checkout.js
npm run chaos:null

# Strike 2: 2.6s CPU spin-loop causing 504 Gateway Timeout
npm run chaos:latency

# Strike 3: Connection pool collapse (MAX_POOL_CONNECTIONS = 0) -> 503
npm run chaos:pool

# Reset: Revert target file to healthy baseline
npm run chaos:reset
```

### 4. SRE Diagnostic CLI Suite (Used by @sre-blue)

```bash
# Probe endpoint status & response latencies
npm run health

# Extract recent structured JSON error logs & stack traces
npm run logs

# Run 5-probe post-patch verification suite & MTTR scorecard
npm run verify
```

---

## [SWITCH SETUP] ROOM & MULTI-AGENT WIRING

1. Launch **Switch Console** with Docker running.
2. Import `room.template.yaml` to spin up `#chaos-gameday` bridged to Mattermost.
3. Spawn two autonomous agent sessions:
   - **Session 1 (@chaos-red)**: Bound to `@chaos-red` instructions in `agent.md`. Set addressing to `owner-only`.
   - **Session 2 (@sre-blue)**: Bound to `@sre-blue` instructions in `agent.md`. Set addressing to `anyone`.
4. When `@chaos-red` tags `@sre-blue` in Mattermost, `@sre-blue` wakes automatically without human intervention.

---

## [FILE MANIFEST] REPOSITORY LAYOUT

```
chaos-arena/
├── package.json                    # Scripts and dependencies
├── agent.md                        # Switch agent role prompt specs
├── room.template.yaml              # Switch room topology definition
├── blog.md                         # Publication writeup
├── target-service/
│   └── src/
│       ├── server.js               # Express application on port 4000
│       ├── routes/
│       │   ├── checkout.js         # POST /api/checkout (sabotage target)
│       │   ├── inventory.js        # GET /api/inventory
│       │   └── arena.js            # Control API for dashboard & battle
│       └── utils/
│           └── logger.js           # Telemetry buffer + structured log sink
├── dashboard/
│   └── index.html                  # Cyberbrutalist war-room dashboard
├── scripts/
│   ├── chaos-inject.sh             # Deterministic bug injection runner
│   ├── check-health.sh             # Live endpoint probe
│   ├── tail-logs.sh                # Structured log reader
│   └── verify-recovery.sh          # 5-probe verification scorecard
└── logs/
    └── app.log                     # Machine-readable JSON line logs
```

---

## [DEMO WALKTHROUGH] INCIDENT GAMEDAY LIFECYCLE

1. **STATE: NOMINAL** - Dashboard glows emerald green with P99 latency ~12ms, 0% error rate.
2. **STRIKE** - Human commands `@chaos-red inject a Level-2 chaos fault into checkout`.
3. **BREACH DETECTED** - Dashboard flashes crimson hazard alert, P99 spikes, error rate reaches 100%. Red Unit taunts in chat and tags `@sre-blue`.
4. **TRIAGE** - `@sre-blue` wakes, runs diagnostic scripts, isolates bug in `checkout.js:11`, and posts surgical diff awaiting human authorization.
5. **HUMAN OVERRIDE** - Human confirms: `@sre-blue heal`.
6. **RECOVERY** - `@sre-blue` patches code, executes 5 verification probes, confirms 200 OK under 100ms, and dashboard returns to NOMINAL.

---

Built with Switch, Express.js, and Tailwind CSS for the WeMakeDevs Flip the Switch Hackathon.
