# /dev-review-implementation-plan

**Invoked by**: Cursor User when impl plan needs debate  
**Chains to**: Pause for human

## Load

architect skill

## Questions for the human

Before running the debate, ask the user in chat:

1. **What triggered the review?** — "What prompted this review? (e.g. conflict between approaches, uncertainty about scope, or a sanity check before execution.)"
2. **Focus areas or guardrails?** — "Any tasks, contracts, or risks you want the debate to focus on? Any constraints the plan must respect? (e.g. 'no new deps', 'must match architecture.md'.)"
3. **Who should speak first?** — "If multiple perspectives matter (e.g. Architect vs Dev Lead), which should respond first, or leave order to the agent?"

## Process

- Formal debate on impl plan
- Threaded entries to Debate Log (in `docs/impl-log/stories/<id>/impl/plan.md` under "Plan Review (Debate Log)")
- **Interactive feedback:** Ask the user: any changes to scope, ordering, or contracts based on the debate? If yes, apply and optionally run another round; if no, confirm approval.
- Pause for human approval
