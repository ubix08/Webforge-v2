# CLAUDE.md

This repository uses `AGENTS.md` as the primary agent instruction file.

## Project Mission

Build production-ready web applications using WebForge's specialized OpenCode agents and structured pipeline.

## Canonical Instructions

- Root policy: `AGENTS.md`
- Agents: `.opencode/agents/*.md`
- Commands: `.opencode/commands/*.md`
- Context knowledge: `.opencode/context/*/*.md`

## Memory System

- Working memory: `context/MEMORY.md` (2,500 char cap, frozen snapshot at session start)
- User profile: `context/USER.md` (1,500 char cap)
- Decision register: `context/decisions.md` (append-only)
- Pipeline tracker: `context/progress.md`
- Daily logs: `context/memory/YYYY-MM-DD.md`
- Skill: `.opencode/skills/memory/SKILL.md` for procedural operations

## Required Workflow

Spec → Implementation → Deploy Config → QA Audit

## Quality Bar

Build must succeed. TypeScript strict must pass. Lint must pass. Tests must pass. QA report required.
