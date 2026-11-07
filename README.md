# ⚡ ChaosArena

> Autonomous Red-Team vs. Blue-Team Self-Healing GameDays inside [Switch](https://switchagents.ai)

## 🎯 What is ChaosArena?

ChaosArena pits two AI agents against each other in a shared Mattermost war room powered by Switch:

- **🔴 @chaos-red** — A Red-Team Saboteur that injects realistic production faults
- **🔵 @sre-blue** — A Blue-Team SRE that detects, diagnoses, and auto-heals incidents

A live dashboard shows the outage → recovery cycle in real-time, turning from 🟢 GREEN to 🔴 RED and back as agents battle.

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Human (You)   │────▶│  Switch Console  │────▶│   Mattermost    │
│                 │     │  #chaos-gameday  │     │   (Built-in)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                              │       │
                    ┌─────────┘       └─────────┐
                    ▼                           ▼
            ┌──────────────┐           ┌──────────────┐
            │  @chaos-red  │           │  @sre-blue   │
            │  (Saboteur)  │──TAGS────▶│  (SRE Hero)  │
            └──────────────┘           └──────────────┘
                    │                           │
                    ▼                           ▼
            ┌──────────────────────────────────────────┐
            │         target-service (port 4000)       │
            │  ┌─────────┐  ┌──────────┐  ┌────────┐  │
            │  │checkout  │  │inventory │  │ health │  │
            │  │  .js     │  │   .js    │  │  /metrics│ │
            │  └─────────┘  └──────────┘  └────────┘  │
            └──────────────────────────────────────────┘
                              │
                    ┌─────────┘
                    ▼
            ┌──────────────┐
            │  Dashboard   │
            │  (index.html)│
            │  localhost:   │
            │  4000/       │
            │  dashboard   │
            └──────────────┘
```

## 🚀 Quick Start

### 1. Install & Start

```bash
npm install
npm start
```

The service starts on **http://localhost:4000** with hot-reload enabled.

### 2. Open the Dashboard

Navigate to **http://localhost:4000/dashboard** to see the live war-room monitor.

### 3. Try the Chaos Modes

```bash
# Inject a null-crash bug
npm run chaos:null

# Inject a latency bomb (2.6s blocking delay)
npm run chaos:latency

# Inject pool exhaustion (503 errors)
npm run chaos:pool

# Reset to healthy baseline
npm run chaos:reset
```

### 4. SRE Diagnostic Scripts

```bash
# Check endpoint health
npm run health

# Tail application logs
npm run logs

# Verify recovery after a fix
npm run verify
```

## 🔗 Switch Multi-Agent Setup

1. Open **Switch Console** (with Docker Desktop running)
2. Import `room.template.yaml` to create the `#chaos-gameday` room
3. Connect two agent sessions using the instructions in `agent.md`
4. See the [agent.md](./agent.md) file for full agent role instructions

## 📁 Project Structure

```
chaos-arena/
├── package.json                    # Root package with all npm scripts
├── agent.md                        # Agent role instructions for Switch
├── room.template.yaml              # Switch room configuration
├── target-service/
│   └── src/
│       ├── server.js               # Express server with telemetry
│       ├── routes/
│       │   ├── checkout.js         # POST /api/checkout (attack target)
│       │   └── inventory.js        # GET /api/inventory
│       └── utils/
│           └── logger.js           # Structured JSON logger + metrics
├── dashboard/
│   └── index.html                  # Live war-room dashboard (Tailwind)
├── scripts/
│   ├── chaos-inject.sh             # Inject chaos faults (3 modes)
│   ├── check-health.sh             # Health probe script
│   ├── tail-logs.sh                # Log tail script
│   └── verify-recovery.sh          # Recovery verification suite
└── logs/
    └── app.log                     # Structured JSON log sink
```

## 🎥 Demo Flow

1. **GREEN**: Dashboard shows all systems operational
2. **Human** → `@chaos-red inject a Level-2 chaos fault into checkout`
3. **RED**: Dashboard pulses crimson, shows 100% error rate
4. **@sre-blue** auto-wakes, runs diagnostics, posts root cause + proposed diff
5. **Human** → `@sre-blue heal`
6. **GREEN**: Dashboard returns to healthy, MTTR scorecard posted

## 🏆 Built for Flip the Switch Hackathon

Track 01: Best Business Workflow (\$2,000)

---

*Built with ❤️ using [Switch](https://switchagents.ai), Express.js, and Tailwind CSS*
