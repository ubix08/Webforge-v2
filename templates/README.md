# WebForge Templates

Pre-configured project scaffolds for both pipelines. Agents copy these instead of running `npm create` — saves tokens, dependencies, and ensures consistent structure.

## Pipeline A: `pipeline-a-vite/`

React + Vite + TypeScript + Tailwind + shadcn/ui + React Router + TanStack Query + Zustand + React Hook Form + Zod + Vitest

**Use for:** Dashboards, admin panels, forms, tables, API-connected apps.

## Pipeline B: `pipeline-b-nextjs/`

Next.js 14 App Router + TypeScript + PWA (@serwist/next) + Zustand + dark CSS variables + Vitest + RS256 JWT paywall + CI/CD

**Use for:** PDF tools, OCR, transcription, local AI, offline-first PWAs.

## How to Update

Templates should reflect current best practices. To update:

1. Modify the template files directly
2. Run `npm install && npm run build && npm run typecheck` to verify
3. Update `package.json` versions if upgrading dependencies

## Key Differences from Scratch Scaffolds

| Aspect | `npm create` | Template |
|--------|-------------|----------|
| Setup time | 30-60s + interactive prompts | Instant copy |
| Token cost | High (agent reads `npm create` output) | Zero (already in filesystem) |
| Consistency | Varies by CLI version | Exact same every time |
| PWA config | Manual setup | Pre-configured |
| Paywall stub | None | RS256 JWT ready |
| CI/CD | None | GitHub Actions ready |
