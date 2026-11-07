# // CHAOS-ARENA: 90-SECOND HACKATHON DEMO VIDEO SCRIPT
> Flip the Switch Hackathon // Track 01: Best Business Workflow ($2,000)
> Target Duration: 80 - 90 Seconds
> Strict Constraint: Zero Emojis Throughout

---

## RECORDING SETUP & PRE-FLIGHT CHECKLIST

1. **Screen Layout (50/50 Split Screen)**:
   - **Left Window (50%)**: Switch Console / Mattermost Channel `#chaos-gameday`.
   - **Right Window (50%)**: Live Cyberbrutalist Tactical War Room Monitor at `http://localhost:4000/dashboard`.
2. **Audio Setup**:
   - Ensure system audio is enabled so the browser's Web Audio klaxon alarm and harmonic recovery chime are captured cleanly.
3. **Pristine Baseline**:
   - Ensure target service is running: `npm start` (port 4000).
   - Ensure system is healthy: Dashboard glowing emerald green, SLO 100%, 0% error rate.

---

## SCENE-BY-SCENE TIMELINE & VOICE-OVER SCRIPT

### [SCENE 01: THE HOOK & THE ENTERPRISE PROBLEM]
- **Timestamp**: `0:00 - 0:15` (15 Seconds)
- **Visual on Screen**: 
  - Split-screen view. The right window shows `http://localhost:4000/dashboard` glowing emerald green with nominal telemetry: P99 Latency ~12ms, 0% error rate, Core Shield at 100%.
  - The left window displays Mattermost `#chaos-gameday` with `@chaos-red` and `@sre-blue` online.
- **Voiceover**:
  > "Single AI coding agents can write functions, but they cannot stress-test real-world enterprise resilience under pressure.
  > 
  > Welcome to ChaosArena: an autonomous Red-Team vs. Blue-Team self-healing GameDay room powered by Switch."

---

### [SCENE 02: THE RED STRIKE & SELECTIVE ADDRESSING]
- **Timestamp**: `0:15 - 0:35` (20 Seconds)
- **Visual on Screen**:
  - In Mattermost (left), the human operator types:
    `@chaos-red inject a Level-1 chaos fault into checkout`
  - Instantly, `@chaos-red` executes `./scripts/chaos-inject.sh null-crash`.
  - On the Dashboard (right):
    - Red mecha advances forward with charge animation.
    - Central Core Shield bursts with red corruption sparks.
    - `/api/checkout` flips to HTTP 500. Error rate spikes to 100%.
    - The dual-tone Web Audio cyber klaxon alarm activates.
    - Outage MTTR stopwatch starts ticking.
  - In Mattermost, `@chaos-red` announces:
    `[BREACH_DETECTED] POST /api/checkout returning HTTP 500! @sre-blue investigate immediately!`
- **Voiceover**:
  > "Here is how we use Switch:
  > `@chaos-red` is locked with 'owner-only' addressing, so it can never trigger unauthorized chaos without human permission.
  > 
  > Red injects a surgical AST null-dereference into our live Express microservice. The dashboard flashes crimson, our cyber klaxon sounds, and the MTTR timer starts. Red tags `@sre-blue` in the shared channel."

---

### [SCENE 03: AUTONOMOUS WAKEUP & HOLOGRAPHIC TRIAGE]
- **Timestamp**: `0:35 - 0:55` (20 Seconds)
- **Visual on Screen**:
  - In Mattermost, `@sre-blue` wakes up autonomously with zero human intervention.
  - On the Dashboard:
    - The Holographic Scanner activates, sweeping across all 3 fixtures (Checkout, Inventory, DB Pool).
    - Log-Analyzer mecha sweeps `logs/app.log`.
  - In Mattermost, `@sre-blue` posts its diagnostic trace:
    `[SRE-BLUE] Root cause isolated at checkout.js:11. Unguarded coupon.code dereference.`
    `Proposed Diff: - coupon.code.trim() / + coupon && coupon.code ? coupon.code.trim() : 'NONE'`
    `[AUTH_REQUIRED] Reply '@sre-blue heal' to authorize production hotpatch.`
