# /dev-implementation-plan-status

**Invoked by**: Cursor User  
**Chains to**: None (roll-up report only)

## Purpose

Show roll-up status of the implementation plan: tasks listed, which have task-plan.md, which are complete/archived, any blockers or security flags.

## Process

1. Read docs/stories/$STORY_ID/impl/plan.md (or prompt for $STORY_ID if not provided).
2. List tasks from plan; for each task, check for task-plan.md under impl/$TASK_ID/ and for archived folder under docs/impl-log/stories/$STORY_ID/$TASK_ID/.
3. Summarize: task ID, title/summary, status (planned | task-plan ready | in progress | complete/archived), any Tier 1/2 security flags from task-plan or story-plan.
4. Output a concise roll-up for the user; no chaining.
