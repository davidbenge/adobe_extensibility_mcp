# /dev-start-implementation-plan

**Invoked by**: Cursor User  
**Chains to**: /dev-start-implementation-task-plan for first task (auto)

## Load

architect, dev-lead skills

## Questions for the human

Before creating the plan, ask the user in chat:

1. **Which story?** — "Which story ID are we planning for? (e.g. AARCH-74). If you have the Jira key or a short title, share it so we can pull the right story."
2. **Constraints?** — "Any must-honor constraints for this implementation? (e.g. no new shared libs, stay within existing services, or a hard deadline.)"
3. **Risks and unknowns** — "Do you want the plan to call out risks or unknowns explicitly, or keep the plan minimal and address those as we go?"
4. **Task-plan cadence** — "After the impl plan is created, do you want task-plans generated for all tasks in one go, or pause after each task-plan for your review before the next?"

## Phases

1. Read Jira story (MCP), design-principles/architecture.md, all impl-log index files
2. Create docs/stories/$STORY_ID/impl/plan.md:
   - Tasks table (task, description, deps, owner)
   - **Dependency, parallelism, and work areas** — table or section: deps, can-run-in-parallel-with, work areas (paths), collision risk; plus sequencing summary (waves) so the planner knows when to run personas in parallel vs. sequence. See developer-process §6.3 and existing impl plans (e.g. AARCH-51).
   - Interface contracts, touchpoints, definition of done per task
3. Chain to /dev-start-implementation-task-plan for each task in order. Each task-plan must include: **Persona(s) responsible**, **Work items (todo list)**, **Sign-off** table. See developer-process §6.3.

## Pause

When all task-plans written and security reviewed. User reviews and approves.
