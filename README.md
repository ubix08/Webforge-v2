# WebForge

> An OpenCode agent system that transforms a product description into a production-ready web application — spec to deployment config.

---

## What This Is

WebForge is a structured set of OpenCode agents, context files, and slash commands that work together as a senior engineering team. You describe a tool. WebForge produces the complete codebase.

**Two pipelines:**
- **Pipeline A** — React+Vite CRUD business apps (dashboards, admin panels, forms, API-connected apps)
- **Pipeline B** — Next.js offline-first PWA Micro-SaaS (PDF tools, OCR, transcription, local AI, optional WASM)

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

# 2. Start OpenCode
opencode
```

### Run the Full Pipeline

```
/new-app "A CRM for freelancers to track clients, projects, invoices, and follow-ups"
```

WebForge will:
1. Write a complete spec
2. Confirm pipeline classification with you
3. Implement all features
4. Configure deployment
5. Run a QA audit

All output goes to `projects/{product-name}/`.

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/new-app [description]` | Full pipeline — auto-detect (with confirmation) |
| `/new-pwa-app [description]` | Force Pipeline B (Next.js PWA Micro-SaaS) |
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
| `implement-agent` | All implementation — UI scaffold + business logic (both pipelines) |
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

## Templates

WebForge uses pre-configured templates instead of scaffolding from scratch. This saves tokens, avoids interactive prompts, and ensures consistent structure.

| Template | Location | Pipeline |
|----------|----------|----------|
| React+Vite CRUD | `templates/pipeline-a-vite/` | A |
| Next.js PWA Micro-SaaS | `templates/pipeline-b-nextjs/` | B |

To update: modify template files directly, then run `npm install && npm run build` to verify.

## Customizing

- Change stack defaults → edit `.opencode/context/stack/react-vite-standards.md`
- Change design tokens → edit `.opencode/context/design/ui-design-system.md`
- Change paywall pricing → edit `.opencode/context/wasm/monetization-standards.md`
- Update project templates → edit `templates/pipeline-a-vite/` or `templates/pipeline-b-nextjs/`
- Add a new agent → create `.opencode/agents/my-agent.md` + register in `AGENTS.md`

---

## Principles

1. **Context before execution** — agents load structured knowledge before acting
2. **Spec as single source of truth** — every agent reads `docs/MASTER-SPEC.md`
3. **TypeScript strict always** — no `any`, no exceptions
4. **Confirm before implementing** — architect confirms pipeline with user before delegating
5. **Production-first** — every output is deployable, not prototype
6. **Security by default** — JWT paywall, CSP headers, input sanitization built in

---

## Merged System

This is the merged WebForge system — distilled from Webforge v1, v2, and webstack variants:

| Source | Contribution |
|--------|-------------|
| Webforge v2 (base) | Agent pipeline model, QA scoring rubric, edge-verified JWT paywall architecture, versioned stack defaults |
| webstack | Clean opencode config (no hardcoded API keys, no MCP tools in repo), devstak.md research reference |
| Webforge v1 | Legacy context files, research references, project scripts |
| Webforce | `docs/devstak.md` — comprehensive agent framework research |
