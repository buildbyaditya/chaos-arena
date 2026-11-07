# Product Requirements Document (PRD): ChaosArena

## 1. Executive Summary
**Product Name:** ChaosArena  
**Tagline:** Autonomous Red-Team vs. Blue-Team Self-Healing GameDays inside Switch.  
**Problem Statement:** Engineering teams rarely practice incident response or chaos engineering because coordinating GameDays takes hours of manual setup, and solo AI coding agents cannot simulate real multi-party incident rooms with strict information boundaries.  
**Solution:** ChaosArena uses **Switch** to bring two adversarial AI agents (`@Chaos-Red` and `@SRE-Blue`) and human engineers into a shared war-room channel (`#chaos-gameday`). `@Chaos-Red` injects realistic production faults into a live service; `@SRE-Blue` autonomously diagnoses logs and stack traces, drafts a surgical hotfix, and waits for human approval in chat to heal the service.

## 2. Target Users
- **SRE & DevOps Teams:** Run automated, continuous GameDays to test observability and incident response readiness.
- **Backend Engineering Teams:** Validate whether their logging and alerting provide enough context for on-call responders (human or AI) to isolate bugs quickly.

## 3. Core User Journey (The 2-Minute Hackathon Demo Flow)
1. **Baseline (0:00 - 0:20):** The `target-service` is running cleanly. The live dashboard shows **100% Uptime, 14ms Latency (GREEN)**.
2. **Attack Command (0:20 - 0:40):** In the Switch `#chaos-gameday` room, the human engineer types:
   > `@Chaos-Red launch a Level-2 chaos attack on checkout`
3. **Sabotage & Symptom Alert (0:40 - 1:00):** `@Chaos-Red` injects a realistic bug into `checkout.js` (e.g., an unhandled discount-code parsing crash + latency spike), triggers failing traffic so the dashboard turns **RED (HTTP 500)**, and posts in chat:
   > *"[CHAOS] **CHAOS INJECTED!** External monitors report `POST /api/checkout` is throwing HTTP 500s and P99 latency spiked to 3,200ms. Good luck finding it, @SRE-Blue!"*
4. **Autonomous Triage & RCA (1:00 - 1:30):** `@SRE-Blue` wakes up in the room, runs `./scripts/check-health.sh` and `./scripts/tail-logs.sh`, inspects the stack trace in `logs/app.log`, locates the exact bug in `target-service/src/routes/checkout.js`, and posts:
   > *" **RCA Complete:** Found unguarded `.toUpperCase()` on null `couponCode` + blocking synchronous loop at `checkout.js:42`. Proposed surgical diff attached below. @Human reply `@SRE-Blue heal` to apply patch."*
5. **Human Approval & Self-Healing (1:30 - 2:00):** The human replies `@SRE-Blue heal`. `@SRE-Blue` patches the file, runs `./scripts/verify-recovery.sh`, the live dashboard turns **GREEN**, and `@SRE-Blue` posts the final MTTR (Mean Time To Recovery) scorecard.

## 4. Success Metrics
- **Mean Time to Detect (MTTD):** < 10 seconds from symptom broadcast.
- **Mean Time to Remediate (MTTR):** < 45 seconds including human approval.
- **Zero Unauthorized Mutations:** 100% of production file fixes gated behind human chat approval.