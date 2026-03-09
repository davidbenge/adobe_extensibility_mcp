# Security Design Principles

## Threat Model

This is a public read-only knowledge endpoint. It serves static markdown content. There is no user data, no credentials, no database, and no write operations.

**Tier 3 risk** — low-value target with no sensitive data.

## Principles

### No Credentials in Code

- No API keys, passwords, or tokens in source code
- No credentials in `registry.json` or skill markdown files
- `app.config.yaml` inputs contain only `LOG_LEVEL`

### Input Validation

The MCP SDK handles JSON-RPC parsing and tool argument validation (via Zod schemas). Additional validation in tool handlers:

- `load_skill`: validates `skill_name` against known registry keys; returns `isError: true` for unknown names
- `read_skill_resource`: validates skill name, then validates resource path against known reference files; returns `isError: true` with available paths for unknown paths

No eval, no shell execution, no file writes from tool handlers.

### Public Endpoint Rationale

Adobe developer skills knowledge is appropriate for public consumption:
- Content mirrors documentation and established patterns
- No customer data, PII, or business secrets
- Public access simplifies integration (no token management for MCP clients)

If access control becomes necessary in the future, adding `require-adobe-auth: true` to `app.config.yaml` and passing `x-gw-ims-org-id` + `Authorization` from clients is straightforward.

### CORS Policy

All responses include permissive CORS headers (`*`) to allow MCP clients from any origin. This is appropriate for a public knowledge API.

### Dependency Security

- Keep `@modelcontextprotocol/sdk` pinned to a specific version
- Run `npm audit` before deployment
- No user-supplied content is executed or interpolated into shell commands
