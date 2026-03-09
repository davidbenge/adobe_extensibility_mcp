# Adobe Extensibility MCP — Agent Configuration

**Project**: `adobe-extensibility-mcp`
**Purpose**: Skills-serving MCP server on Adobe I/O Runtime. Serves curated Adobe developer knowledge (App Builder, Workfront APIs, IMS patterns) via 3 MCP tools to any MCP-compatible coding agent.

## Active Personas

| Persona | Skill File | When to Use |
|---------|-----------|-------------|
| Product Manager | `.cursor/skills/product-manager/SKILL.md` | Story planning, acceptance criteria |
| Architect | `.cursor/skills/architect/SKILL.md` | Architecture review, system impact |
| Dev Lead | `.cursor/skills/dev-lead/SKILL.md` | Task breakdown, sequencing |
| **MCP Developer** | `.cursor/skills/app-builder-mcp-developer/SKILL.md` | **PRIMARY** — all MCP server work |
| App Builder Actions | `.cursor/skills/app-builder-actions-developer/SKILL.md` | Action structure, error handling, deployment |
| Test Engineer | `.cursor/skills/test-engineer/SKILL.md` | Test strategy, coverage |
| Security Expert | `.cursor/skills/security-expert/SKILL.md` | Security review |
| Orchestrator | `.cursor/skills/orchestrator/SKILL.md` | Multi-persona coordination |

## Archived Personas (not applicable to this project)

- `graph-db-specialist` — ARCHIVED (no Neo4j)
- `ims-login` — ARCHIVED (no IMS auth)
- `app-builder-frontend-developer` — ARCHIVED (no frontend)

## Commands

See `.cursor/commands/` for workflow commands.
Claude Code equivalents: `.claude/commands/`

## Key Paths

| Area | Path |
|------|------|
| Action code | `actions/skills-mcp/` |
| Skill content | `actions/skills-mcp/skills/` |
| Build script | `scripts/generate-registry.js` |
| Tests | `test/skills-mcp.test.js` |
| Design principles | `docs/design-principles/` |
| Impl log | `docs/impl-log/` |
