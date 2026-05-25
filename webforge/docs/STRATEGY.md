# WebForge — Product Strategy

> **Reference document** — Not loaded by agents during pipeline runs. For human planning only.

## Mission

Build professional browser-native tools that process sensitive files entirely on the user's device. Nothing ever leaves the browser. Privacy is the architecture, not a feature.

## Positioning Statement

> Professional tools that process your sensitive files entirely on your device. Nothing ever leaves your browser.

## Scope: What We Build

### Product Categories
1. **Document Processing** — PDF compression, PDF stamping (Bates numbering), document OCR, invoice extraction
2. **Local AI Tools** — Audio transcription (Whisper), PII masking, contract analysis
3. **Data Transformation** — CSV sanitization, JSON-LD schema generation, sitemap visualization
4. **Business Utilities** — Receipt scanning, invoice generation, email signatures, rent receipts

### Stack
- Next.js 14 App Router + TypeScript strict + `noUncheckedIndexedAccess: true`
- Zustand (no TanStack Query — no server cache)
- Tailwind CSS v3 (dark theme, product-specific design system)
- Web Workers + WASM from `/public/wasm/` (same-origin, cached by service worker)
- pdf-lib (PDF manipulation), Papa Parse (CSV), Tesseract.js (OCR), Transformers.js (AI)
- Stripe Payment Links + edge-verified JWT paywall
- next-pwa + PWA manifest
- Static export (`output: 'export'`) on Vercel

### What We Do NOT Build
- Multi-tenant SaaS platforms with user accounts and databases
- Real-time collaboration tools
- Mobile native apps (PWA only)
- Cloud AI or API-dependent features (must work fully offline)
- Anything requiring server-side state, cron jobs, or webhook receivers

## Buyer Personas

| Persona | Pain Point | Price Sensitivity | Product Fit |
|---------|-----------|-------------------|-------------|
| Solo lawyers / paralegals | Compliance docs, private client data | Low ($19–29/mo OK) | BatesBot, PDF Compressor, PII Masking |
| SEO agencies | Multi-location schema at scale | Medium ($14–29/mo) | SchemaLocal |
| AP managers | Invoice processing volume | Medium ($19/500 pages) | Invoice OCR |
| Physicians / medical scribes | HIPAA, no cloud allowed | Low ($49/mo OK) | Medical Scribe |
| HR teams | GDPR Article 9 compliance | Medium ($59/team) | HR Doc Intel |
| Regulated dev teams | Air-gapped environments | Low ($79–199/dev) | Code Auditor |

## Build Philosophy

1. **One product at a time** — no parallel builds
2. **Ship before perfect** — working MVP with paywall first, polish later
3. **Reuse everything** — same scaffold, PWA config, paywall, SEO pattern
4. **Price from day one** — no free-only products
5. **SEO is distribution** — 5+ programmatic landing pages at launch
6. **Privacy is the pitch** — lead with "your files never leave your browser"

## The Infinite Margin Model

Hosting: ~$20/month (Vercel). Payment processing: 2.9% (Stripe). Everything else: pure margin.

**Example:** 200 users × $29/mo = $5,800 MRR at ~$5,780 gross profit. No GPU costs. No inference API. Just a CDN serving static files.
