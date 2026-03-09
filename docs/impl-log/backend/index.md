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
| `list_skills` | none | JSON array of `{ name, description }` for all 6 skills |
| `load_skill` | `skill_name: string` | SKILL.md body or `isError: true` |
| `read_skill_resource` | `skill_name: string, resource_path: string` | Reference file content or `isError: true` |

## Skills

6 domains, 24 reference files. See `actions/skills-mcp/skills/`.

## Build

```bash
node scripts/generate-registry.js   # generates registry.json
npm run build                        # webpack bundle
npm test                             # runs pretest (registry gen) + jest
```
