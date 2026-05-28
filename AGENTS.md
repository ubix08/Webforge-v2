# WebForge — Agent Instructions

## Repository Purpose

WebForge OpenCode agent system for building production-ready apps. Two pipelines:

- **Pipeline A — React+Vite CRUD:** Dashboards, admin panels, forms, tables, API-connected apps.
- **Pipeline B — Next.js PWA Micro-SaaS (offline-first):** PDF, OCR, transcription, local AI. Optional WASM. Fully offline after install.

## Core Rule

Sequential stages — do not skip or jump ahead:

1. **Spec** — `spec-agent`
2. **Implementation** — `implement-agent`
3. **Deploy Config** — `deploy-agent`
4. **QA Audit** — `qa-agent`

Verify each stage before proceeding.

## Agent Model

| Agent | Role | Pipeline |
|-------|------|----------|
| `architect-agent` | Master orchestrator — pipeline detection, confirmation, delegation | Both |
| `spec-agent` | Product spec writer | Both |
| `implement-agent` | All implementation — UI scaffold + business logic, A and B | Both |
| `deploy-agent` | Deployment and CI/CD config | Both |
| `qa-agent` | Quality audit and security review | Both |

## Commands

- `/new-app [description]` — Full pipeline (auto-detect + confirmation)
- `/new-pwa-app [description]` — Force Pipeline B (Next.js PWA Micro-SaaS)
- `/spec [description]` — Spec only
- `/scaffold-ui [focus]` — UI scaffold from existing spec
- `/implement-feature [name|all]` — Implementation from spec
- `/add-feature [description]` — Add feature to existing project
- `/deploy-setup [platform]` — Deployment config
- `/qa-check [focus]` — Quality audit
- `/research [topic]` — Technical research

## Output Paths

All generated code → `projects/{product-name}/`. Derive `{product-name}` from the user's description as a CamelCase identifier (e.g. "a CRM for freelancers" → `FreelanceCRM`, "batch PDF numbering tool" → `BatchPDF`).

```bash
mkdir -p projects/{product-name} && cd projects/{product-name}
```

Spec: `projects/{product-name}/docs/MASTER-SPEC.md`
All agents read `docs/MASTER-SPEC.md` relative to the product directory.

## Quality Bar

Stage is not done until:
- `npm run build` succeeds
- `npm run typecheck` passes (zero errors)
- `npm run lint` passes (zero errors)
- `npm run test` passes
- Deployment config is valid
- QA report exists at `docs/QA-REPORT.md`

## Memory System

File-based, zero-dependency. Prevents repo re-exploration by carrying compact state between sessions.

### Files

| File | Purpose | Cap |
|------|---------|-----|
| `context/MEMORY.md` | Working state: product, pipeline, stage, file tree, next actions | 2,500 chars |
| `context/USER.md` | User profile and preferences | 1,500 chars |
| `context/decisions.md` | Append-only decision register | none |
| `context/progress.md` | Pipeline stage tracker | none |
| `context/memory/{YYYY-MM-DD}.md` | Daily session logs | none |

### Session Start

Load these into context silently (do not announce):
1. `context/USER.md`
2. `context/MEMORY.md` — this is the **session-start state.** It tells you product, pipeline, stage, file tree. **Do not explore the repo** — use the file tree in MEMORY.md as your map. Read only specific files you need.
3. `context/memory/{today}.md` if exists
4. If missing, read `context/memory/{yesterday}.md`

Writes persist to disk immediately. The in-context copy is the session-start snapshot — for current state mid-session, use grep/read tools on disk files.

### Writing

When user says "remember this", "note that", or after a pipeline stage completes:

**MEMORY.md:** Read file, check cap, append/update. If over cap, consolidate (merge similar, remove stale).
**decisions.md:** Append `| {date} | {decision} | {rationale} | {impact} |` — never edit rows.
**progress.md:** Update `## Current Stage:` and add row to stage history.
**Daily log:** At session end, append `### Session N` block with goal, stages, deliverables, decisions, next steps.

### State Snapshot (prevents repo re-exploration)

After each major action (stage completion, feature added, bug fixed), update MEMORY.md with:
- Current product name, pipeline, stage
- File tree of `projects/{product-name}/` (run `find projects/{product-name} -type f | head -50` — only if a product is active)
- Last action performed
- Next steps

This ensures next session starts with a complete map — no `find`/`grep` needed to orient.

### Retrieval

1. Check MEMORY.md + today's log — in context at session start
2. Grep `context/decisions.md` or `context/memory/` for specific terms
3. Ask user

### Skill

For procedural operations (consolidate, archive, prune): load `.opencode/skills/memory/SKILL.md`

## Context Files

| File | Used By | Pipeline |
|------|---------|----------|
| `essential-patterns.md` | All agents | Both |
| `react-vite-standards.md` | implement-agent | A |
| `api-patterns.md` | implement-agent | A |
| `ui-design-system.md` | implement-agent | Both |
| `deployment-standards.md` | deploy-agent | Both |
| `execution-standards.md` | implement-agent | B |
| `nextjs-standards.md` | implement-agent | B |
| `monetization-standards.md` | implement-agent | B |

## Workflow Rules

- One stage at a time, sequential
- Each agent produces: summary, decisions, risks, open questions, next artifact
- architect-agent confirms pipeline before implementation
- Update `context/progress.md` and `context/MEMORY.md` after each stage
- One product at a time per ROADMAP
