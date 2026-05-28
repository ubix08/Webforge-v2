---
description: Full pipeline — auto-detect pipeline with confirmation
agent: architect-agent
---

Run full WebForge pipeline for: "$ARGUMENTS"

Derive product-name from description (CamelCase). Stages:

1. **Spec** — delegate to `spec-agent`. Output: `projects/{product-name}/docs/MASTER-SPEC.md`
2. **Pipeline Confirmation** — classify as A or B, present to user, wait for approval
3. **Implementation** — delegate to `implement-agent`
4. **Deploy Config** — delegate to `deploy-agent`
5. **QA Audit** — delegate to `qa-agent`. Output: `projects/{product-name}/docs/QA-REPORT.md`

Scaffold: `mkdir -p projects/{product-name} && cd projects/{product-name}`
