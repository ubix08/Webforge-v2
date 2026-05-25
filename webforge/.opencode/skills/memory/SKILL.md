---
name: memory
description: >
  Procedural operations on the WebForge memory system: archive, consolidate, prune.
  Triggers on "archive memory", "consolidate memory", "prune memory", "clean up memory".
  For simple writes ("remember this", "note that"), follow the Memory System section in AGENTS.md directly.
---

# Memory Skill

## Purpose

This skill handles the heavier procedural memory operations that go beyond simple writes:
- **Consolidate** — merge redundant entries, remove stale entries, stay under cap
- **Archive** — move old daily logs to an archive directory
- **Prune** — remove a specific entry after user confirmation

---

## Consolidate MEMORY.md

Trigger: `consolidate memory`, `clean up memory`, or when `wc -c < context/MEMORY.md` exceeds 2,500 chars.

Steps:
1. Read `context/MEMORY.md` in full
2. Check byte count: `wc -c < context/MEMORY.md`
3. If under 2,500 chars, report the count and stop — no action needed
4. If over cap:
   a. Identify duplicate or near-duplicate entries
   b. Merge related entries into single concise lines
   c. Remove entries marked as resolved or no longer active
   d. Rewrite the file with consolidated content
5. Check byte count again and report: `{N}/2,500 chars ({percent}%)`
6. Confirm: "MEMORY.md consolidated — {N} chars used."

---

## Archive Daily Logs

Trigger: `archive daily logs`, `archive old logs`.

Steps:
1. List files in `context/memory/`
2. Identify files older than 14 days
3. Move them to `context/memory/archive/`:
   ```bash
   mkdir -p context/memory/archive
   mv context/memory/YYYY-MM-DD.md context/memory/archive/
   ```
4. Report: "Archived N files to context/memory/archive/"

---

## Prune Entry

Trigger: `forget about X`, `remove X from memory`.

Steps:
1. Read `context/MEMORY.md`
2. Find the entry matching the user's description
3. Show the user the exact entry and ask for confirmation:
   "Found this entry: `{entry}` — confirm deletion? (yes/no)"
4. Only delete after explicit confirmation
5. Write updated file
6. Confirm: "Removed. Active from next session."

---

## Rules

- Never delete from `context/decisions.md` — it is append-only
- Never prune without user confirmation
- Always stay under the 2,500 char cap for MEMORY.md
- USER.md cap is 1,500 chars — apply same consolidation rules if needed
- Report final byte counts after any write operation
