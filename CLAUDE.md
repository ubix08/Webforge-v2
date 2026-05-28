# CLAUDE.md

This repository uses `AGENTS.md` as the primary agent instruction file.

## Project Mission

Build production-ready web apps via WebForge's OpenCode agent system and structured pipeline.

## Canonical Instructions

- Root policy: `AGENTS.md`
- Agents: `.opencode/agents/*.md`
- Commands: `.opencode/commands/*.md`
- Context: `.opencode/context/*/*.md`

## Memory System

- State: `context/MEMORY.md` (2,500 char cap, session-start snapshot — do not explore repo)
- User: `context/USER.md` (1,500 char cap)
- Decisions: `context/decisions.md` (append-only)
- Progress: `context/progress.md`
- Daily logs: `context/memory/YYYY-MM-DD.md`
- Skill: `.opencode/skills/memory/SKILL.md`

## Workflow

Spec → Implementation → Deploy Config → QA Audit

## Quality Bar

Build, typecheck, lint, tests must pass. Deployment config valid. QA report required.
