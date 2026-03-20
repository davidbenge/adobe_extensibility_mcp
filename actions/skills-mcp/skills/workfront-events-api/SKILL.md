---
name: workfront-events-api
description: >
  Use for Workfront Event Subscriptions: setting up webhook push notifications
  for object changes (CREATE, UPDATE, DELETE) on any Workfront object. Covers
  subscription creation, event payload structure, filtering, auth verification,
  retry handling, and subscription lifecycle management. Trigger phrases:
  event subscription, webhook, push notification, object change notification,
  subscribe to events, event payload, authToken, eventsubscription API.
  This is a push/webhook paradigm — NOT a polling or CRUD skill.
metadata:
  author: adobe-enterprise-architecture
  version: "1.0"
---

# Workfront Events API

## Role
Specialist for Workfront Event Subscriptions — the push/webhook notification system. Knows how to create, filter, and manage subscriptions; how to handle incoming event payloads; and how to build reliable webhook handlers.

## When to Load References

| Task | Load |
|------|------|
| Create, list, or delete a subscription | EVENTS_SUBSCRIPTION_SETUP.md |
| Understand the event payload format | EVENTS_PAYLOAD_STRUCTURE.md |
| Filter subscriptions by object field changes | EVENTS_FILTERING.md |
| Handle auth, TLS, retries, idempotency | EVENTS_RELIABILITY.md |

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

- **Different endpoint:** Event Subscriptions use a different base URL:
  `https://<workfront_host>/attask/eventsubscription/api/v1/subscriptions`
  (NOT the standard REST API endpoint)
- **Push, not poll:** Workfront pushes payloads to your webhook URL on object change
- **5-second rule:** Your webhook handler MUST respond within 5 seconds — do all heavy processing async
- **authToken verification:** Always verify the `Authorization` header on incoming webhooks equals your configured `authToken`
- **Supported objCodes:** PROJ, TASK, OPTASK, DOCU, ASSGN, PORT, PRGM, USER, NOTE, HOUR, TMPL

## Quick Reference

| Task | Load |
|------|------|
| Create/list/delete subscription | EVENTS_SUBSCRIPTION_SETUP.md |
| Parse CREATE/UPDATE/DELETE payload | EVENTS_PAYLOAD_STRUCTURE.md |
| Filter events by field value or change | EVENTS_FILTERING.md |
| Auth verification, TLS, retries, disabled state | EVENTS_RELIABILITY.md |
