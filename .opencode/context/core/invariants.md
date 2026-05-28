# Architecture Invariants

Non-negotiable rules the codebase must never violate. If a change breaks an invariant, stop and redesign.

## Universal

1. **TypeScript strict** — no `any`, no `// @ts-expect-error`, no type assertions without justification
2. **No secrets in source** — API keys, tokens, private keys never committed. Use env vars at build/deploy time.
3. **No `console.log` in production** — use a proper logger or remove before ship
4. **User input sanitized** — no `dangerouslySetInnerHTML` without explicit sanitization; CSP headers set in platform config
5. **Every async operation has error handling** — try/catch or `.catch()` on all promises; user-facing errors are human-readable
6. **Build must pass** — `npm run build`, `typecheck`, `lint`, `test` must all succeed before any stage is complete

## Pipeline A (React + Vite)

7. **Server state never duplicated in Zustand** — TanStack Query owns server data; Zustand owns UI state only
8. **Auth at every mutation boundary** — protected routes check session; API calls inject Bearer token via interceptor
9. **shadcn/ui via CLI only** — don't hand-write Radix primitives; use `npx shadcn@latest add`

## Pipeline B (Next.js PWA + Static Export)

10. **No API routes inside `pages/api/` or `app/api/`** — static export ignores them. Place server functions at project root `api/`
11. **No catch-all rewrite in `vercel.json`** — breaks multi-page static exports. Use `trailingSlash: true` in `next.config.js`
12. **Paywall uses RS256 asymmetric JWT** — never HS256 (symmetric key exposure). Private key server-side only; public key in `NEXT_PUBLIC_`
13. **COOP/COEP headers only if `SharedArrayBuffer` is required** — otherwise omit to avoid breaking third-party embeds
14. **WASM binaries from same origin** — load from `/wasm/`, never from CDN
15. **Dark theme by default** — `dark` class permanently on `<html>` for Pipeline B; class-based toggle for Pipeline A
