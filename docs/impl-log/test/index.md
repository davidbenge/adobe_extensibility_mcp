# Test System State

## Stack

Jest only. No Playwright, no E2E, no live endpoint tests.

## Test File

`test/skills-mcp.test.js`

## Coverage

| Area | Tests |
|------|-------|
| Health check (GET) | ✅ |
| CORS OPTIONS | ✅ |
| MCP initialize | ✅ |
| tools/list (3 tools) | ✅ |
| list_skills (6 skills) | ✅ |
| load_skill valid | ✅ |
| load_skill invalid | ✅ |
| read_skill_resource valid | ✅ |
| read_skill_resource invalid path | ✅ |
| read_skill_resource invalid skill | ✅ |
| Invalid JSON | ✅ |
| Unknown tool | ✅ |
| Unsupported HTTP method | ✅ |

## Running Tests

```bash
npm test           # pretest generates registry.json first
npm run test:watch
```