- **Voiceover**:
  > "Because Switch supports 'anyone' addressing, `@sre-blue` wakes up autonomously when tagged.
  > 
  > It triggers our deterministic CLI probes, activates the holographic system scanner, extracts the exact stack trace at checkout.js line 11 from logs/app.log, and formulates a surgical git diff.
  > 
  > Crucially, Switch enforces human-in-the-loop governance: the AI halts and demands explicit operator approval before touching production."

---

### [SCENE 04: SLOWED CINEMATIC HEALING & VERIFICATION]
- **Timestamp**: `0:55 - 1:15` (20 Seconds)
- **Visual on Screen**:
  - In Mattermost, the human operator types:
    `@sre-blue heal`
  - On the Dashboard:
    - Auto-Patcher mecha powers up and advances smoothly.
    - The emerald restoration grid expands over the monolith core.
    - The code hot-reloads on disk in less than 30ms via `node --watch`.
    - 5 sequential verification probes execute one-by-one in real time:
      `[Probe 1/5: PASS] -> [Probe 2/5: PASS] -> ... -> [Probe 5/5: PASS]`.
    - Klaxon alarm silences; harmonic recovery chime plays.
    - All 3 fixtures return to 200 OK.
    - MTTR Scorecard displays: `MTTR: 2.4s // FULL RECOVERY CONFIRMED`.
- **Voiceover**:
  > "We reply '@sre-blue heal'.
  > 
  > Auto-Patcher deploys the fix. Our Express service hot-reloads in less than 30 milliseconds. Blue executes 5 sequential verification probes across our inventory and checkout endpoints.
  > 
  > All probes pass under 30 milliseconds. The alarm silences, the core shield locks back to nominal, and our MTTR scorecard locks in at 2.4 seconds."

---

### [SCENE 05: WHY SWITCH IS THE FUTURE OF AGENTIC WORKFLOWS]
- **Timestamp**: `1:15 - 1:30` (15 Seconds)
- **Visual on Screen**:
  - Camera focuses on the 'HOW SWITCH POWERS CHAOS-ARENA' section on the dashboard and the live Mattermost channel.
  - Final full-screen view of the recovered green dashboard with the project title and GitHub URL.
- **Voiceover**:
  > "Why does this matter for the future of agentic workflows?
  > 
  > Switch transforms AI from isolated toy chatbots into enterprise-grade multi-agent teams. Selective addressing contains blast radiuses, Mattermost bridging gives teams full visibility, and deterministic CLI execution guarantees zero flakiness.
  > 
  > ChaosArena powered by Switch: The future of microservices isn't unmonitored; it's self-healing."

---

## QUICK REFERENCE TELEPROMPTER COPY (PLAIN TEXT)

"Single AI coding agents can write functions, but they cannot stress-test real-world enterprise resilience under pressure.

Welcome to ChaosArena: an autonomous Red-Team vs. Blue-Team self-healing GameDay room powered by Switch.

Here is how we use Switch:
@chaos-red is locked with 'owner-only' addressing, so it can never trigger unauthorized chaos without human permission.

Red injects a surgical AST null-dereference into our live Express microservice. The dashboard flashes crimson, our cyber klaxon sounds, and the MTTR timer starts. Red tags @sre-blue in the shared channel.

Because Switch supports 'anyone' addressing, @sre-blue wakes up autonomously when tagged.

It triggers our deterministic CLI probes, activates the holographic system scanner, extracts the exact stack trace at checkout.js line 11 from logs/app.log, and formulates a surgical git diff.

Crucially, Switch enforces human-in-the-loop governance: the AI halts and demands explicit operator approval before touching production.

We reply '@sre-blue heal'.

Auto-Patcher deploys the fix. Our Express service hot-reloads in less than 30 milliseconds. Blue executes 5 sequential verification probes across our inventory and checkout endpoints.

All probes pass under 30 milliseconds. The alarm silences, the core shield locks back to nominal, and our MTTR scorecard locks in at 2.4 seconds.

Why does this matter for the future of agentic workflows?

Switch transforms AI from isolated toy chatbots into enterprise-grade multi-agent teams. Selective addressing contains blast radiuses, Mattermost bridging gives teams full visibility, and deterministic CLI execution guarantees zero flakiness.

ChaosArena powered by Switch: The future of microservices isn't unmonitored; it's self-healing."
