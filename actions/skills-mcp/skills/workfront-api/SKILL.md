---
name: workfront-api
description: >
  Use for Workfront CRUD operations on Tasks (TASK), Issues/Requests (OPTASK),
  and Custom Forms (Category/Parameter objects). Handles field reads, writes,
  bulk updates, assignments, status transitions, and form data. Trigger phrases:
  create task, update issue, read custom form, parameterValues, bulk update tasks,
  assign issue, task status, OPTASK, request queue, form fields, DE: prefix.
  Do NOT use for Projects (use workfront-projects-api), Documents (use workfront-documents-api),
  or Event Subscriptions (use workfront-events-api).
metadata:
  author: adobe-enterprise-architecture
  version: "1.0"
---

# Workfront API

## Role
API specialist for Workfront Task (TASK), Issue/Request (OPTASK), and Custom Form (Category/Parameter) objects. Knows field names, status codes, bulk operations, assignment patterns, status transitions, and custom form data access.

## Sub-Areas

### Tasks (TASK)
Create, read, update, delete, and search Workfront tasks. Covers field names, assignment fields, hierarchy (parent/subtask), bulk operations, and custom form data on tasks.

- **TASKS_FIELDS.md** — Core, assignment, and hierarchy field names; status codes; field selection examples
- **TASKS_BULK_OPERATIONS.md** — Bulk update patterns, batch PUT, rate limit guidance
- **TASKS_CUSTOM_FORMS.md** — Reading/writing custom form data on tasks, parameterValues
- **TASKS_QUERY_PATTERNS.md** — Search, filter, sort, and pagination patterns for tasks

### Issues / Requests (OPTASK)
Create, read, update, and search Workfront issues and request queue items. objCode is `OPTASK` — never use "ISSUE". Covers field names, severity, assignment, status transitions, and queue patterns.

- **ISSUES_FIELDS.md** — OPTASK field names, status codes, severity codes
- **ISSUES_ASSIGNMENTS.md** — User, team, and role assignment patterns; multi-assign; reassign
- **ISSUES_STATUS_TRANSITIONS.md** — Status transition flows, approval flows, status validation
- **ISSUES_QUERY_PATTERNS.md** — Search, filter, sort patterns for issues and request queues

### Custom Forms (Category / Parameter)
Read form definitions, inspect parameter configurations, read/write parameterValues on any Workfront object. Custom forms are called "Categories" in the API; fields are "Parameters".

- **FORMS_STRUCTURE.md** — Category object, form-to-object attachment, form listing
- **FORMS_CATEGORY_OBJECT.md** — Category fields, catObjCode, object type mapping, creating forms
- **FORMS_PARAMETER_FIELDS.md** — Parameter field types, configurations, displayType values
- **FORMS_PARAMETER_VALUES.md** — Reading/writing parameterValues on objects

## Shared Concepts

- **Base URL:** `https://<instance>.my.workfront.com/attask/api/v21.0/`
- **Auth:** `Authorization: Bearer <token>` (OAuth2 recommended)
- **Version:** Always specify `v21.0` explicitly in production
- **CRITICAL — objCode for Issues:** `OPTASK` (NOT "ISSUE"). Endpoint: `/issue` but objCode is `OPTASK`
- **Write ops:** Include `sessionID` header for CSRF, or use OAuth2 Bearer token (covers CSRF)
- **Field selection:** `fields=*` or `fields=ID,name,status` to control response size
- **Pagination:** `$$FIRST=0&$$LIMIT=100` (max 2000 per request)
- **Filter modifiers:** append `_Mod=eq|ne|gt|gte|lt|lte|contains|in|cicontains` to field param
- **Custom form values:** `DE:{field label}` key format in `parameterValues`

## Quick Reference

| Task | Load |
|------|------|
| Know task field names | TASKS_FIELDS.md |
| Batch update tasks | TASKS_BULK_OPERATIONS.md |
| Read/write custom form data on tasks | TASKS_CUSTOM_FORMS.md |
| Build complex task queries | TASKS_QUERY_PATTERNS.md |
| Know issue/request field names | ISSUES_FIELDS.md |
| Assign issues to users/teams | ISSUES_ASSIGNMENTS.md |
| Handle issue status changes | ISSUES_STATUS_TRANSITIONS.md |
| Build issue queue queries | ISSUES_QUERY_PATTERNS.md |
| Understand form structure | FORMS_STRUCTURE.md |
| List or attach forms | FORMS_CATEGORY_OBJECT.md |
| Inspect parameter definitions | FORMS_PARAMETER_FIELDS.md |
| Read/write form values on objects | FORMS_PARAMETER_VALUES.md |
