# /plan-story-review-with-tech-team

**Invoked by**: Auto from /plan-new-backlog-story, or User
**Chains to**: Security review (auto), then pause for ratification

## Load

architect, dev-lead, security-expert skills (sequence)

## Phases

1. **Architect**: Read architecture.md, architecture/index.md, story-plan. Write Architect Review section.
2. **Dev Lead**: Read story-plan (incl Architect). Write Dev Lead Review section.
3. **Security**: Read security.md, risk-register, story-plan. Write Security Expert Review. Evaluate: Tier 1 → stop; Tier 2 → await disposition; clean → Ready for Ratification.

## Pause

Notify user. If Tier 2: human fills Disposition. If clean: user runs /plan-story-complete.
