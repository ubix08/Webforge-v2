# WebForge — Agent Instructions

## Repository Purpose

This repository is a WebForge OpenCode agent system for building production-ready applications. It supports TWO pipeline paths:

**Pipeline A — React+Vite CRUD Business Apps:** Dashboards, admin panels, forms, tables, API-connected apps.
**Pipeline B — Next.js WASM Micro-SaaS (offline-first PWA):** PDF compression, OCR, transcription, local AI, privacy-first tools. Every asset served from same origin, cached by service worker — works fully offline after install.

---

## Core Rule

Do not jump into implementation. Follow the pipeline stages sequentially:

1. **Spec** — product specification (`spec-agent`)
2. **Implementation** — UI + business logic (varies by pipeline)
3. **Deploy Config** — platform config + CI/CD (`deploy-agent`)
4. **QA Audit** — quality and production readiness (`qa-agent`)

---

## Agent Model

| Agent | Role | Pipeline |
|-------|------|----------|
| `architect-agent` | Master orchestrator — auto-detects pipeline, confirms before proceeding | Both |
| `spec-agent` | Product spec writer | Both |
| `ui-agent` | UI scaffold (React + shadcn/ui) | A only |
| `coder-agent` | Business logic (TanStack Query + Zustand + Zod) | A only |
| `wasm-ui-agent` | Next.js UI scaffold (dark theme, design system) | B only |
| `wasm-coder-agent` | WASM integration, Web Workers, PWA, paywall | B only |
| `deploy-agent` | Deployment and CI/CD config | Both |
| `qa-agent` | Quality audit and validation | Both |

---

## Commands

- `/new-app [description]` — Full pipeline (auto-detect, with confirmation)
- `/new-wasm-app [description|spec-path]` — Force Pipeline B
- `/spec [description]` — Spec only
- `/scaffold-ui [focus]` — UI scaffold from existing spec
- `/implement-feature [name|all]` — Business logic
- `/add-feature [description]` — Add feature to existing project
- `/deploy-setup [platform]` — Deployment config
- `/qa-check [focus]` — Quality audit
- `/research [topic]` — Technical research

---

## Stack Defaults

### Pipeline A: React+Vite

- React 18+ + Vite + TypeScript (strict)
- React Router v6 + TanStack Query v5 + Zustand
- Tailwind CSS v3 + shadcn/ui
- React Hook Form + Zod
- Vitest + React Testing Library + Playwright
- Vercel or Cloudflare Pages

### Pipeline B: Next.js WASM Micro-SaaS (offline-first PWA)

- Next.js 14 App Router + TypeScript (strict, `noUncheckedIndexedAccess: true`)
- Zustand (no TanStack Query — no server)
- Tailwind CSS v3 (dark theme, custom design system per product)
- Web Workers + WASM from `/public/wasm/` (same-origin, cached by service worker)
- Stripe Payment Links + edge-verified JWT paywall (see monetization-standards.md)
- next-pwa with runtime caching + PWA manifest
- Fully offline after first visit + PWA install
- Static export (`output: 'export'`) on Vercel

---

## Build Commands

```bash
npm run dev        # Local development
npm run build      # Production build
npm run typecheck  # TypeScript validation
npm run lint       # Linting
npm run test       # Unit tests
```

---

## Quality Bar

Do not consider a stage done until:

- Build succeeds (`npm run build`)
- TypeScript passes (`npm run typecheck`)
- Lint passes (`npm run lint`)
- Tests pass (`npm run test`)
- Deployment config is valid
- QA report exists at `docs/QA-REPORT.md`

---

## Output Paths

All generated code goes to `projects/{product-name}/`. The WebForge system root stays clean.

```bash
mkdir -p projects/{product-name} && cd projects/{product-name}
```

The spec is written to `docs/MASTER-SPEC.md` inside the product directory, i.e.:
`projects/{product-name}/docs/MASTER-SPEC.md`

All downstream agents (ui-agent, coder-agent, wasm-ui-agent, wasm-coder-agent, deploy-agent, qa-agent) read the spec from `docs/MASTER-SPEC.md` relative to the product directory.

