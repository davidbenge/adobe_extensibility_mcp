# Architecture

## Topology

```
MCP Client (Claude Code, or any MCP-compatible agent)
    ↓  HTTP POST (JSON-RPC 2.0)
Adobe I/O Runtime — skills-mcp action
    ↓  require()
registry.json  ←  built by scripts/generate-registry.js at prebuild/pretest
    ↓
actions/skills-mcp/skills/[domain]/SKILL.md
actions/skills-mcp/skills/[domain]/references/*.md
```

## Single Action

This project deploys exactly **one action**:

| Action | Path | Purpose |
|--------|------|---------|
| `skills-mcp` | `actions/skills-mcp/index.js` | MCP server — serves all 3 tools |

**No frontend. No database. No auth.**

## Build Pipeline

```
npm run build  (or npm test, which runs pretest first)
  └── node scripts/generate-registry.js
        ├── Walks actions/skills-mcp/skills/*/SKILL.md
        ├── Parses frontmatter (gray-matter)
        └── Writes actions/skills-mcp/registry.json
```

The generated `registry.json` is loaded at action startup via `require('./registry.json')` in `registry.js`. Resource files are loaded at startup via `fs.readFileSync` into a Map (one I/O operation per file, not per request).

## MCP Transport

- **Protocol**: MCP Streamable HTTP (stateless, JSON mode)
- **No SSE**: Returns graceful 200 + close on SSE requests (serverless limitation)
- **Stateless**: Fresh server + transport per request — no session state
- **CORS**: Full CORS headers on all responses

## Request Flow

```
POST /skills-mcp
  └── main(params) [Adobe I/O Runtime]
        ├── Initialize logger
        ├── Switch on __ow_method
        │   ├── GET → health check
        │   ├── OPTIONS → CORS preflight
        │   └── POST → handleMcpRequest()
        │         ├── buildMcpServer() (registers 3 tools)
        │         ├── StreamableHTTPServerTransport (enableJsonResponse: true)
        │         ├── server.connect(transport)
        │         └── transport.handleRequest(req, res, body)
        └── return { statusCode, headers, body }
```

## CommonJS

All code is CommonJS (`require`/`module.exports`). No TypeScript, no ESM, no build step beyond webpack for deployment bundling.

## Key Files

| File | Purpose |
|------|---------|
| `actions/skills-mcp/index.js` | MCP server action — main entry point |
| `actions/skills-mcp/registry.js` | Loads registry.json, builds catalog + resourceCache |
| `actions/skills-mcp/registry.json` | Generated — do not edit manually |
| `actions/skills-mcp/skills/*/SKILL.md` | Skill definitions (frontmatter + body) |
| `actions/skills-mcp/skills/*/references/*.md` | Reference files served by read_skill_resource |
| `scripts/generate-registry.js` | Build script: parses skills, writes registry.json |
| `app.config.yaml` | I/O Runtime deployment manifest |

## Constraints

- Action runtime: `nodejs:20`
- Timeout: 300,000ms (5 minutes — generous for cold starts)
- Memory: 512MB
- No authentication required (`require-adobe-auth: false`)
- Raw HTTP mode (`raw-http: true`) required for MCP JSON-RPC
