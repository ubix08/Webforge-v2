---
description: Add a new feature to an existing project
agent: architect-agent
---

Add feature "$ARGUMENTS" to the existing project.

Steps:
1. Read `docs/MASTER-SPEC.md` for current product and pipeline
2. Detect pipeline from the spec's Technical Architecture section (React+Vite imports = A, Next.js/PWA = B)
3. Update `docs/MASTER-SPEC.md` with new feature definition
4. Delegate implementation to `implement-agent`
5. Run `npm run build`, `npm run typecheck`, `npm run lint` to verify
6. Delegate to `qa-agent` for focused QA check
