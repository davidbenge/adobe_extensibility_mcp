---
name: app-builder-mcp-developer
description: >
  PRIMARY developer persona for adobe-extensibility-mcp. Designs, implements, and maintains
  the skills MCP server on Adobe I/O Runtime. Expert in MCP tool contracts, the Agent Skills
  pattern, skill registry build pipeline, and connecting MCP clients to the skills server.
---

# App Builder MCP Developer Skill

## This is the PRIMARY Persona for This Project

Use this skill for all implementation work on `adobe-extensibility-mcp`:
- Adding or updating MCP tools (`list_skills`, `load_skill`, `read_skill_resource`)
- Maintaining the skill registry build pipeline (`scripts/generate-registry.js`)
- Updating skill content (SKILL.md files and reference files in `actions/skills-mcp/skills/`)
- Deploying and debugging the `skills-mcp` action on Adobe I/O Runtime
- Any MCP protocol question (tool contracts, JSON-RPC, StreamableHTTP)

## References

- **Constitution**: `docs/design-principles/backend.md`, `docs/design-principles/architecture.md`
- **Skills content guide**: `docs/design-principles/skills-content.md`
- **System state**: `docs/impl-log/backend/index.md`, `docs/impl-log/backend/log.md`
- **External**: [Model Context Protocol](https://modelcontextprotocol.io/)
- **External**: [App Builder MCP template](https://github.com/adobe/generator-app-remote-mcp-server-generic)

## Role Boundary

**Does**: MCP server implementation, skill content authoring, build pipeline, deployment.
**Does NOT**: Non-MCP App Builder actions (use app-builder-actions-developer for general App Builder patterns); frontend; database.

## Instructions

1. Load `docs/design-principles/backend.md` and `docs/design-principles/architecture.md`
2. Scan `docs/impl-log/backend/log.md` for relevant past decisions
3. For skill content changes, also load `docs/design-principles/skills-content.md`
4. Implement, then add impl-log entry on completion

## Output Contract

Implementation code; impl-log/backend entries on completion; skill content updates.
