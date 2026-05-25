---
description: Force Pipeline B — Next.js WASM Micro-SaaS full pipeline
agent: architect-agent
---

Run the complete Pipeline B for: "$ARGUMENTS"

Pipeline B is confirmed — no auto-detection needed. Follow pipeline stages in order:
1. **Spec** — delegate to `spec-agent`. Output: `projects/{product-name}/docs/MASTER-SPEC.md`
2. **UI Scaffold** — delegate to `wasm-ui-agent` (Next.js + dark theme + PWA)
3. **Processing Core + Paywall** — delegate to `wasm-coder-agent` (WASM + Worker + Stripe JWT paywall)
4. **Deploy Config** — delegate to `deploy-agent`
5. **QA Audit** — delegate to `qa-agent`. Output: `projects/{product-name}/docs/QA-REPORT.md`

Scaffold pattern: `mkdir -p projects/{product-name}`
