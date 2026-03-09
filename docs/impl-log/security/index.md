# Security System State

## Risk Tier

**Tier 3** — public read-only knowledge endpoint; no user data, no credentials, no write operations.

## Auth

None. Public endpoint. `require-adobe-auth: false` in `app.config.yaml`.

## Input Validation

- JSON-RPC parsing: MCP SDK (Zod schemas for tool arguments)
- Tool handlers: skill_name and resource_path validated against known registry keys
- Invalid inputs return `isError: true` — no 4xx, no stack traces

## CORS

Permissive (`*`) — appropriate for public knowledge API.

## No Sensitive Data

Skills content is public Adobe developer knowledge. No PII, no credentials, no business secrets in skill files.
