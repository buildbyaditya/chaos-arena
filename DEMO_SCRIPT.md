# // CHAOS-ARENA: 90-SECOND HACKATHON DEMO VIDEO SCRIPT
> Flip the Switch Hackathon // Track 01: Best Business Workflow ($2,000)
> Target Duration: 80 - 90 Seconds (1.0 to 1.5 Minutes)
> Core Pillars: Why We Need It, How It Works, Live Demonstration, How Switch Was Used, Future of Agentic Workflows
> Strict Constraint: Strict Zero Emojis Throughout

---

## 1. PRE-FLIGHT RECORDING SETUP

* **Screen Arrangement (50/50 Split View)**:
  * **Left Side (50%)**: Switch Console / Mattermost `#chaos-gameday` chat channel.
  * **Right Side (50%)**: ChaosArena Cyberbrutalist Tactical War Room Monitor at `http://localhost:4000/dashboard`.
* **Audio Setup**:
  * Ensure system microphone and desktop audio are both enabled to record your voiceover plus the browser's Web Audio klaxon alarm and harmonic recovery chime.
* **Target Service State**:
  * Ensure `npm start` is active on port 4000 (`node --watch`).
  * Verify baseline health (`curl http://localhost:4000/health` returns HTTP 200, SLO 100%).

---

## 2. TIMED SCRIPT WITH DUAL-COLUMN VISUAL & AUDIO BEATS

```
┌───────────────────────────────────────────────────┬───────────────────────────────────────────────────┐
│ WHAT JUDGES SEE ON SCREEN                         │ WHAT YOU SAY (SPOKEN VOICEOVER)                   │
├───────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
│ [0:00 - 0:18] WHY WE NEED IT                      │                                                   │
│ Left: Mattermost channel #chaos-gameday idle.     │ "Single AI coding agents can write isolated code, │
│ Right: Dashboard glowing emerald green (SLO 100%, │ but they operate in silos. In enterprise          │
│ P99 12ms, 0% errors, core shield nominal).        │ production, systems fail under complex runtime    │
│ Cursor points to the 3 microservice fixtures.     │ pressure. Today, chaos engineering and incident   │
│                                                   │ response are manual, stressful, and slow.         │
│                                                   │                                                   │
│                                                   │ Enter ChaosArena: an autonomous Red-vs-Blue       │
│                                                   │ self-healing GameDay room powered by Switch."     │
├───────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
│ [0:18 - 0:40] HOW IT WORKS: THE RED STRIKE        │                                                   │
│ Left (Mattermost): Operator enters:               │ "Here is how it works under the hood:             │
│ '@chaos-red inject a Level-1 chaos fault into     │ Our Express microservice hot-reloads in under     │
│ checkout'                                         │ 30 milliseconds. To prevent rogue AI attacks,     │
│                                                   │ Switch configures @chaos-red with 'owner-only'    │
│ Right (Dashboard):                                │ addressing—it only acts on direct human command.  │
│ - Fault-Injector mecha charges forward.           │                                                   │
│ - Red laser beam strikes the core shield.         │ Red mutates the live AST on disk. Immediately,    │
│ - /api/checkout drops to HTTP 500 (TypeError).    │ our Web Audio klaxon sounds, the core shield      │
│ - Error rate spikes to 100%. Klaxon alarm blares. │ shatters, error rates hit 100%, and the MTTR      │
│ - Outage MTTR timer starts ticking.               │ stopwatch starts. Red broadcasts the symptoms to  │
│ - Red tags @sre-blue in Mattermost.               │ the team and tags @sre-blue."                     │
├───────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
│ [0:40 - 1:02] HOW WE USED SWITCH: AUTONOMOUS      │                                                   │
│ DETECTION & HUMAN-IN-THE-LOOP SAFEGUARD           │                                                   │
│ Left (Mattermost): @sre-blue wakes up             │ "This is where Switch AI makes the difference:    │
│ automatically without human prompting.            │ Because Switch supports 'anyone' addressing,      │
│ Right (Dashboard):                                │ @sre-blue wakes up autonomously upon being tagged │
│ - Holographic matrix scanner sweeps the system.   │ in Mattermost.                                    │
│ - Log-Analyzer mecha isolates stack trace.        │                                                   │
│                                                   │ Blue executes deterministic shell probes,         │
│ Left (Mattermost): @sre-blue prints:              │ activates our holographic system scanner, and     │
│ - Isolated line: checkout.js:11                   │ extracts the exact TypeError at line 11 from      │
│ - Surgical git diff preview.                      │ logs/app.log.                                     │
│ - Halts: 'Reply @sre-blue heal to approve'        │                                                   │
│                                                   │ Most importantly, Switch provides human-in-the-   │
│                                                   │ loop governance: the AI pauses and demands human  │
│                                                   │ authorization before modifying production files." │
├───────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
│ [1:02 - 1:18] LIVE HEALING & VERIFIED RECOVERY    │                                                   │
│ Left (Mattermost): Operator replies:              │ "We confirm with '@sre-blue heal'.                │
│ '@sre-blue heal'                                  │                                                   │
│ Right (Dashboard):                                │ Auto-Patcher deploys the surgical git diff.       │
│ - Auto-Patcher advances with slow healing motion. │ The service hot-reloads, and Blue executes 5      │
│ - Emerald restoration grid expands over core.     │ sequential verification probes across our live    │
│ - 5 probes tick green: [Probe 1/5: PASS] ...      │ endpoints in real time.                           │
│ - Klaxon stops. Harmonic recovery chime plays.    │                                                   │
│ - MTTR Scorecard locks at 2.4s.                   │ All 5 probes pass. The alarm silences, the core   │
│                                                   │ shield locks back to 100% nominal, and our MTTR   │
│                                                   │ scorecard locks in at 2.4 seconds."               │
├───────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
│ [1:18 - 1:30] FUTURE OF AGENTIC WORKFLOWS         │                                                   │
│ Focus switches to 'HOW SWITCH POWERS THIS         │ "Why is Switch the future of agentic workflows?   │
│ GAMEDAY' panel and the live chat bridge.          │ Today, AI agents are isolated to code editors.    │
│ Concludes with full-screen view of nominal        │ Switch bridges agents directly into collaborative │
│ dashboard and GitHub repository URL               │ team channels with selective addressing, blast-   │
│ (https://github.com/buildbyaditya/chaos-arena).   │ radius containment, and strict governance.        │
│                                                   │ radius containment, and strict governance.        │
│                                                   │                                                   │
│                                                   │ ChaosArena powered by Switch: The future of       │
│                                                   │ microservices isn't unmonitored; it's             │
│                                                   │ self-healing."                                    │
└───────────────────────────────────────────────────┴───────────────────────────────────────────────────┘
```

