---
description: Configure deployment for the specified platform
agent: deploy-agent
---

Configure deployment for "$ARGUMENTS". Read `docs/MASTER-SPEC.md` to detect the pipeline, then generate: platform config (vercel.json or wrangler.toml), CI/CD workflow (.github/workflows/deploy.yml), .env.example, and README setup instructions.

For Pipeline B on Vercel: do NOT add catch-all rewrites. Add COOP/COEP headers only if the product uses SharedArrayBuffer.
