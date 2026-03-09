# App Builder Actions — Platform & Concepts

> I/O Runtime, limits, deployment, and key concepts. For solution patterns (action template, async task, error handling), see [solution-patterns.md](solution-patterns.md).

---

## Platform

- **Adobe I/O Runtime** is built on **Apache OpenWhisk** (serverless, event-driven).
- Code is organized into **actions** (functions), **packages** (grouping), and **sequences** (linear chains).
- Deployed within **namespaces** (per tenant/org). Config (e.g. credentials) is passed via **params** from manifest/YAML, not `process.env` in action code.

### Runtime Limits

| Limit | Blocking (web) | Non-blocking |
|-------|----------------|--------------|
| **Timeout** | 60s default | Up to 3h (configurable in manifest) |
| **Memory** | 256MB default; 128MB–4GB range | Same |
| **Use for** | APIs, search, single ops | Ingestion, bulk work, migrations |

### Deployment

- **CLI**: `aio app deploy` packages and deploys to Adobe I/O Runtime.
- **Manifest**: Action timeouts and memory are set in `manifest.yml` (e.g. 60s vs 3h).
- **Params**: Required params (e.g. `NEO4J_URI`, `AZURE_OPENAI_*`) are injected from app config; actions receive them in `main(params)`.

### References

- [App Builder Runtime guides](https://developer.adobe.com/app-builder/docs/guides/runtime_guides/)
- [App Builder Architecture](https://developer.adobe.com/app-builder/docs/guides/app_builder_guides/architecture_overview/architecture-overview)

---

## Problem Space

### Domain Overview

Adobe App Builder runs on **Adobe I/O Runtime**, which is built on **Apache OpenWhisk**. Actions are serverless functions invoked via HTTP or events. Key characteristics:

- **Stateless**: Each invocation gets fresh params; no in-memory state between calls.
- **Time limits**: Default 1 minute; long-running work needs different strategies (e.g., State Store + polling).
- **Memory limits**: Default 256MB; configurable up to 2GB in `manifest.yml`.
- **Cold starts**: First request after idle can be slower; keep actions focused and dependencies minimal.
- **Params**: Input comes as `params` (body, query, headers in `__ow_headers`, path in `__ow_path`).

**This project's use of App Builder (Runtime scope):** See `docs/design-principles/architecture.md` — constitution defines what this project uses Runtime for (CRUD, auth, state, files, ingestion, retrieval).

### Key Concepts

| Concept | Description |
|--------|-------------|
| **Action** | Single exported `main(params)` async function; return `{ statusCode, body }` or `{ error: { statusCode, body } }`. |
| **IMS** | Adobe Identity Management System; tokens in `Authorization: Bearer <token>` or from `__ow_user` when using API Gateway. |
| **State Store** | Key-value store via `@adobe/aio-lib-state`; namespace per app; values are strings (often JSON). |
| **Files** | Blob storage via `@adobe/aio-lib-files`; path-based; used for diagram SVG and other binaries. |
| **Logger** | `Core.Logger('action-name', { level: params.LOG_LEVEL \|\| 'info' })` from `@adobe/aio-sdk`. |

### Common Challenges

1. **Auth in every action**: Extract and validate IMS token; handle 401/403 consistently.
2. **Input validation**: Params can be body (string or object), query, or path; normalize and validate early.
3. **Errors as responses**: OpenWhisk expects either a normal body or an `error` object; use a shared `errorResponse()` so clients get stable status codes and messages.
4. **Long-running work**: Avoid blocking the HTTP request; use State Store for progress and a separate "get status" action.
5. **External services**: Neo4j, Azure OpenAI, etc. are configured via params (or env); initialize once per invocation (e.g., Neo4j driver singleton from params).
6. **Idempotency and concurrency**: Use optimistic locking (e.g., `version` on diagram) and clear permission checks.
