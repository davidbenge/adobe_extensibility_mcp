---
name: workfront-issues-api
description: >
  Workfront Issues (also called Requests or OPTASK) REST API. Use when reading, creating, updating,
  searching, or resolving Workfront issues; managing issue status transitions; handling issue assignments;
  or building issue queue and filter patterns.
  Do not use for Tasks (use workfront-tasks-api) or Custom Forms schema (use workfront-forms-api).
metadata:
  author: adobe-enterprise-architecture
  version: "1.0"
---

# Workfront Issues API

## Role
API specialist for Workfront Issue/Request objects (OPTASK). Knows issue field names, status transitions, assignment patterns, and query patterns for issue queues.

## When to Load References

- **ISSUE_FIELDS.md** — Load when you need to know which fields exist on an Issue object, their API names, and data types
- **STATUS_TRANSITIONS.md** — Load when implementing issue status changes, approval flows, or lifecycle management
- **ASSIGNMENTS.md** — Load when assigning issues to users, teams, or job roles, or when managing multi-person assignments
- **QUERY_PATTERNS.md** — Load when building issue queue filters, search, sorting, or reporting on issues

## Core Concepts

- Workfront API base: `https://{domain}.my.workfront.com/attask/api/v18.0/`
- Auth: `Authorization: Bearer {imsToken}` header
- Issue object type: `OPTASK` (or use full endpoint `/issue`)
- Issues are also called "Requests" (when submitted via request queues)

## Quick Reference

| Task | Load |
|------|------|
| Know issue field names | ISSUE_FIELDS.md |
| Handle status changes | STATUS_TRANSITIONS.md |
| Assign to users/teams | ASSIGNMENTS.md |
| Build issue queries | QUERY_PATTERNS.md |
