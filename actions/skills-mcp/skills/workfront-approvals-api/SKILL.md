---
name: workfront-approvals-api
description: >
  Use for Workfront Unified Approvals: creating and managing document/asset review
  and approval workflows, adding reviewers and approvers, tracking approval status
  and individual decisions, setting deadlines, using approval templates, and
  understanding the approval status model. Also covers legacy approval process
  actions (approveApproval, recallApproval, rejectApproval) on work items.
  Trigger phrases: approval workflow, document approval, add reviewer, add approver,
  approval status, approval decision, approve document, needs work, unified approvals,
  approval template, approval deadline, review asset, approval stage.
  Do NOT use for proofing workflows (separate Workfront Proof API) or
  Event Subscriptions (use workfront-events-api).
metadata:
  author: adobe-enterprise-architecture
  version: "1.0"
---

# Workfront Approvals API

## Role
Specialist for Workfront Unified Approvals — the document and asset review/approval system. Knows the approval status model, participant roles, decision values, template usage, reporting structure, and how the Unified Approvals API differs from both legacy approvals and proofing.

## When to Load References

| Task | Load |
|------|------|
| Understand the approval system, objects, and auth | APPROVALS_OVERVIEW.md |
| Add reviewers/approvers, manage participants | APPROVALS_PARTICIPANTS.md |
| Read or interpret approval status and decisions | APPROVALS_STATUS_AND_DECISIONS.md |
| Create/use templates, set deadlines, multi-stage | APPROVALS_TEMPLATES_AND_STAGES.md |

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

- **Unified Approvals** is a separate API from the standard Workfront REST API — different base URL and auth model
- **Two participant roles:** Reviewers (feedback only) vs. Approvers (binding decisions required)
- **Status is calculated** — overall approval status rolls up from all participant decisions; highest-priority "worst" decision wins
- **Not proofing:** Unified Approvals participants appear in the Document Summary pane, NOT the proofing workflow tab; SOCD data is proofing-only
- **Frame.io integration:** "Approved with changes" decision is NOT supported in the Frame.io integration
- **Auth:** Adobe IMS OAuth 2.0 Server-to-Server via Adobe Developer Console (technical account auto-created in Workfront)

## Quick Reference

| Task | Load |
|------|------|
| API overview, objects, base URL, auth | APPROVALS_OVERVIEW.md |
| Add/remove reviewers and approvers | APPROVALS_PARTICIPANTS.md |
| Approval status values and decision rollup | APPROVALS_STATUS_AND_DECISIONS.md |
| Templates, deadlines, approval stages | APPROVALS_TEMPLATES_AND_STAGES.md |
