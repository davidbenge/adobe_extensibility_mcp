# /dev-completed-implementation

**Invoked by**: User when ready to review and close out a story's implementation
**Chains to**: /dev-completed-implementation-task (per selected task), /plan-story-complete (user at end)

## Parameters

Pass **story ID** (e.g. `AARCH-51`). The command reviews the full implementation and all its tasks for that story.

## Purpose

Story-level completion: (1) review implementation and task status, (2) interactively offer to complete any incomplete tasks via /dev-completed-implementation-task, (3) review implementation for principles or skill updates, (4) finalize and close out the work.

## Load

- Read `docs/stories/$STORY_ID/impl/plan.md` (or `docs/impl-log/stories/$STORY_ID/impl/plan.md` if story is under impl-log).
- For each task in the plan, determine status: task folder present under `impl/$TASK_ID/` vs archived under `docs/impl-log/stories/$STORY_ID/$TASK_ID/`.

## Phases

### 1. Review — Task status

- List all tasks from the implementation plan.
- For each task: report **complete** (archived to impl-log) or **not complete** (task folder still under impl, or no archive).
- Summarize: which tasks are done, which are not. Show users what is not complete.

### 2. Interactive — Complete selected tasks (if any incomplete)

- If not all tasks are complete: go interactive.
- Show the list of incomplete tasks. Ask the user if they want to complete selected tasks (by task ID).
- For each task the user selects to complete: run /dev-completed-implementation-task for that task (pass $STORY_ID and $TASK_ID). Let dev-completed-implementation-task be responsible for doing its work (write impl-log entries, update indexes, archive task folder).
- After each selected task completes, re-check status. Repeat until user has no more to complete or all tasks are done.

### 3. Principles & skill review

- Look over the implementation: impl-log entries for this story, archived task-plans, any errors or gaps noted during the process.
- Determine:
  - **Principles**: Does any data or decision need to be added to design-principles (e.g. architecture, backend, testing, security)?
  - **Skills**: Were there errors or recurring issues during the process that might mandate an update to a persona skill (e.g. missing guidance, wrong convention)?
- Present findings to the user. If updates are recommended, ask if they want to apply them (or create follow-up items). Do not auto-edit principles or skills without user confirmation.

### 4. Finalize — Close out

- Confirm all tasks that should be complete are archived and impl-log entries/indexes are up to date (dev-completed-implementation-task handles this per task).
- If all tasks are done: prompt the user to run **/plan-story-complete** at impl level (push to Jira if configured, update architecture log/index, remove story working folder, sanity-check system state).
- Remind user to review `architecture/log.md` and `architecture/index.md` before confirming story close.
