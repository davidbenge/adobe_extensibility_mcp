# /dev-completed-implementation-task

**Invoked by**: Cursor User when task work is reviewed and passing  
**Chains to**: /dev-write-impl-log-entry, /dev-update-impl-log-index (auto) then archive task folder

## Parameters

Pass **task ID only** (e.g. `T1`) when the story is clear from context, or **story ID and task ID** (e.g. `AARCH-51 T1`).

## Pre-check

User confirms work reviewed and passing

## Execute

- Chain to /dev-write-impl-log-entry for each domain (db, backend, frontend, test, security)
- Chain to /dev-update-impl-log-index for each domain
- Move docs/stories/$STORY_ID/impl/$TASK_ID/ to docs/impl-log/stories/$STORY_ID/$TASK_ID/
- If all tasks done: prompt user to run /plan-story-complete at impl level
