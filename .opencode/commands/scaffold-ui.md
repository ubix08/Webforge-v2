---
description: UI scaffold from existing spec (both pipelines)
agent: implement-agent
---

Scaffold the UI for "$ARGUMENTS" from `docs/MASTER-SPEC.md`. Detect pipeline from spec.

Check if `projects/{product-name}/package.json` exists:
- **If YES** — project already scaffolded. Skip template copy, work on existing files.
- **If NO** — copy the template first (A: `templates/pipeline-a-vite/`, B: `templates/pipeline-b-nextjs/`) and run `npm install`.

Load context: `ui-design-system.md` plus pipeline-specific files (A: `react-vite-standards.md`, B: `nextjs-standards.md`).

Implement routing, layout, placeholder pages, loading/error/empty states. Build must pass.
