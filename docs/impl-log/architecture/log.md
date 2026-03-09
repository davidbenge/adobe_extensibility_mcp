# Architecture Implementation Log

## 2026-03-08 — Initial migration from template

**Decision**: Migrated from `@adobe/generator-app-remote-mcp-server-generic` template to product implementation.

**Changes**:
- Replaced placeholder tools (echo, calculator, weather) with 3 skills tools
- Renamed action from `mcp-server` to `skills-mcp`
- Created build pipeline: `scripts/generate-registry.js` → `registry.json`
- Authored 6 skill domains (30 markdown files)
- Updated runtime to nodejs:20
- Removed resources/prompts capabilities (tools-only server)

**Rationale**: Template served as scaffold; product is a knowledge-serving MCP server with a specific 3-tool interface and skill registry pattern.
