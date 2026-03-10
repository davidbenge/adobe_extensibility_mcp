# Backend System State

## Active Action: skills-mcp

| Item | Value |
|------|-------|
| Entry file | `actions/skills-mcp/index.js` |
| Registry module | `actions/skills-mcp/registry.js` |
| Registry data | `actions/skills-mcp/registry.json` (generated) |
| Runtime | nodejs:20 |
| MCP SDK | `@modelcontextprotocol/sdk` v1.17.4 |

## Tools

| Tool | Arguments | Returns |
|------|-----------|---------|
| `list_skills` | none | JSON array of `{ name, description }` for all 7 skills |
| `load_skill` | `skill_name: string` | SKILL.md body or `isError: true` |
| `read_skill_resource` | `skill_name: string, resource_path: string` | Reference file content or `isError: true` |

## Skills

7 domains, 32 reference files. See `actions/skills-mcp/skills/`.

| Skill | References | Covers |
|-------|-----------|--------|
| `app-builder-actions` | 4 | I/O Runtime action patterns |
| `app-builder-frontend` | 4 | React Spectrum, IMS token patterns |
| `workfront-extension` | 4 | Workfront product extension + shell integration |
| `workfront-api` | 12 | Tasks (TASK), Issues (OPTASK), Custom Forms |
| `workfront-projects-api` | 4 | Projects, Portfolios, Programs, Milestones |
| `workfront-events-api` | 4 | Event Subscriptions (webhooks) |
| `workfront-documents-api` | 4 | Documents, Versions, Folders |

## Build

```bash
node scripts/generate-registry.js   # generates registry.json
npm run build                        # webpack bundle
npm test                             # runs pretest (registry gen) + jest
```
