# Subagent prompt for dev-start-implementation (parallel execution)

**Purpose:** This prompt is used when the planner hands out one task to a subagent via mcp_task. The subagent runs in a separate context with no prior chat state.

**Referenced by:** [dev-start-implementation.md](dev-start-implementation.md) — the planner builds the subagent prompt from this template.

---

## Inputs the planner must substitute

| Placeholder       | Description |
|-------------------|-------------|
| `{{STORY_ID}}`    | Jira story ID (e.g. AARCH-51). |
| `{{TASK_ID}}`     | Task ID (e.g. T1, T6). |
| `{{PLAN_PATH}}`   | Resolved path to impl plan (e.g. docs/impl-log/stories/AARCH-51/impl/plan.md). |
| `{{TASK_PLAN_PATH}}` | Resolved path to this task's task-plan (e.g. docs/impl-log/stories/AARCH-51/impl/T6/task-plan.md). |

Optional: `{{WORKSPACE_ROOT}}` if needed for paths (subagent typically has same workspace).

---

## Prompt template

Use the following text with the placeholders above substituted. Pass as the `prompt` parameter to mcp_task.

```markdown
You are implementing a single implementation task for a Cursor multi-persona workflow.

**Story ID:** {{STORY_ID}}
**Task ID:** {{TASK_ID}}

**Instructions:**
1. Read the implementation plan: {{PLAN_PATH}}
2. Read this task's task-plan: {{TASK_PLAN_PATH}}
3. Identify the "Persona(s) responsible" and load the relevant skill(s) from .cursor/skills/ for that persona.
4. Execute the task per the task-plan: complete every item in the "Work items (todo list)" section. Run any tests specified in the task-plan or in the impl plan for this task.
5. Update the task-plan file to mark work items complete (change `[ ]` to `[x]` for each done item) and set or update a "Status" line/section to "Complete" or "Done" so the parent planner can see the task is finished. Do not delete or archive the task folder.
6. Return a short summary to the parent in this format:
   - Task: {{TASK_ID}}
   - Status: success | failed
   - Summary: 1-2 sentences (what was done; if failed, why)
   Do not run /dev-completed-implementation-task (no archive); the parent coordinates completion and the user will run that after review.
```

---

## Rules

- **readonly:** Subagent must run with **readonly: false** so it can edit repo files and the task-plan. The planner passes this when invoking mcp_task.
- **Context:** Include story ID and task ID in the prompt so the subagent does not need other context.
