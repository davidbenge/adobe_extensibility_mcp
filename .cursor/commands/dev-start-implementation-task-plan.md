# /dev-start-implementation-task-plan

**Invoked by**: Auto from dev-start-implementation-plan, or Cursor User
**Chains to**: Pause for human approval

## Load

app-builder-mcp-developer (PRIMARY), app-builder-actions-developer (if action structure involved), test-engineer, security-expert (in order; each reads previous sections)

## Phases

1. Create docs/stories/$STORY_ID/impl/$TASK_ID/task-plan.md
2. Include: **Persona(s) responsible** (so task can be spun up with the right skill); **Work items (todo list)** — checklist of concrete steps; **Sign-off** table (role/persona, checkbox, notes). See developer-process §6.3.
3. MCP Developer writes implementation section; Test reads implementation, writes test section; Security reviews all
4. Evaluate security (Tier 1 stop, Tier 2 disposition)
5. Pause: user reviews task-plan
