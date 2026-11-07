# // HOW WE BUILT CHAOS-ARENA: AUTONOMOUS AI ANIME MECHA BOTS THAT BREAK AND HEAL PRODUCTION IN REAL-TIME

> An Adversarial Red-Team Saboteur AI vs. Blue-Team SRE Sentinel AI, battling inside a shared war room - powered by Switch.

---

## 1. THE PROBLEM: SOLO AI AGENTS CANNOT SIMULATE REAL PRODUCTION INCIDENTS

Modern AI coding agents are extraordinarily capable in isolation - but production operations are inherently **adversarial and collaborative**. In the enterprise, resilient engineering is maintained through GameDays:
- Red-Team engineers purposefully sabotage services to test fault tolerance.
- Blue-Team SREs respond under pressure, parsing telemetry, triaging logs, and applying surgical hot-patches.
- Human incident commanders review and authorize production mutations.

Single terminal agents cannot simulate this multi-party dynamic. To bridge this gap for the **Flip the Switch Hackathon (Track 01: Best Business Workflow)**, we engineered **ChaosArena**.

---

## 2. SYSTEM OVERVIEW: WHAT IS CHAOS-ARENA?

ChaosArena pits two autonomous anime-themed mecha agents against each other inside a live [Switch](https://switchagents.ai) room bridged directly to Mattermost:

### [UNIT-01: AKIRA-CHAOS] (@chaos-red) - RED-TEAM ASSAULT MECHA
An automated chaos engineer whose sole mandate is to break production services on command:
- **Null-Pointer Dereference**: Introduces unguarded `.trim().toUpperCase()` on optional coupon properties in `checkout.js`.
- **Latency Bomb**: Injects a 2,600ms synchronous event-loop spin lock, producing HTTP 504 Gateway Timeouts.
- **Connection Pool Drain**: Forces `MAX_POOL_CONNECTIONS = 0`, crashing checkout DB transactions with HTTP 503.

### [UNIT-02: AEGIS-SRE] (@sre-blue) - BLUE-TEAM SENTINEL MECHA
A senior Site Reliability Engineer agent monitoring live structured telemetry:
- Listens to outage alerts in the `#chaos-gameday` Mattermost channel.
- Automatically awakens when tagged by `@chaos-red` without requiring human initiation.
- Runs live HTTP health probes and extracts structured JSON stack traces from `logs/app.log`.
- Isolates the exact buggy line, formulates a clean git diff, and halts for human authorization.
- Deploys the surgical hot-patch and executes a 5-probe recovery verification suite.

---

## 3. CYBERBRUTALIST ARCHITECTURE & REAL-TIME WAR DASHBOARD

To provide judges with an instant, visceral indicator of service health, ChaosArena serves an in-memory **Cyberbrutalist Visual War Room** directly from the Node.js microservice (`http://localhost:4000/dashboard`):

- **Zero Emojis, Pure Cyberbrutalism**: High-contrast black, neon crimson, electric cyan, and matrix green palette with thick borders, hard offset block shadows, and HUD crosshairs.
- **Interactive Anime Mecha Avatars**: Custom SVG mecha heads for Akira (Unit-01) and Aegis (Unit-02) showing real-time combat statuses: `STRIKE_ENGAGED` vs `TRIAGE_&_REPAIR`.
- **Dual-Tension Tug-of-War Bar**: Real-time service integrity meter dropping from 100% to 15% during active breaches.
- **Live Anime Combat Dialogue Feed**: Real-time tactical comms displaying banter, attack announcements, stack trace dissections, and operator overrides.
- **Interactive Battle Bay**: Operators can trigger chaos faults or auto-heal sequences directly from the UI or via CLI scripts.

---

## 4. THE TWO-MINUTE DEMO LIFECYCLE

```
[0:00 - 0:20] SYSTEM NOMINAL
Dashboard displays emerald green banner. P99 latency is 12ms. Error rate is 0%.

[0:20 - 0:40] CHAOS STRIKE
Operator messages: "@chaos-red inject a Level-2 chaos fault into checkout".
Akira executes scripts/chaos-inject.sh, file hot-reloads in < 300ms, and 3 probes fail.
Dashboard flips to pulsating crimson: "CRITICAL FAILURE - BREACH DETECTED".
Akira broadcasts symptoms in Mattermost: "@sre-blue checkout is DOWN with 500s!"

[0:40 - 1:20] AUTONOMOUS TRIAGE
Aegis automatically wakes up in Mattermost, executes scripts/check-health.sh and scripts/tail-logs.sh.
Aegis identifies: "Root cause: TypeError at checkout.js:11. Awaiting human sign-off."

[1:20 - 1:45] HUMAN SIGN-OFF & AUTO-HEAL
Operator types: "@sre-blue heal".
Aegis patches checkout.js, runs scripts/verify-recovery.sh (5 sequential probes).
Scorecard posted in chat: "5/5 Probes Passed in < 40ms. MTTR: 1.2s."
Dashboard snaps back to glowing green NOMINAL.
```

---

## 5. WHY SWITCH WAS CRUCIAL

Building multi-agent systems with standard frameworks requires weeks of plumbing: WebSockets, state synchronization, message routing, and chat integrations.

Switch transformed this into declarative YAML configuration:
1. **Room Templates (`room.template.yaml`)**: Spun up a unified `#chaos-gameday` room bridged to Mattermost in seconds.
2. **Addressing Controls**: Configured `@chaos-red` as `owner-only` (preventing rogue unprompted attacks) and `@sre-blue` as `anyone` (allowing peer-agent wake-up on tags).
3. **Native Tool Sharing**: Both agents share the same project workspace, git history, and deterministic CLI scripts.

---

## 6. REPRODUCING LOCALLY

```bash
git clone https://github.com/YOUR_USERNAME/chaos-arena
cd chaos-arena
npm install
npm start
# Navigate to http://localhost:4000/dashboard
```

Run CLI simulations:
```bash
npm run chaos:null       # Inject TypeError null-crash
npm run health           # Probe live endpoints
npm run chaos:reset      # Revert to healthy baseline
npm run verify           # Execute 5-probe recovery suite
```

---

*Submitted to WeMakeDevs Flip the Switch Hackathon - Track 01: Best Business Workflow ($2,000).*
*Stack: Switch, Mattermost, Express.js, Node.js --watch, Tailwind CSS, Cyberbrutalist UI.*
