# CHAOS-ARENA

> Autonomous Red-Team vs. Blue-Team Self-Healing GameDays inside [Switch](https://switchagents.ai)  
> Flip the Switch Hackathon // Track 01: Best Business Workflow  
> Official Repository: [https://github.com/buildbyaditya/chaos-arena](https://github.com/buildbyaditya/chaos-arena)  

---

## [MISSION] WHAT IS CHAOS-ARENA?

ChaosArena pits two autonomous AI anime-styled combat squads against each other in a shared Mattermost war room powered by Switch:

- **RED ADVERSARY SQUAD**:
  - `CHAOS-RED` (Lead Saboteur Mecha) - Orchestrates multi-vector chaos strikes.
  - `FAULT-INJECTOR` (Surgical AST Null Saboteur) - Mutates AST nodes to trigger uncaught TypeErrors.
  - `TRAFFIC-FLOODER` (Latency & Pool Stressor) - Injects CPU spin-loops (504s) and exhausts connection pools (503s).
- **BLUE SENTINEL SQUAD**:
  - `@SRE-BLUE` (Commander Mecha) - Coordinates diagnostic sweeps and human-in-the-loop approvals.
  - `LOG-ANALYZER` (Stack Trace & AST Isolator) - Parses `logs/app.log` JSON frames to pinpoint faulty lines.
  - `AUTO-PATCHER` (Hotpatch & Verification Healer) - Generates surgical diffs, restores baseline, and verifies 5 sequential probes.

A real-time cyberbrutalist war-room dashboard streams telemetry, health probes, P99 latencies, contested fixture monolith statuses, and tactical comms transmissions in real-time. Designed to 100% precision matching industrial cyberbrutalist aesthetics: Obsidian black (`#060609`), 2px solid industrial borders, brutalist box-shadows, Neon Red (`#ff003c`), Neon Cyan (`#00f0ff`), Acid Yellow (`#fcee0a`), Emerald Nominal (`#00ff66`), and live animated mecha squads with central SVG tactical vector clash HUD. Strictly zero emojis throughout.

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
  [CHAOS-RED]                                                  [@SRE-BLUE]
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

## [SWITCH INTEGRATION] HOW WE USE SWITCH IN CHAOS-ARENA

Switch (https://www.switchagents.ai/) serves as the foundational communication, addressing, and governance layer for ChaosArena. Rather than running disconnected terminal scripts or isolated LLM API calls, Switch transforms autonomous agents into cooperative and adversarial engineering actors inside an enterprise chat channel.

Here is how Switch is specifically implemented in the project:

### 1. Declarative Room Topology (`room.template.yaml`)
ChaosArena defines its entire multi-agent environment as a declarative, version-controlled Switch room template (`room.template.yaml`). When imported into Switch Console, it automatically spins up the `#chaos-gameday` channel on the built-in Mattermost bridge, provisions the workspace mount, binds role prompts from `agent.md`, and registers both agents with custom permissions.

### 2. Selective Addressing Model (`owner-only` vs. `anyone`)
Switch provides a granular addressing system that enables safe multi-agent division of labor:
- **`@chaos-red` (`addressing: owner-only`)**: Red-team saboteur operations must never execute autonomously or trigger runaway failures without human authorization. By restricting `@chaos-red` to `owner-only`, only the designated incident commander can order a chaos strike.
- **`@sre-blue` (`addressing: anyone`)**: Incident triage requires autonomous activation. By granting `@sre-blue` `anyone` addressing, it wakes up the moment `@chaos-red` tags it in `#chaos-gameday` or an automated monitoring bot sounds an alarm, starting the diagnostic sweep without human delay.

### 3. Mattermost Channel Bridging (`#chaos-gameday`)
Rather than burying AI outputs in private terminal buffers or detached browser windows, Switch bridges both CLI agents directly into a shared Mattermost room. This mirrors modern enterprise ChatOps:
- Every attack declaration, health probe summary, stack trace extraction, and recovery scorecard is logged into the team channel in real time.
- Engineers and judges can follow the complete incident response narrative chronologically in their existing team chat workspace.

### 4. Mandatory Human-in-the-Loop Governance
Uncontrolled autonomous code modification in production leads to cascading outages. ChaosArena utilizes Switch to enforce human-in-the-loop governance:
- When `@sre-blue` isolates the root cause (`checkout.js:11`), it drafts the surgical git diff, posts it in `#chaos-gameday`, and explicitly halts execution.
- Switch preserves agent state while waiting for the human commander's reply (`@sre-blue heal`). Only upon receiving this human approval does the agent execute the hotpatch and verification suite.

### 5. Deterministic Tool Execution Over Hallucination
Switch agents are grounded with deterministic shell scripts (`scripts/chaos-inject.sh`, `scripts/check-health.sh`, `scripts/tail-logs.sh`, `scripts/verify-recovery.sh`). Instead of hallucinating fragile one-liner commands or guessing socket states, agents invoke standardized, tested shell utilities that interact cleanly with the target service and structured telemetry bus.

---

## [THE FUTURE OF AGENTIC WORKFLOWS] WHY SWITCH IS ESSENTIAL

The current generation of AI developer tools primarily focuses on single-agent code completion inside isolated IDEs. While useful for writing standalone functions, single-agent setups fail when addressing complex, collaborative enterprise workflows like incident management, security red-teaming, or architectural migration.

Switch represents the paradigm shift toward production-ready agentic workflows for the following reasons:

### 1. From Siloed Chatbots to Enterprise Multi-Agent Swarms
In real organizations, complex problems require distinct roles with competing or complementary mandates (e.g., Security Auditor vs. Software Engineer, Red-Team Adversary vs. Blue-Team SRE). Switch provides the orchestration mesh allowing multiple specialized agents to live in the same project, read shared files, and communicate through standard team channels without stepping on each other's execution context.

### 2. Safe Blast-Radius Containment
Autonomous agents with open-ended tool access present severe security and operational risks. Switch's role-based access control, selective addressing, and isolated working directories establish hard perimeter boundaries. Organizations can confidently deploy adversarial or experimental agents knowing that their blast radius is bounded by Switch's declarative room policies.

### 3. Native Channel Integration as the Source of Truth
Instead of forcing human teams to learn new proprietary agent UIs, Switch embeds agents where engineers already work: Mattermost, Slack, Discord, and terminal shells. This turns chat channels into interactive control planes where humans and AI agents collaborate side-by-side with full visibility, searchable history, and compliance logging.

### 4. Autonomous Handoffs with Human Verification
The future of software operations is not fully manual, nor is it recklessly autonomous. It is supervised autonomy. Switch enables seamless agent-to-agent handoffs (e.g., Monitoring Agent -> Triage Agent -> Patching Agent) while providing deterministic pause points where human operators verify proposed mutations. ChaosArena proves this model: MTTR drops from hours to seconds while maintaining zero risk of unapproved production mutations.

### 5. Continuous Proactive Resilience (Automated GameDays)
Historically, chaos gamedays were rare, scheduled events requiring dozens of engineers on high alert. Powered by Switch, enterprises can run automated, continuous micro-gamedays on staging and canary clusters daily. Red agents inject controlled, realistic production bugs, blue agents verify detection and healing, and leadership receives quantified MTTR scorecards—turning reliability from a reactive panic into a continuous, self-healing business workflow.

---

## [QUICK START] EXECUTION INSTRUCTIONS

### 1. Clone & Boot Microservice

```bash
git clone https://github.com/buildbyaditya/chaos-arena.git
cd chaos-arena
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

### 5. Verified Execution Output (Post-Heal Recovery & Scorecard)

```text
=== ChaosArena SRE Diagnostic Probe [UNIT-02 // SRE-BLUE] ===
GET  /api/inventory -> HTTP 200 (25ms)
POST /api/checkout  -> HTTP 200 (30ms)
STATUS: [+] ALL ENDPOINTS HEALTHY // SLO WITHIN NOMINAL BOUNDS

=== Running Post-Patch Recovery Verification Suite (5 Probes) ===
  [Probe 1/5] PASS -> HTTP 200 in 25ms
  [Probe 2/5] PASS -> HTTP 200 in 26ms
  [Probe 3/5] PASS -> HTTP 200 in 26ms
  [Probe 4/5] PASS -> HTTP 200 in 29ms
  [Probe 5/5] PASS -> HTTP 200 in 26ms

========================================
  MTTR RECOVERY SCORECARD
========================================
  Probes Passed: 5 / 5
  Status: [+] FULL RECOVERY CONFIRMED
  All endpoints returning HTTP 200
  All latencies under 250ms SLO
========================================
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

Live Demo @ https://buildbyaditya.github.io/chaos-arena/

Built with Switch, Express.js, and Tailwind CSS for the WeMakeDevs Flip the Switch Hackathon.  
GitHub Repository: [https://github.com/buildbyaditya/chaos-arena](https://github.com/buildbyaditya/chaos-arena)
