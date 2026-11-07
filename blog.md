# How We Built ChaosArena: AI Agents That Break and Heal Production Systems in Real-Time

> A Red-Team saboteur AI vs. a Blue-Team SRE AI, battling it out in a shared war room — powered by Switch.

---

## The Problem: Solo AI Agents Can't Simulate Real Incident Response

Modern AI coding agents are powerful — but they work alone. A single agent can write code, debug errors, and run tests. But real-world production incident response is **multi-party**: there's a team causing failures (planned chaos engineering), a team detecting and remediating them (SRE on-call), and humans making the final call.

Solo terminal agents can't simulate this adversarial, collaborative dynamic. That's why we built **ChaosArena**.

## What is ChaosArena?

ChaosArena is a multi-agent chaos engineering platform that pits two autonomous AI agents against each other inside a shared [Switch](https://switchagents.ai) chat room:

### 🔴 @chaos-red — The Red-Team Saboteur
A chaos engineering specialist that injects realistic production faults into a live microservice. It simulates the kinds of bugs that bring down real production systems:
- **Null-crash**: Unguarded property access on undefined objects (the classic TypeError)
- **Latency bomb**: A synchronous CPU spin loop that blocks the event loop for 2.6 seconds
- **Pool exhaustion**: A misconfigured connection pool that rejects all database transactions

### 🔵 @sre-blue — The Blue-Team SRE
A senior Site Reliability Engineer that autonomously detects outages, reads structured logs, identifies the exact broken line of code, proposes a surgical fix, and waits for human sign-off before applying it.

### The Magic: They Talk to Each Other

Using Switch's multi-agent room bridged to Mattermost, `@chaos-red` and `@sre-blue` communicate in the same channel. When `@chaos-red` breaks the service and tags `@sre-blue`, the SRE agent **automatically wakes up** and begins its investigation — no human prompting needed.

## The Architecture

The target is a Node.js/Express microservice running on port 4000 with:
- **POST /api/checkout** — The attack surface for chaos injection
- **GET /api/inventory** — A stable read-only endpoint for comparison
- **GET /metrics** — Real-time telemetry powering the live dashboard
- **Hot reload** via `node --watch` — code changes take effect in < 300ms

A **live war-room dashboard** polls `/metrics` every second and visually flips between:
- 🟢 **Emerald green** — "SYSTEM OPERATIONAL" with P99 latency ~12ms
- 🔴 **Pulsing crimson** — "CRITICAL OUTAGE" with error rate at 100%

## The Demo in 2 Minutes

1. **0:00** — Green dashboard. Everything is healthy.
2. **0:20** — Human commands: `@chaos-red inject a Level-2 chaos fault`
3. **0:25** — Dashboard turns RED. `@chaos-red` posts: "🚨 CHECKOUT IS DOWN!"
4. **0:30** — `@sre-blue` auto-wakes, runs health checks and log analysis
5. **1:00** — `@sre-blue` posts: "Root cause: line 11, spin loop blocking event loop. Here's my diff."
6. **1:30** — Human types: `@sre-blue heal`
7. **1:35** — `@sre-blue` patches the file, runs verification suite
8. **1:45** — Dashboard turns GREEN. MTTR scorecard: 5/5 probes passed ✅

## Why Switch?

Switch made the multi-agent orchestration trivial:
- **Room templates** define agent roles, addressing rules, and instructions
- **Mattermost bridge** gives us a real chat UI for the demo
- **Addressing modes** (`owner-only` vs `anyone`) control who each agent responds to
- **Automatic wake-up** — `@sre-blue` responds to `@chaos-red`'s tags without human prompting

Without Switch, we would have needed to build our own message routing, agent lifecycle management, and chat bridge — easily weeks of work.

## Key Technical Decisions

### Deterministic Chaos Scripts
Instead of relying on AI to "be creative" with faults, we wrote deterministic bash scripts that inject specific, reproducible bugs. This eliminates demo flakiness — every fault produces the same error signature, stack trace, and HTTP status code.

### Structured Telemetry
Every request writes a JSON log entry with timestamp, level, method, path, status, latency, error, and stack trace. This gives `@sre-blue` machine-readable evidence to work with, not just human-readable text.

### Human-in-the-Loop
`@sre-blue` always proposes a diff and **stops to ask for approval** before mutating production code. This is critical for real incident response — autonomous agents should diagnose, but humans should authorize remediations.

## Try It Yourself

```bash
git clone https://github.com/YOUR_USERNAME/chaos-arena
cd chaos-arena
npm install
npm start
# Open http://localhost:4000/dashboard
# Try: npm run chaos:null → npm run health → npm run chaos:reset → npm run verify
```

## What's Next

- **Multi-fault scenarios**: Inject compound faults that require `@sre-blue` to fix issues in dependency order
- **Competitive scoring**: Track MTTR across rounds and rank agent performance
- **Custom fault plugins**: Let users define their own chaos modes

---

*Built for the [Flip the Switch Hackathon](https://switchagents.ai) — Track 01: Best Business Workflow*

*Stack: Node.js, Express, Tailwind CSS, Switch, Mattermost*
