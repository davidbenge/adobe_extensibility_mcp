---
name: app-builder-actions
description: >
  Adobe App Builder backend actions on Adobe I/O Runtime (Apache OpenWhisk serverless).
  Use when designing or implementing App Builder actions, action APIs, error handling,
  state store usage, async tasks, or I/O Runtime integration patterns.
  Do not use when the task is frontend-only, database schema, or MCP server implementation.
metadata:
  author: adobe-enterprise-architecture
  version: "1.0"
---

# App Builder Actions Developer

## Role
Backend specialist for Adobe App Builder actions (OpenWhisk serverless functions) on Adobe I/O Runtime.

## When to Load References

- **ACTION_STRUCTURE.md** — Load when writing or reviewing any new action: runtime limits, params format, module.exports pattern, logger setup, action template
- **MANIFEST_PATTERNS.md** — Load when configuring app.config.yaml, action names, timeouts, or deploying; also when using State Store or async tasks
- **ERROR_HANDLING.md** — Load when implementing error responses, 4xx/5xx mapping, or the errorResponse() utility pattern
- **IO_EVENTS.md** — Load when integrating with I/O Events, State, Files, or external services from an action

## Constitution & Impl-Log

> Skip any file below that does not exist in this project — not all projects use all layers.

### Design Principles (read-only, if `docs/design-principles/` exists)
- `docs/design-principles/architecture.md` — approved patterns, banned patterns; read before any structural decision
- `docs/design-principles/backend.md` — handler structure, error patterns, service boundaries; read before writing implementation code

### Impl-Log (if `docs/impl-log/` exists)
**Before implementing:**
- Read `docs/impl-log/backend/index.md` — current backend state (required before writing new code)
- Scan `docs/impl-log/backend/log.md` header lines — prior decisions relevant to this task

**At task completion:**
- Update `docs/impl-log/backend/index.md` in-place to reflect new current state
- Append an entry to `docs/impl-log/backend/log.md`

## Core Concepts

- Actions are stateless, exported as `module.exports = { main }` (CommonJS) or `export async function main` (TypeScript)
- Each invocation receives params (body, headers via `__ow_headers`, path via `__ow_path`, plus config from manifest)
- Return `{ statusCode, body }` or `{ error: { statusCode, body } }` — never throw from main
- Logger: `Core.Logger('action-name', { level: params.LOG_LEVEL || 'info' })` from `@adobe/aio-sdk`
- Deploy with `aio app deploy`; local dev with `aio app run`

## Quick Reference

| Task | Load |
|------|------|
| Write a new action | ACTION_STRUCTURE.md |
| Configure app.config.yaml | MANIFEST_PATTERNS.md |
| Add error handling | ERROR_HANDLING.md |
| Use State Store or I/O Events | IO_EVENTS.md |
