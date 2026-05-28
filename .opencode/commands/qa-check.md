---
description: Run a full quality audit
agent: qa-agent
---

Run a full quality audit on "$ARGUMENTS". Read `docs/MASTER-SPEC.md` to determine the pipeline.

Run: `npm run build`, `npm run typecheck`, `npm run lint`, `npm run test`. Perform the full security checklist and UX checklist for the detected pipeline. Produce a structured `docs/QA-REPORT.md` with P0/P1/P2/P3 severity ratings and readiness score.