---

## 3. TELEPROMPTER CLEAN READ (RECORDING AUDIO TRACK ONLY)

"Single AI coding agents can write isolated code, but they operate in silos. In enterprise production, systems fail under complex runtime pressure. Today, chaos engineering and incident response are manual, stressful, and slow.

Enter ChaosArena: an autonomous Red-vs-Blue self-healing GameDay room powered by Switch.

Here is how it works under the hood:
Our Express microservice hot-reloads in under 30 milliseconds. To prevent rogue AI attacks, Switch configures @chaos-red with 'owner-only' addressing—it only acts on direct human command.

Red mutates the live AST on disk. Immediately, our Web Audio klaxon sounds, the core shield shatters, error rates hit 100%, and the MTTR stopwatch starts. Red broadcasts the symptoms to the team and tags @sre-blue.

This is where Switch AI makes the difference:
Because Switch supports 'anyone' addressing, @sre-blue wakes up autonomously upon being tagged in Mattermost.

Blue executes deterministic shell probes, activates our holographic system scanner, and extracts the exact TypeError at line 11 from logs/app.log.

Most importantly, Switch provides human-in-the-loop governance: the AI pauses and demands human authorization before modifying production files.

We confirm with '@sre-blue heal'.

Auto-Patcher deploys the surgical git diff. The service hot-reloads, and Blue executes 5 sequential verification probes across our live endpoints in real time.

All 5 probes pass. The alarm silences, the core shield locks back to 100% nominal, and our MTTR scorecard locks in at 2.4 seconds.

Why is Switch the future of agentic workflows?
Today, AI agents are isolated to code editors. Switch bridges agents directly into collaborative team channels with selective addressing, blast-radius containment, and strict governance.

ChaosArena powered by Switch: The future of microservices isn't unmonitored; it's self-healing."

---

## 4. KEY SWITCH DIFFERENTIATORS FOR HACKATHON JUDGES

1. **Selective Addressing Model**:
   - `@chaos-red` set to `addressing: owner-only` ensures safe chaos containment (AI cannot attack on its own).
   - `@sre-blue` set to `addressing: anyone` enables autonomous cross-agent incident wakeup when tagged by Red.
2. **Channel-Native Multi-Agent Collaboration**:
   - Rather than private terminal sessions, Switch brings autonomous agents into `#chaos-gameday` on Mattermost where the whole engineering team has full auditability.
3. **Deterministic Tool Grounding**:
   - Rather than hallucinating arbitrary shell commands, agents execute tested shell utilities (`chaos-inject.sh`, `check-health.sh`, `tail-logs.sh`, `verify-recovery.sh`).
4. **Mandatory Human-in-the-Loop Governance**:
   - The SRE agent diagnoses and formulates the exact surgical diff, but execution is gated on explicit human confirmation (`@sre-blue heal`), satisfying enterprise compliance.

---

## 5. REPOSITORY & PROJECT REFERENCES

* **GitHub Repository**: [https://github.com/buildbyaditya/chaos-arena](https://github.com/buildbyaditya/chaos-arena)
* **Switch Console Template**: `room.template.yaml`
* **Technical Article & Architecture Post**: `blog.md`
* **Agent System Prompts & Tool Directives**: `agent.md`
