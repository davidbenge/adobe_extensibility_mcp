# E2E Tests

**✅ PASSED** — 9/9 tests passed in 2.27s

_2026-03-11 06:15:47 UTC_

---

## ✅ `test/e2e.test.js` (9/9)

### E2E: Adobe Extensibility MCP — https://27200-adobeextmcp-stage.adobeioruntime.net/api/v1/web/adobe-extensibility-mcp/skills-mcp › Health check

- ✅ GET returns healthy status _(180ms)_

### E2E: Adobe Extensibility MCP — https://27200-adobeextmcp-stage.adobeioruntime.net/api/v1/web/adobe-extensibility-mcp/skills-mcp › MCP handshake

- ✅ initialize returns protocol version and server info _(140ms)_
- ✅ tools/list returns exactly 3 tools _(109ms)_

### E2E: Adobe Extensibility MCP — https://27200-adobeextmcp-stage.adobeioruntime.net/api/v1/web/adobe-extensibility-mcp/skills-mcp › list_skills

- ✅ returns all 10 skill domains with name and description _(120ms)_

### E2E: Adobe Extensibility MCP — https://27200-adobeextmcp-stage.adobeioruntime.net/api/v1/web/adobe-extensibility-mcp/skills-mcp › load_skill

- ✅ returns skill body for app-builder-actions _(285ms)_
- ✅ returns isError for unknown skill _(292ms)_

### E2E: Adobe Extensibility MCP — https://27200-adobeextmcp-stage.adobeioruntime.net/api/v1/web/adobe-extensibility-mcp/skills-mcp › read_skill_resource

- ✅ returns reference file content for app-builder-actions/ACTION_STRUCTURE.md _(305ms)_
- ✅ returns reference file content for workfront-tasks-api _(127ms)_
- ✅ returns isError for unknown resource path _(286ms)_
