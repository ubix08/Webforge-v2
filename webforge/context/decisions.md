<!-- Append-only. Agent writes durable decisions here. No cap. Never edit existing rows. -->
# Decision Register

| Date | Decision | Rationale | Impact |
|------|----------|-----------|--------|
| 2026-05-22 | Use `projects/{product-name}/` for generated code | WebForge root stays as clean meta-system; portable | All agents scaffold via `mkdir -p projects/{product-name}`; `projects/*/` gitignored |
| 2026-05-22 | Start PDFCompressr (Product 3) before SchemaLocal (Product 1) | User directed to check PDF compressor spec and start development | PDFCompressr launched; SchemaLocal deferred |
| 2026-05-23 | SchemaLocal follows Pipeline B despite zero WASM | Shares Next.js + PWA + paywall scaffold; strategic consistency | wasm-ui-agent + wasm-coder-agent handle full implementation |
| 2026-05-23 | SchemaLocal design: purple accent (#7C65FF) on dark theme | Visually distinct from PDFCompressr green; agency-credible | All UI uses purple accent tokens |
| 2026-05-23 | No Web Worker for SchemaLocal | CSV + JSON-LD are synchronous sub-second ops | Simplifies architecture |
| 2026-05-23 | PWA icons via pure Node.js script (no ImageMagick) | Zero-dependency, works everywhere | scripts/generate-icons.js |
| 2026-05-23 | Test infra: Vitest + jsdom, 101 tests, 5 suites | Core business logic covered | npx vitest run as test command |
| 2026-05-23 | vercel.json: no catch-all rewrites for Pipeline B static export | Catch-all rewrites break multi-page routing; trailingSlash: true handles it natively | All routes served correctly |
| 2026-05-23 | Spec output path: `projects/{product-name}/docs/MASTER-SPEC.md` | Keeps each product self-contained; downstream agents use relative path `docs/MASTER-SPEC.md` | All agents aligned on this path |
| 2026-05-23 | Pipeline B paywall: edge-verified JWT replacing localStorage boolean | localStorage-only is trivially bypassable via DevTools; JWT requires Stripe verification | Vercel Edge Function signs JWT; client verifies signature |
| 2026-05-23 | Split wasm-agent into wasm-ui-agent + wasm-coder-agent | Original single agent had excessive scope (UI + WASM + Worker + PWA + paywall in one pass) | Cleaner handoff; each agent has focused, manageable scope |
