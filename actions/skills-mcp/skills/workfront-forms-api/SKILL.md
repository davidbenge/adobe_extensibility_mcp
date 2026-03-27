---
name: workfront-forms-api
description: >
  Use for Workfront Custom Forms — reading form definitions, inspecting parameter
  configurations, and reading/writing parameterValues on any object type. Custom forms
  apply to Tasks, Issues, Projects, Users, Portfolios, Programs, and more. In the API,
  forms are "Categories" and fields are "Parameters". Trigger phrases: custom form,
  parameterValues, Category object, Parameter object, DE: prefix, form fields,
  form structure, catObjCode, form definition, attach form, detach form,
  custom field value, form schema.
  Do NOT use for Task CRUD (use workfront-tasks-api), Issue CRUD (use workfront-issues-api),
  Projects (use workfront-projects-api), Documents (use workfront-documents-api),
  or Event Subscriptions (use workfront-events-api).
metadata:
  author: adobe-enterprise-architecture
  version: "1.0"
---

# Workfront Custom Forms API

## Role
API specialist for Workfront Custom Forms (Category/Parameter objects). Applies to ALL object types — Tasks, Issues/Requests, Projects, Users, Portfolios, Programs, and more. Knows form structure, Category fields, Parameter configurations, and parameterValues read/write patterns.

## When to Load References

| Task | Load |
|------|------|
| Understand form structure and hierarchy | FORM_STRUCTURE.md |
| List forms, attach/detach, inspect Category fields | CATEGORY_OBJECT.md |
| Inspect Parameter definitions and display types | PARAMETER_FIELDS.md |
| Read or write parameterValues on any object | PARAMETER_VALUES.md |

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
- **Category = Custom Form** — `category` endpoint, not `form`
- **Parameter = Custom Field** — individual fields within a form
- **parameterValues:** available on ANY object with a custom form attached; key format is `DE:{field label}`
- **Object scope:** Custom forms apply to TASK, OPTASK, PROJ, USER, PORT, PRGM, and other types — not just tasks/issues
- **Pagination:** `$$FIRST=0&$$LIMIT=100` (max 2000 per request)

## Quick Reference

| Task | Reference |
|------|-----------|
| Understand form/section/field hierarchy | FORM_STRUCTURE.md |
| List or attach forms (Category object) | CATEGORY_OBJECT.md |
| Inspect parameter definitions | PARAMETER_FIELDS.md |
| Read/write form values on objects | PARAMETER_VALUES.md |