---

## Memory System

A lightweight, zero-dependency memory system for session continuity. Three-tier: inject at start, persist decisions during session, log summaries at end.

### File Inventory

| File | Purpose | Size Cap |
|------|---------|----------|
| `context/MEMORY.md` | Working scratchpad — active threads, project state, next actions | 2,500 chars |
| `context/USER.md` | User profile — preferences, working style, accounts | 1,500 chars |
| `context/decisions.md` | Decision register — append-only log of durable decisions | none |
| `context/progress.md` | Pipeline stage tracker — current stage, stage history | none |
| `context/memory/{YYYY-MM-DD}.md` | Daily session log — one file per day | none |

### Session Startup (silent — do not announce)

On every session start, read these files silently in order:

1. `context/USER.md` — learn user preferences
2. `context/MEMORY.md` — learn active threads, project state, pending decisions
3. `context/memory/{today's date}.md` if it exists — continue where you left off
4. If today's log is empty or missing, also read `context/memory/{yesterday's date}.md`

These files are a **frozen snapshot** — loaded once at session start. Writes persist to disk immediately but appear in context next session.

### Writing to Memory

When the user says "remember this", "note that", "update memory", "save this", or when a decision is finalized or a pipeline stage completes:

**To MEMORY.md** (working scratchpad — 2,500 char cap):
1. Read full file first
2. Check cap: `wc -c < context/MEMORY.md`
3. If under 2,500 chars: append/update the relevant section
4. If over cap: consolidate (merge similar, remove stale) then add
5. Confirm: "Saved — active from next session"

**To decisions.md** (append-only):
- Append: `| {date} | {decision} | {rationale} | {impact} |`
- Never edit or remove existing rows

**To progress.md** (pipeline tracker):
- After each pipeline stage: update `## Current Stage:` and add row to `### Stage History`

**To daily log** (`context/memory/{YYYY-MM-DD}.md`):
- At session end (or natural break): append a `### Session N` block:

```
### Session N
**Goal**: {one line}
**Stages**: {pipeline stages worked on}
**Deliverables**: {files created/modified}
**Decisions**: {key decisions}
**Next**: {what should happen next session}
```

### Retrieval

When asked about past context, decisions, or sessions:

1. **Tier 0**: Check `context/MEMORY.md` + today's daily log — already in context
2. **Tier 1**: Grep `context/decisions.md` and `context/memory/` for relevant terms
3. **Tier 2**: Ask the user for clarification

Only escalate if the previous tier didn't find the answer.

### Skill

For procedural memory operations (archive, consolidate, prune):
- Load `.opencode/skills/memory/SKILL.md`

---

## Strategic Documents

These are reference documents — not agent instructions. Agents do not need to load them during pipeline runs.

- `docs/STRATEGY.md` — Mission, positioning, scope, buyer personas, build philosophy
- `docs/ROADMAP.md` — Ordered build sequence, product specs, timeline

---

## Context Files

| File | Used By |
|------|---------|
| `.opencode/context/core/essential-patterns.md` | All agents |
| `.opencode/context/stack/react-vite-standards.md` | ui-agent, coder-agent (Pipeline A) |
| `.opencode/context/design/ui-design-system.md` | ui-agent, wasm-ui-agent |
| `.opencode/context/api/api-patterns.md` | coder-agent (Pipeline A) |
| `.opencode/context/deploy/deployment-standards.md` | deploy-agent |
| `.opencode/context/wasm/execution-standards.md` | wasm-coder-agent (Pipeline B) |
| `.opencode/context/wasm/nextjs-standards.md` | wasm-ui-agent, wasm-coder-agent (Pipeline B) |
| `.opencode/context/wasm/monetization-standards.md` | wasm-coder-agent (Pipeline B) |

---

## Agent Workflow Rules

- One stage at a time, sequential
- Each agent produces: summary, decisions, risks, open questions, next artifact
- Verify each stage before proceeding to the next
- Report failures with specific details
- Build one product at a time per the ROADMAP — no parallel products
- **architect-agent confirms pipeline classification with user before delegating to implementation agents**
