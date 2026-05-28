---
description: Force Pipeline B — Next.js PWA Micro-SaaS full pipeline
agent: architect-agent
---

Run Pipeline B for: "$ARGUMENTS"

Pipeline B confirmed — no auto-detection. Stages:

1. **Spec** — delegate to `spec-agent`. Output: `projects/{product-name}/docs/MASTER-SPEC.md`
2. **Implementation** — delegate to `implement-agent` (Next.js + PWA + paywall)
3. **Deploy Config** — delegate to `deploy-agent`
4. **QA Audit** — delegate to `qa-agent`. Output: `projects/{product-name}/docs/QA-REPORT.md`

Scaffold: `mkdir -p projects/{product-name} && cd projects/{product-name}`
