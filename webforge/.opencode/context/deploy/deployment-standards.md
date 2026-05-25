# Deployment Standards

## Vercel (Both Pipelines — primary platform)

- `vercel.json` in project root
- Environment variables in Vercel dashboard — never committed with values
- Preview deployments for all PRs
- Production branch: `main`

### Pipeline A — vercel.json

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Pipeline B — vercel.json (static export)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "trailingSlash": true
}
```

**IMPORTANT for Pipeline B:** Do NOT add a catch-all rewrite (`"source": "/(.*)", "destination": "/index.html"`). It breaks multi-page Next.js static exports by routing all requests to the root page. Use `trailingSlash: true` in `next.config.js` instead — this is the correct routing strategy for static exports.

Add COOP/COEP headers to `vercel.json` **only** if the product uses `SharedArrayBuffer` (multi-threaded WASM). Check the spec for this requirement:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" }
      ]
    }
  ]
}
```

---

## Cloudflare Pages (Pipeline A alternative)

```toml
# wrangler.toml
name = "project-name"
compatibility_date = "2024-01-01"

[site]
bucket = "./dist"
```

- Build command: `npm run build`
- Output directory: `dist`
- Environment variables via Cloudflare dashboard

---

## CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    name: Lint, Type Check, Test, Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

For Vercel deployment, install the Vercel GitHub integration — it handles deploy automatically on merge to `main`. No deploy step needed in CI.

---

## Environment Variables

Always create `.env.example` with all required variables documented (names + descriptions, no values):

```bash
# .env.example

# API base URL (Pipeline A)
VITE_API_URL=https://your-api.example.com

# Supabase (Pipeline A — if using Supabase)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Stripe (Pipeline B)
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/...
NEXT_PUBLIC_JWT_SECRET=        # For edge function JWT signing
```

Never commit `.env`, `.env.local`, or any file with actual secret values.

---

## Monitoring

- **Pipeline B (static sites):** No runtime monitoring needed. Vercel provides basic analytics.
- **Pipeline A:** Vercel Analytics (free tier) for page views. Sentry for error tracking (optional).
