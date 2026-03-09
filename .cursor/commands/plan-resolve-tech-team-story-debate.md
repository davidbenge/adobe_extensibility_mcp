# /plan-resolve-tech-team-story-debate

**Invoked by**: Cursor User when personas conflict  
**Chains to**: Self (rounds) or pause

## Load

Specified persona skill, or orchestrator if none

## Questions for the human

Before running debate rounds, ask the user in chat:

1. **What's the disagreement?** — "In a sentence or two, what are the tech team (personas) disagreeing about? For example: approach to caching, scope of a task, or a design-principles conflict."
2. **Who should speak first?** — "Which persona do you want to respond first, if any? (e.g. Architect, Dev Lead, Security Expert — or leave order to the agent.)"
3. **Any guardrails?** — "Is there a constraint the debate must respect? (e.g. 'no new shared libraries', 'must align with architecture.md', or 'keep the current API contract.')"
4. **After this round** — "When this round finishes, do you want to: (a) run another round, (b) see a summary and make the call yourself, or (c) pause and pick up later?"

## Process

- Read full story-plan and Debate Log
- Write new threaded entry to Debate Log
- If resolution → update relevant section, set status: Resolution Reached
- If deadlock → set status: Deadlocked - Human Decision Required. Summarize for user.
