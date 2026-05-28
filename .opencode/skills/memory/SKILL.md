---
name: memory
description: >
  Procedural memory operations: consolidate, archive, prune, snapshot.
  For simple writes ("remember this"), handle inline per AGENTS.md.
---

# Memory Skill

## Snapshot (run after major actions)

Updates MEMORY.md with current project state to prevent repo re-exploration in next session:

```bash
# Generate file tree (replace {product-name} with the actual product directory)
find projects/{product-name} -type f | head -50
```

Update MEMORY.md with: product name, pipeline, current stage, last action, file tree, next steps.

## Consolidate MEMORY.md

Trigger: `consolidate memory` or when cap exceeds 2,500 chars.

1. Read `context/MEMORY.md`
2. Check byte count: `wc -c < context/MEMORY.md`
3. If under 2,500: report count, stop
4. If over cap: merge duplicates, remove resolved entries, rewrite
5. Report: `{N}/2,500 chars ({percent}%)`

## Archive Daily Logs

Trigger: `archive old logs`.

1. List `context/memory/`
2. Identify files older than 14 days
3. Move to `context/memory/archive/`
4. Report: "Archived N files"

## Prune Entry

Trigger: `forget about X`.

1. Read `context/MEMORY.md`
2. Find matching entry, show user, confirm deletion
3. Only delete after explicit confirmation

## Rules

- Never delete from `context/decisions.md` (append-only)
- Never prune without user confirmation
- Stay under 2,500 char cap for MEMORY.md
- Report byte counts after writes
