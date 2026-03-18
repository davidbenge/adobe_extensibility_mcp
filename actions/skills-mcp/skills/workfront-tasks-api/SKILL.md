---
name: workfront-tasks-api
description: >
  Use for Workfront CRUD operations on Tasks (TASK objects). Covers task field names,
  status codes, assignment fields, hierarchy (parent/subtask), bulk operations,
  custom form data on tasks, and search/filter/sort patterns. Trigger phrases:
  create task, update task, delete task, bulk update tasks, task status, task fields,
  task hierarchy, subtasks, parentID, task assignment, plannedStartDate, percentComplete.
  Do NOT use for Issues/Requests (use workfront-issues-api), Custom Form definitions
  (use workfront-forms-api), Projects (use workfront-projects-api), Documents
  (use workfront-documents-api), or Event Subscriptions (use workfront-events-api).
metadata:
  author: adobe-enterprise-architecture
  version: "1.0"
---

# Workfront Tasks API

## Role
API specialist for Workfront Task (TASK) objects. Knows field names, status codes, bulk operations, assignment patterns, hierarchy (parent/subtask), and custom form data access on tasks.

## When to Load References

| Task | Load |
|------|------|
| Know task field names, status codes | TASK_FIELDS.md |
| Batch update or batch create tasks | BULK_OPERATIONS.md |
| Read/write custom form data on tasks | CUSTOM_FORMS.md |
| Build complex task queries | QUERY_PATTERNS.md |

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

- **Base URL:** `https://<instance>.my.workfront.com/attask/api/v21.0/`
- **Auth:** `Authorization: Bearer <token>` (OAuth2 recommended)
- **Version:** Always specify `v21.0` explicitly in production
- **objCode:** `TASK` — endpoint is `/task`
- **Write ops:** Include `sessionID` header for CSRF, or use OAuth2 Bearer token (covers CSRF)
- **Field selection:** `fields=*` or `fields=ID,name,status` to control response size
- **Pagination:** `$$FIRST=0&$$LIMIT=100` (max 2000 per request)
- **Filter modifiers:** append `_Mod=eq|ne|gt|gte|lt|lte|contains|in|cicontains` to field param
- **Custom form values:** `DE:{field label}` key format in `parameterValues`

## Quick Reference

| Task | Reference |
|------|-----------|
| Know task field names | TASK_FIELDS.md |
| Batch update tasks | BULK_OPERATIONS.md |
| Read/write custom form data on tasks | CUSTOM_FORMS.md |
| Build complex task queries | QUERY_PATTERNS.md |
