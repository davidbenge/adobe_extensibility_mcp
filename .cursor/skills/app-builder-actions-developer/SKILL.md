---
name: app-builder-actions-developer
description: Use when designing App Builder actions (OpenWhisk microservices), APIs, action structure, service logic, or I/O runtime. Knows dx-excshell-1 (unified/experience shell) extension point, and Adobe I/O Runtime.
---

# App Builder Actions Developer Skill

## When to Use This Skill

Use this skill when:
- During implementation planning (/dev-start-implementation-plan), when the story or tasks involve backend, actions, or APIs
- Designing or implementing App Builder actions (OpenWhisk serverless functions)
- Defining or changing action APIs, request/response contracts, or integration patterns
- Working on actions, APIs, and serverless functions for App Builder apps as defined in this skill's references
- Debugging or refactoring action structure, error handling, or service logic

**Do NOT use this skill when:**
- Working only on App Builder frontend (use app-builder-frontend-developer) or DB schema (use graph-db-specialist)
- Implementing App Builder MCP servers (use app-builder-mcp-developer)
- If this project is not an Adobe App Builder project, do not use this skill

## Role Boundary

**Does**: Write backend section of task-plans. API design, App Builder action structure, integration patterns, error handling. Knows application points and directory signatures from [references/application-points.md](references/application-points.md).

**Does NOT**: Own story-level task breakdown (Architect + Dev Lead); write frontend or DB migrations; implement MCP servers (use app-builder-mcp-developer for that).

## References

- **Basic usage**: Load constitution and impl-log; scan backend log; read other specialist sections; write the Backend Specialist section.
- **Platform & concepts**: See [references/platform.md](references/platform.md)
- **Solution patterns**: See [references/solution-patterns.md](references/solution-patterns.md)
- **Application points**: See [references/application-points.md](references/application-points.md)
- **OpenWhisk manifest reference**: See [OpenWhisk manifest spec](https://github.com/apache/openwhisk-wskdeploy/blob/master/specification/html/spec_actions.md)
- **Constitution**: `docs/design-principles/backend.md`
- **System state**: `docs/impl-log/backend/index.md`, `docs/impl-log/backend/log.md`

## Instructions

1. Load and read: this skill's references (platform, solution-patterns, application-points as needed), `docs/design-principles/backend.md`, and `docs/impl-log/backend/index.md`.
2. Scan `docs/impl-log/backend/log.md` entry headers for entries related to the current task; if a relevant entry exists and links to archived detail, load the linked artifact for context.
3. Read other completed specialist sections first (DB section for schema and action–DB interfaces; frontend if present for API contract alignment).
4. Write the Backend Specialist section: App Builder actions, APIs, application points, and OpenWhisk patterns. Follow design-principles and impl-log conventions.

## Output Contract

Backend section in task-plan; impl-log/backend entries on completion.
