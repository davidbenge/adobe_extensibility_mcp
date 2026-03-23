---
name: workfront-projects-api
description: >
  Use for Workfront Project (PROJ) operations: creating, reading, updating, searching
  projects; working with portfolios (PORT) and programs (PRGM); milestone paths (MPATH);
  project templates (TMPL); and project-level status, condition, and hierarchy.
  Trigger phrases: create project, update project, project status, portfolio, program,
  milestone path, project template, PROJ objCode, project condition, project hierarchy.
  Do NOT use for Tasks inside a project (use workfront-api).
metadata:
  author: adobe-enterprise-architecture
  version: "1.0"
---

# Workfront Projects API

## Role
API specialist for Workfront Project (PROJ) objects and the portfolio/program hierarchy. Knows project field names, status/condition codes, CRUD patterns, template usage, milestone paths, and portfolio→program→project relationships.

## When to Load References

| Task | Load |
|------|------|
| Know project field names and status codes | PROJECTS_FIELDS.md |
| Search, filter, or list projects | PROJECTS_QUERY_PATTERNS.md |
| Create, update, or delete projects | PROJECTS_CRUD.md |
| Work with portfolios, programs, or milestones | PROJECTS_HIERARCHY.md |
| Read/write custom form data on projects | CUSTOM_FORMS.md |

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

## Shared Concepts

- **Base URL:** `https://<workfront_host>/attask/api/v21.0/`
- **Auth:** `Authorization: Bearer <token>` (OAuth2 recommended)
- **Project objCode:** `PROJ`
- **Pagination:** `$$FIRST=0&$$LIMIT=100` (max 2000 per request)
- **Filter modifiers:** append `_Mod=eq|ne|gt|gte|lt|lte|contains|in` to field param
- **Status:** PLN (Planning), CUR (Current), CPL (Complete), DED (Dead)
- **Condition:** conditionType can be `manual` or `auto`; when manual, set `condition` field directly

