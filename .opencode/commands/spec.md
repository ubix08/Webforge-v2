---
description: Write a product specification document
agent: spec-agent
---

Write a structured product specification for "$ARGUMENTS" following the master spec template at `docs/EXAMPLE-MASTER-SPEC.md`.

Derive product-name from description (CamelCase). Output: `projects/{product-name}/docs/MASTER-SPEC.md`.

Include: product overview, target audience, feature list (v1/v2), technical architecture, data model, UI flow, API endpoints or processing flow, edge cases, open questions.

After writing, present: key decisions, risks, pipeline recommendation (A or B) with reason, confirmation request before implementation.
