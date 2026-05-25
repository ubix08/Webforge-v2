---
description: Full pipeline — auto-detect pipeline (React+Vite or Next.js WASM), with confirmation
agent: architect-agent
---

Run the full WebForge pipeline for: "$ARGUMENTS"

Follow pipeline stages in order:
1. **Spec** — delegate to `spec-agent`. Output: `projects/{product-name}/docs/MASTER-SPEC.md`
2. **Pipeline Confirmation** — classify as Pipeline A or B, present classification and reason to user, wait for confirmation before proceeding
3. **Implementation** — Pipeline A: delegate to `ui-agent` then `coder-agent`. Pipeline B: delegate to `wasm-ui-agent` then `wasm-coder-agent`
4. **Deploy Config** — delegate to `deploy-agent`
5. **QA Audit** — delegate to `qa-agent`. Output: `projects/{product-name}/docs/QA-REPORT.md`

Scaffold pattern: `mkdir -p projects/{product-name}`

Do not skip stages. Do not proceed past pipeline confirmation without explicit user approval.
