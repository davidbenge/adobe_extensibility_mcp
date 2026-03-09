# /dev-write-impl-log-entry

**Invoked by**: Auto from /dev-completed-implementation or /dev-completed-implementation-task
**Chains to**: /dev-update-impl-log-index (auto)

## Load

Relevant specialist skill for domain

## Process

- Specialist writes structured entry to impl-log/[domain]/log.md using this format:
  ```
  ## [STORY-ID] | [Title] | [Date]
  **What**: 1-2 sentence summary of change
  **Why**: Problem or motivation
  **Key decisions**: Non-obvious choices, trade-offs, alternatives rejected
  **Contracts**: API shapes, data contracts, or interfaces other domains depend on
  **See**: [task details](../stories/$STORY_ID/$TASK_ID/task-plan.md)
  Story: [STORY-ID]
  ```
- Chain to /dev-update-impl-log-index for that domain
