# /dev-start-implementation

**Invoked by**: User (after plan approved)
**Chains to**: Task execution in new context windows (per dependency order); then inform user when whole plan is done for review

## Parameters

Pass **story ID** (e.g. `AARCH-51`). Optionally pass a path to the impl plan if it lives outside the default (e.g. under `docs/impl-log/stories/$STORY_ID/impl/plan.md`).

## Purpose

Run the **whole implementation plan** for the story. This command acts as a **planner**: it reads the plan and task dependency order, hands out tasks (to new context windows) so that independent tasks run in parallel and dependent tasks run when their dependencies are complete. Personas execute each task in the context where it is handed out. When a task is **completed and tested**, mark it complete in the task plan. When **all tasks** are done, inform the user that implementation is **done for review** (do not pause for human sign-off after each task).

## Load

- Resolve **plan path**: `docs/impl-log/stories/$STORY_ID/impl/plan.md` if it exists, else `docs/stories/$STORY_ID/impl/plan.md`. If the user passed an optional plan path, use that. Read the plan.
- Resolve **task-plan path** per task: `docs/impl-log/stories/$STORY_ID/impl/$TASK_ID/task-plan.md` if it exists, else `docs/stories/$STORY_ID/impl/$TASK_ID/task-plan.md` (prefer impl-log so archived stories work).
- Parse the **Tasks and Dependency Order** (or equivalent) to get task IDs, descriptions, and dependencies.

## Phases

### 1. Plan — Task order and wave computation

- List all tasks from the plan and their dependencies.
- **Determine the next wave of tasks to run:** If the plan contains a **"Sequencing summary"** (e.g. "Wave 1 (parallel): T1, T6, T7, T8"), parse it and use the first wave that has at least one task not yet complete; that wave's task list is the current wave. If there is no Sequencing summary, compute ready tasks from the Tasks table: ready = tasks whose Deps column is "—" or whose dependency task IDs are all in the completed set; then run that set as the current wave. After each wave, add the executed task IDs to the completed set and repeat until all tasks are complete or no ready tasks remain.
- Maintain a **completed** set (initially empty). Ready tasks = either the first wave with incomplete tasks (from Sequencing summary) or tasks whose deps are all in completed (from table).

### 2. Hand out tasks — parallel (Agent tool) or sequential fallback

**2a. Check for parallel capability.** If the **Agent tool** (or equivalent subagent tool) is available in this environment, use it for parallel execution (steps 2b-2d). Otherwise skip to **Phase 2 fallback** (2e).

**2b. For the current wave:** For each task ID in the current wave (from Phase 1), build the subagent prompt from [dev-start-implementation-subagent-prompt.md](dev-start-implementation-subagent-prompt.md), substituting STORY_ID, TASK_ID, PLAN_PATH, TASK_PLAN_PATH. Call the **Agent tool** with the filled-in prompt.

Invoke one Agent call per task in the wave **in the same turn** (parallel calls).

**2c. Wait and collect.** When all Agent calls for the wave return, collect each result (task ID, success/failed, summary). **Treat all tasks in the wave as complete for dependency purposes once their Agent calls have returned** (use return status only; do not re-read task-plan). If any task failed: report the failed task(s) and summary to the user; **stop the run** (do not start the next wave). User may fix and re-run /dev-start-implementation or run remaining tasks via /dev-start-implementation-task.

**2d. Mark wave complete and advance.** Add the task IDs from this wave to the completed set. If there are more tasks in the plan not in the completed set, determine the next wave (from Sequencing summary or by recomputing ready tasks) and repeat from 2b. If all tasks are complete, go to Phase 4 (Done for review).

**2e. Phase 2 fallback — Single-context.** If Agent tool is not available, run tasks **sequentially** in this context: for each task in dependency order (or in wave order), read its task-plan, load the relevant skills, execute work items and tests, and update the task-plan to mark complete. Then proceed to Phase 4 when all done.

### 3. Mark complete in the task plan

- When a task is **completed and tested** (in subagent or in this context), the executor has already updated the task-plan (work items `[x]`, Status). This allows dependent tasks to be unblocked when their wave runs.

### 4. Done for review

- When **all tasks** in the plan are complete and tested, inform the user: implementation is **done for review**.
- Tell the user to run **/dev-completed-implementation [story-id]** to review task status, optionally complete any remaining sign-off/archive steps per task, do principles/skill review, and finalize (or to run **/dev-completed-implementation-task** per task for sign-off and archive if they prefer task-by-task).
- Do not prompt for /plan-story-complete until the user has run dev-completed-implementation (or equivalent) after review.

## Notes

- **Parallel execution:** When Agent tool is available, the planner invokes it once per task in the current wave (same turn), so all tasks in that wave run in parallel. Subagent prompt is defined in [dev-start-implementation-subagent-prompt.md](dev-start-implementation-subagent-prompt.md).
- **On subagent failure:** Stop and report failed task(s) and their summaries; do not start the next wave.
- **Single-context fallback:** If Agent tool is not available, run tasks sequentially in dependency order in this context; still mark each task complete in the task plan when done and tested, and inform the user when the whole plan is done for review.
- **Path to plan:** If the story has no `docs/stories/$STORY_ID/` (e.g. story is only under impl-log), use `docs/impl-log/stories/$STORY_ID/impl/plan.md` and task folders under `docs/impl-log/stories/$STORY_ID/impl/$TASK_ID/`.
