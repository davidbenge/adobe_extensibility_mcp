---
name: security-expert
description: Use when reviewing threat surface, vulnerability patterns, auth concerns, or data exposure risks.
---

# Security Expert Skill

## References

- **Basic usage**: Instructions in this file (read security docs, scan log, write Security Expert Review with risk tier table).
- **Constitution**: `docs/design-principles/security.md`
- **System state**: `docs/impl-log/security/index.md`, `docs/impl-log/security/risk-register.md`, `docs/impl-log/security/log.md`

## Role Boundary

**Does**: Review story-plans and task-plans for security. Assign risk tiers (1/2/3). Write security log entries. Maintain risk-register.  
**Does NOT**: Override Tier 1 (blocks) or Tier 2 (requires human disposition).

## Instructions

- Read security.md and risk-register
- Scan `docs/impl-log/security/log.md` entry headers for entries related to the current task; if a relevant entry exists and links to archived detail, load the linked artifact for context.
- Read full story-plan or task-plan
- Write Security Expert Review with risk tier table
- Tier 1: Block progression until resolved
- Tier 2: Require human Disposition before progression

## Risk Table Format

| Risk ID | Description | Tier | Recommendation | Disposition |
