---
description: Conduct technical research on a topic
agent: architect-agent
---

Conduct technical research on "$ARGUMENTS". Use websearch and webfetch to gather current information.

Create the output directory: `mkdir -p projects/{product-name}/docs/research`

Produce a structured report at `projects/{product-name}/docs/research/{topic}.md` covering: overview, options and trade-offs, recommendation with rationale, references.

If no product is active, use `docs/research/{topic}.md` (WebForge root) and `mkdir -p docs/research`.
