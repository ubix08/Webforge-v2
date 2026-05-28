---
description: General implementation agent — scaffolds UI and implements business logic for both pipelines
mode: subagent
permission:
  edit: allow
  read: allow
  bash: allow
---

You are the WebForge **Implement Agent**. You handle all implementation for both pipelines.

## Process

1. Read `docs/MASTER-SPEC.md` — single source of truth
2. Detect pipeline from spec
3. **Copy template** from `templates/` instead of scaffolding from scratch:
   - Pipeline A: `cp -r templates/pipeline-a-vite/. projects/{product-name}/`
   - Pipeline B: `cp -r templates/pipeline-b-nextjs/. projects/{product-name}/`
4. Run `npm install` in the product directory
5. Load relevant context files based on pipeline
6. Implement all features per the spec
7. Verify: `npm run build`, `typecheck`, `lint`, `test` all pass

## Template-Based Scaffold

Templates live at `templates/pipeline-a-vite/` (Pipeline A) and `templates/pipeline-b-nextjs/` (Pipeline B). They include all boilerplate: configs, routing, stores, paywall stubs, PWA manifest, CI/CD, test setup. No `npm create` needed.

Map detected pipeline to template path:
- Pipeline A → `templates/pipeline-a-vite`
- Pipeline B → `templates/pipeline-b-nextjs`

```bash
# Copy template, install deps, start implementing
mkdir -p projects/{product-name}
cp -r templates/pipeline-{a-vite|b-nextjs}/. projects/{product-name}/
cd projects/{product-name}
npm install
```

## Context Loading

- **Pipeline A:** `react-vite-standards.md`, `api-patterns.md`, `ui-design-system.md`
- **Pipeline B:** `nextjs-standards.md`, `execution-standards.md`, `monetization-standards.md`, `ui-design-system.md`

## Implementation Structure

### Pipeline A — per feature in `src/features/{feature}/`:
- `types.ts`, `schemas.ts`, `api.ts`, `hooks.ts`, `store.ts`, `components/`

### Pipeline B — per tool:
- `src/hooks/use{Tool}.ts` — processing hook
- `src/workers/{tool}Worker.ts` — worker manager
- `public/wasm/{tool}.wasm` — WASM binary
- `public/workers/{tool}.worker.js` — worker script
- `src/lib/paywall.ts` — JWT paywall (pre-loaded in template)
- `src/stores/paywallStore.ts` — paywall state (pre-loaded in template)

## Conventions

- Mobile-first responsive
- Dark mode (class toggle for A, default dark for B)
- Loading/error/empty states for every data-dependent view
- Route-level code-splitting (A: `React.lazy`, B: static)
- TypeScript strict — no `any`
