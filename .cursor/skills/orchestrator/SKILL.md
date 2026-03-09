---
name: orchestrator
description: Use when workflow is stuck, deadlock occurred, or human needs meta-view of current state.
---

# Orchestrator Skill

## References

- **Basic usage**: Instructions in this file (read current artifact and impl-log indexes, assess state, recommend next command or resolution).
- **System state**: All `docs/impl-log/*/index.md` files; full current artifact (story-plan or task-plan)

## Role Boundary

**Does**: Assess state, recommend next command. Manage process only.  
**Does NOT**: Write code, specs, or domain content.

## Instructions

- Read full current artifact and impl-log indexes
- Assess where things stand
- Recommend next command or resolution path
- Surface deadlocks clearly for human decision
