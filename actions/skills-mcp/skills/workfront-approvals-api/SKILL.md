---
name: workfront-approvals-api
description: >
  Use for Workfront Universal Approval Service (UAS): creating and managing document
  review and approval workflows, adding reviewers and approvers, tracking approval
  status and individual decisions, setting deadlines, using approval templates, and
  multi-stage approval sequences. The UAS applies to Document approvals only — NOT
  projects, tasks, or issues (those use the legacy work item approval system).
  Trigger phrases: approval workflow, document approval, add reviewer, add approver,
  approval status, approval decision, approve document, needs work, unified approvals,
  universal approval service, approval template, approval deadline, review asset,
  approval stage.
  Do NOT use for proofing workflows (separate Workfront Proof API),
  project/task/issue approvals (legacy system), or
  Event Subscriptions (use workfront-events-api).
metadata:
  author: adobe-enterprise-architecture
  version: "1.0"
---

# Workfront Approvals API

## Role
Specialist for the Workfront Universal Approval Service (UAS) — document-only review and approval workflows. Knows the UAS API structure, authentication requirements, approval status model, participant roles, decision values, template usage, and multi-stage workflows. The UAS is separate from both the standard Workfront REST API and the legacy work item approval system.

## When to Load References

### Universal Approval Service (Documents)

| Task | Load |
|------|------|
| Understand the UAS system, objects, auth, and scope | UNIVERSAL_APPROVAL_SERVICE_OVERVIEW.md |
| Create or update an approval, use templates, lock/unlock stages | UAS_TEMPLATES_AND_STAGES.md |
| Add or remove reviewers and approvers | UAS_PARTICIPANTS.md |
| Read or interpret approval status and decisions; make a decision | UAS_STATUS_AND_DECISIONS.md |

### Object Approvals (Projects, Tasks, Issues)

| Task | Load |
|------|------|
| Understand object approval workflows, supported objects, fields | OBJECT_APPROVALS_OVERVIEW.md |
| Approve, reject, or recall an approval on a project/task/issue | OBJECT_APPROVALS_ACTIONS.md |
| Find approval process IDs, attach processes, query approver status | OBJECT_APPROVALS_PROCESSES.md |

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

- **Documents only** — the UAS applies to Document Version (`DOCV`) approvals only; project/task/issue approvals use the legacy system
- **Separate API** — different base URL and auth model from the standard Workfront REST API (`/attask/api/`)
- **Two participant roles:** Reviewers (feedback only) vs. Approvers (binding decisions required)
- **Status is calculated** — overall approval status rolls up from all participant decisions; "worst" decision wins (`NEEDS_WORK` > `APPROVED_WITH_CHANGES` > `APPROVED`)
- **Version-specific** — each approval is tied to a specific document version; new version requires a new approval
- **Not proofing:** UAS participants appear in the Document Summary pane, NOT the proofing workflow tab; SOCD data is proofing-only
- **Frame.io integration:** `APPROVED_WITH_CHANGES` decision is NOT supported in the Frame.io integration
- **Auth:** Adobe IMS OAuth 2.0 Server-to-Server via Adobe Developer Console (technical account auto-created in Workfront)

## Quick Reference

**Document approvals (UAS):**

| Task | Load |
|------|------|
| UAS overview, objects, base URL, auth | UNIVERSAL_APPROVAL_SERVICE_OVERVIEW.md |
| Create or update an approval, templates, lock/unlock | UAS_TEMPLATES_AND_STAGES.md |
| Add/remove reviewers and approvers | UAS_PARTICIPANTS.md |
| Approval status values, decision rollup, make a decision | UAS_STATUS_AND_DECISIONS.md |

**Object approvals (projects/tasks/issues):**

| Task | Load |
|------|------|
| How object approvals work, supported objects | OBJECT_APPROVALS_OVERVIEW.md |
| approveApproval / rejectApproval / recallApproval actions | OBJECT_APPROVALS_ACTIONS.md |
| Approval process IDs, attach processes, approver status | OBJECT_APPROVALS_PROCESSES.md |
