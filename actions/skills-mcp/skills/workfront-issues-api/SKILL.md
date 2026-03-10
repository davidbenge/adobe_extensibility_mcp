---
name: workfront-issues-api
description: >
  Use for Workfront CRUD operations on Issues and Requests (OPTASK objects). Covers
  field names, severity codes, assignment patterns (user/team/role), status transitions,
  approval flows, and request queue queries. CRITICAL: objCode is OPTASK, not ISSUE.
  Trigger phrases: create issue, update issue, assign issue, request queue, OPTASK,
  issue status, issue severity, helpdesk, re-open issue, issue assignment, isHelpDesk.
  Do NOT use for Tasks (use workfront-tasks-api), Custom Form definitions
  (use workfront-forms-api), Projects (use workfront-projects-api), Documents
  (use workfront-documents-api), or Event Subscriptions (use workfront-events-api).
metadata:
  author: adobe-enterprise-architecture
  version: "1.0"
---

# Workfront Issues API

## Role
API specialist for Workfront Issue/Request (OPTASK) objects. Knows field names, severity codes, assignment patterns, status transitions, approval flows, and request queue query patterns.

## When to Load References

| Task | Load |
|------|------|
| Know issue/request field names, status codes | ISSUE_FIELDS.md |
| Assign issues to users, teams, or roles | ASSIGNMENTS.md |
| Handle issue status changes or approval flows | STATUS_TRANSITIONS.md |
| Build issue or request queue queries | QUERY_PATTERNS.md |
| Read/write custom form data on issues | CUSTOM_FORMS.md |

## Core Concepts

- **Base URL:** `https://<instance>.my.workfront.com/attask/api/v21.0/`
- **Auth:** `Authorization: Bearer <token>` (OAuth2 recommended)
- **Version:** Always specify `v21.0` explicitly in production
- **CRITICAL — objCode:** `OPTASK` (NOT "ISSUE"). Endpoint is `/issue` but objCode used in forms, subscriptions, and searches is always `OPTASK`
- **Write ops:** Include `sessionID` header for CSRF, or use OAuth2 Bearer token (covers CSRF)
- **Field selection:** `fields=*` or `fields=ID,name,status` to control response size
- **Pagination:** `$$FIRST=0&$$LIMIT=100` (max 2000 per request)
- **Filter modifiers:** append `_Mod=eq|ne|gt|gte|lt|lte|contains|in|cicontains` to field param
- **Request queues:** `isHelpDesk=true` to distinguish queue items from project issues

## Quick Reference

| Task | Reference |
|------|-----------|
| Know issue/request field names | ISSUE_FIELDS.md |
| Assign issues to users/teams | ASSIGNMENTS.md |
| Handle issue status changes | STATUS_TRANSITIONS.md |
| Build issue queue queries | QUERY_PATTERNS.md |
| Read/write custom form data on issues | CUSTOM_FORMS.md |
