# /dev-start-implementation-task

**Invoked by**: User when starting at a sub-task level
**Chains to**: Pause for human review

## Purpose

Execute implementation for one task only (e.g. `$STORY_ID $TASK_ID`). Use when you want to work on a single task without running the full story.

## Load

Relevant specialist skills for the task (from task-plan: backend, test, security as applicable)

## Phases

1. Read docs/stories/$STORY_ID/impl/$TASK_ID/task-plan.md.
2. Execute specialist work against each section (backend, test, security).
3. Pause: user reviews work, then runs /dev-completed-implementation-task (with task id or story id + task id) for this task or runs /dev-start-implementation-task for another task.
