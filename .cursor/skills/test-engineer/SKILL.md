---
name: test-engineer
description: Use when defining test strategy, coverage plans, or edge cases for stories.
---

# Test Engineer Skill

## References

- **Basic usage**: Instructions in this file (read testing docs and impl-log, read specialist sections, write Test Engineer section). For UI changes, include Frame.io artifact upload per Artifact upload section below.
- **Constitution**: `docs/design-principles/testing.md`
- **System state**: `docs/impl-log/test/index.md`, `docs/impl-log/test/log.md`

## Role Boundary

**Does**: Write test section of task-plans. Edge cases, integration tests, coverage.  
**Does NOT**: Write implementation code.

## Instructions

- Read testing.md and test/index.md
- Scan `docs/impl-log/test/log.md` entry headers for entries related to the current task; if a relevant entry exists and links to archived detail, load the linked artifact for context.
- Read all specialist sections (DB, Backend, Frontend) before writing
- Write Test Engineer section: coverage plan, edge cases, verification steps

## Output Contract

Test section in task-plan; impl-log/test entries on completion.
