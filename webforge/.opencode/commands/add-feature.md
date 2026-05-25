---
description: Add a new feature to an existing project
agent: architect-agent
---

Add the feature "$ARGUMENTS" to the existing project.

Steps:
1. Read `docs/MASTER-SPEC.md` to understand the current product and pipeline
2. Detect the pipeline (A or B)
3. Update `docs/MASTER-SPEC.md` with the new feature definition
4. Delegate implementation to the appropriate agent(s) for the detected pipeline
5. Delegate to `qa-agent` for a focused QA check on the new feature
