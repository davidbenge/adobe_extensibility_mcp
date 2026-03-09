# Architecture System State

## Current Topology

**Single-action deployment on Adobe I/O Runtime.**

| Component | Status |
|-----------|--------|
| `skills-mcp` action | Active — MCP server |
| Frontend | None |
| Database | None |
| Auth | None (public endpoint) |

## Action: skills-mcp

- Entry: `actions/skills-mcp/index.js`
- Runtime: nodejs:20
- Transport: MCP Streamable HTTP (stateless, JSON mode)
- Tools: `list_skills`, `load_skill`, `read_skill_resource`

## Build Pipeline

`scripts/generate-registry.js` walks skill markdown files and generates `actions/skills-mcp/registry.json` at prebuild and pretest.

## CI/CD

GitHub Actions workflows in `.github/workflows/`. See `docs/developer-setup/cicd-setup.md`.

## Skill Domains

6 skill domains in `actions/skills-mcp/skills/`:
- `app-builder-actions`
- `app-builder-frontend`
- `workfront-extension`
- `workfront-tasks-api`
- `workfront-issues-api`
- `workfront-forms-api`
