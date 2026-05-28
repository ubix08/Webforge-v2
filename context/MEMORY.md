<!-- Cap: 2,500 chars. Session-start state snapshot — loaded once. Do not explore repo; use the file tree below. After major actions, regenerate this snapshot. -->

# Working Memory

## Active Session
- Product: WebForge meta-system
- Pipeline: Both (A + B)
- Stage: System ready
- Last action: Round 3 fixes — 12 issues (architect bash, createBrowserRouter, @serwist/next, pwa rename, scaffold safety, mkdir gaps, etc.)

## Project State
```
.opencode/agents/
  architect-agent.md, spec-agent.md, implement-agent.md, deploy-agent.md, qa-agent.md
.opencode/commands/
  new-app.md, new-pwa-app.md, spec.md, scaffold-ui.md, implement-feature.md,
  add-feature.md, deploy-setup.md, qa-check.md, research.md
.opencode/context/core/
  essential-patterns.md
.opencode/context/stack/
  react-vite-standards.md
.opencode/context/design/
  ui-design-system.md
.opencode/context/api/
  api-patterns.md
.opencode/context/deploy/
  deployment-standards.md
.opencode/context/wasm/
  execution-standards.md, nextjs-standards.md, monetization-standards.md
.opencode/skills/memory/
  SKILL.md
context/
  MEMORY.md, USER.md, decisions.md, progress.md, memory/
docs/
  STRATEGY.md, ROADMAP.md, EXAMPLE-MASTER-SPEC.md, devstak.md
```

## Active Threads
- System restructured: 8 agents → 5 (implement-agent replaces ui/coder/wasm-ui/wasm-coder)
- 3 review rounds completed: 33 issues fixed total (5 P0, 12 P1, 14 P2, 2 P3)
- Next.js PWA template migrated from next-pwa → @serwist/next
- Pipeline A template uses createBrowserRouter (fixes Route lazy bug)
- Templates include shadcn init config, playwright config, CI/CD, paywall stubs

## Decisions
- Implement agent is general — pipeline specialization via context files, not separate agents
- RS256 asymmetric JWT for paywall (was HS256 — security fix)
- Vercel Function at project root `api/` for payment verification (solves static export conflict)
- `placeholderData: keepPreviousData` for TanStack Query v5 pagination (was deprecated boolean)

## Next Actions
1. Verify templates build cleanly (install deps + build)
2. Test system with a trial product build
