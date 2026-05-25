<!-- Cap: 2,500 chars. Agent maintains — loaded at session start as frozen snapshot. -->
# Working Memory

## Active Threads
- SchemaLocal (Product 1) — Shipped ✅ all checks pass, QA verified
- PDFCompressr (Product 3) — Shipped ✅ deployed and QA verified
- BatesBot (Product 2) — Next in queue per ROADMAP

## Project State
- Phase: Phase 1 — Foundation
- Active product: BatesBot (Product 2 — next per ROADMAP)
- WebForge system: 8 agents, 9 commands, memory system, context files

## Decisions
- Generated code → `projects/{product-name}/` (WebForge root stays clean)
- Spec output → `projects/{product-name}/docs/MASTER-SPEC.md`
- `projects/*/` gitignored; `.gitkeep` preserves directory in git
- Agents scaffold: `mkdir -p projects/{product-name}`
- Pipeline B paywall: edge-verified JWT (not raw localStorage boolean)
- Pipeline B: wasm-ui-agent + wasm-coder-agent (split from former monolithic wasm-agent)

## Next Actions
1. Begin Product 2 (BatesBot) — spec stage → `/new-app "BatesBot"`
