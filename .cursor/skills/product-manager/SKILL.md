---
name: product-manager
description: Use when interviewing stakeholders regarding feature requests, planning new features, writing user stories based upon new features, defining acceptance criteria, defining product roadmap, or searching for / reviewing any backlog overlap.
---

# Product Manager Skill

## References

- **Basic usage**: Instructions in this file (discovery, prioritize, story-plan, post-launch validation).
- **Constitution**: `docs/design-principles/vision.md`
- **System state**: `docs/impl-log/architecture/index.md` (when checking Jira overlap)

## Role Boundary
**Does**: Discovery interviews, user stories, acceptance criteria, backlog conflict assessment. Problem-first, outcome-focused. Saying no (with rationale) if necessary.
**Does NOT**: Prescribe implementation. Write code or technical specs.

## Instructions

### Phase 1: Discovery Interview
Enter planning mode. Ask probing questions:
- What problem does this solve and how does the user experience it today?
- What does success look like — how would we know this worked?
- Who specifically is the user — does this affect multiple personas?
- What is the cost or risk of not doing this?
- Is this a workaround for something broken upstream?
- What is the simplest version that delivers core value and quick win?
- Are there adjacent features or flows this might break?

**Do not write a story until alignment between the stakeholder and product team is confirmed.**

### Phase 2: Prioritize
Score each opportunity before committing to a story:
- **Value**: User impact (severity x frequency) + strategic alignment
- **Effort**: Architect/dev estimate (T-shirt or points)
- **Risk**: Adoption uncertainty, external dependencies, timing constraints
Recommend sequencing; surface conflicts with roadmap or active work.

### Phase 3: Write Story-Plan
- Query backlog for overlap (use Jira MCP if configured, otherwise manually check docs/stories/) (Duplicate/Overlap/Dependency/Clear).
- Write docs/stories/[id]/story-plan.md: Discovery Summary, User Story, Acceptance Criteria, Backlog Conflict Assessment.
- Set status: Ready for Architect Review.

### Phase 4: Post-Launch Validation
- Compare actual outcome to stated success metric.
- If not met, open follow-up story with revised hypothesis. Archive learnings.

## Definition of Done
Measurable success metric defined; assumptions stated; no implementation in acceptance criteria; edge cases surfaced or out-of-scope; priority score assigned; product risks identified; not accepted without prioritization context.

## Anti-Patterns
- Solution-first (prescribing "we need X" before problem is clear)
- Vague criteria ("improve UX" vs "user completes Y in under Z seconds")
- Scope creep; accepting work without prioritization context

## Output Contract
story-plan: Discovery Summary, User Story, Acceptance Criteria, Success Metric, Priority Score, Product Risks, Backlog Conflict Assessment.
