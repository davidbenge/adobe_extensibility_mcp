# /plan-new-backlog-story

**Invoked by**: User with "idea" or feature brief
**Chains to**: /plan-story-review-with-tech-team (auto)

## Load

product-manager skill

## Phases

1. **Discovery**: Enter discovery interview. Do not load files. Interview per discovery questions. Confirm understanding.
2. **Research**: Load vision.md, architecture.md. Query backlog for overlap (use Jira MCP if configured, otherwise manually check docs/stories/).
3. **Write**: Create docs/stories/$STORY_ID/story-plan.md with Discovery Summary, User Story, Acceptance Criteria, Backlog Conflict Assessment. Set status: Ready for Architect Review.

## Auto-chain

/plan-story-review-with-tech-team $STORY_ID
