# /plan-story-complete

**Invoked by**: Cursor User  
**Chains to**: Jira push, archive story artifacts

## Pre-check

- No open Tier 1 findings
- All Tier 2 have human Disposition
- Status: Ready for Ratification

## Execute

- Push story-plan to Jira via MCP (use Jira project and component from design-principles vision or architecture if defined; otherwise proceed as usual)
- Append summary to impl-log/architecture/log.md
- Update architecture/index.md in-place
- Move docs/stories/$STORY_ID/story-plan.md to docs/impl-log/stories/$STORY_ID/story-plan.md
- Delete docs/stories/$STORY_ID/ (now empty)
