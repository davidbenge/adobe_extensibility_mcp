---
name: workfront-tasks-api
description: >
  Workfront Tasks REST API (Attask/API). Use when reading, creating, updating, or searching
  Workfront tasks, working with task custom form data, performing bulk task operations,
  or building query patterns for task lists and filters.
  Do not use for Workfront Issues (use workfront-issues-api) or Custom Forms schema (use workfront-forms-api).
metadata:
  author: adobe-enterprise-architecture
  version: "1.0"
---

# Workfront Tasks API

## Role
API specialist for Workfront Task objects. Knows field names, search syntax, bulk operations, and custom form data access patterns.

## When to Load References

- **TASK_FIELDS.md** — Load when you need to know which fields exist on a Task object, their API names, and data types
- **BULK_OPERATIONS.md** — Load when performing batch updates, bulk status changes, or multi-task operations
- **CUSTOM_FORMS.md** — Load when reading or writing task custom form data (parameterValues)
- **QUERY_PATTERNS.md** — Load when building task search filters, sorting, pagination, or reporting queries

## Core Concepts

- Workfront API base: `https://{domain}.my.workfront.com/attask/api/v18.0/`
- Auth: `Authorization: Bearer {imsToken}` header
- Task object type: `TASK` (or use full endpoint `/task`)
- Field selection via `fields` param: `?fields=name,status,assignedTo:name`

## Quick Reference

| Task | Load |
|------|------|
| Know task field names | TASK_FIELDS.md |
| Batch update tasks | BULK_OPERATIONS.md |
| Read/write custom form data | CUSTOM_FORMS.md |
| Build complex queries | QUERY_PATTERNS.md |
