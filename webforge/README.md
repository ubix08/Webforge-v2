# WebForge

> An OpenCode agent system that transforms a product description into a production-ready web application — spec to deployment config.

---

## What This Is

WebForge is a structured set of OpenCode agents, context files, and slash commands that work together as a senior engineering team. You describe a tool. WebForge produces the complete codebase.

**Two pipelines:**
- **Pipeline A** — React+Vite CRUD business apps (dashboards, admin panels, forms, API-connected apps)
- **Pipeline B** — Next.js WASM Micro-SaaS offline-first PWA (PDF tools, OCR, transcription, local AI)

---

## Quick Start

### Prerequisites
- [OpenCode](https://opencode.ai) installed
- A Brave Search API key (for research capabilities)

### Setup

```bash
# 1. Clone this system
git clone <this-repo> my-webforge
cd my-webforge

# 2. Add your Brave Search API key
# Edit opencode.json → replace "YOUR_BRAVE_API_KEY_HERE"

# 3. Start OpenCode
opencode
```

### Run the Full Pipeline

```
/new-app "A CRM for freelancers to track clients, projects, invoices, and follow-ups"
```

WebForge will:
1. Write a complete spec
2. Confirm pipeline classification with you
3. Scaffold the UI
4. Implement business logic
5. Configure deployment
6. Run a QA audit

All output goes to `projects/{product-name}/`.

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/new-app [description]` | Full pipeline — auto-detect (with confirmation) |
| `/new-wasm-app [description]` | Force Pipeline B (Next.js WASM) |
| `/spec [description]` | Spec only |
| `/scaffold-ui [focus]` | UI scaffold from existing spec |
| `/implement-feature [name\|all]` | Business logic |
| `/add-feature [description]` | Add feature to existing project |
| `/deploy-setup [platform]` | Deployment config |
| `/qa-check [focus]` | Quality audit |
| `/research [topic]` | Technical research |

---

## Agent System

| Agent | Role |
|-------|------|
| `architect-agent` | Master orchestrator — pipeline detection + confirmation + delegation |
| `spec-agent` | Product spec writer → `docs/MASTER-SPEC.md` |
| `ui-agent` | React+Vite UI scaffold [Pipeline A] |
| `coder-agent` | Business logic, hooks, stores [Pipeline A] |
| `wasm-ui-agent` | Next.js UI scaffold + PWA [Pipeline B] |
| `wasm-coder-agent` | WASM + Worker + paywall [Pipeline B] |
| `deploy-agent` | Vercel / Cloudflare + CI/CD |
| `qa-agent` | Full audit with security checklist + readiness score |

---

## Output Structure

```
projects/{product-name}/
├── docs/
│   ├── MASTER-SPEC.md      # Complete product spec
│   └── QA-REPORT.md        # QA audit report
├── src/                    # Generated source
├── public/                 # Static assets, WASM binaries, PWA icons
├── .github/workflows/      # CI/CD
├── vercel.json             # Deployment config
├── .env.example
└── README.md
```

---

## Memory System

WebForge maintains session continuity via a simple file-based memory system:

| File | Purpose |
|------|---------|
| `context/MEMORY.md` | Active threads + project state (2,500 char cap) |
| `context/USER.md` | User preferences (1,500 char cap) |
| `context/decisions.md` | Append-only decision register |
| `context/progress.md` | Pipeline stage tracker |
| `context/memory/YYYY-MM-DD.md` | Daily session logs |

Memory is loaded silently at session start. No external dependencies, no vector database.

---

## Customizing

- Change stack defaults → edit `.opencode/context/stack/react-vite-standards.md`
- Change design tokens → edit `.opencode/context/design/ui-design-system.md`
- Change paywall pricing → edit `.opencode/context/wasm/monetization-standards.md`
- Add a new agent → create `.opencode/agents/my-agent.md` + register in `AGENTS.md`

---

## Principles

1. **Context before execution** — agents load structured knowledge before acting
2. **Spec as single source of truth** — every agent reads `docs/MASTER-SPEC.md`
3. **TypeScript strict always** — no `any`, no exceptions
4. **Confirm before implementing** — architect confirms pipeline with user before delegating
5. **Production-first** — every output is deployable, not prototype
6. **Security by default** — JWT paywall, CSP headers, input sanitization built in
