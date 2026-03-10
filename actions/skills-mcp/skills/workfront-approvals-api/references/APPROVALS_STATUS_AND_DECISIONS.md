# Workfront Approvals API — Status and Decisions

## Individual Decision Values

Each approver makes exactly one decision:

| Decision Value | Description |
|---------------|-------------|
| `APPROVED` | Document is ready as-is |
| `APPROVED_WITH_CHANGES` | Document is ready once specified changes are made |
| `NEEDS_WORK` | Document needs changes and is NOT ready |
| `null` / pending | Approver has not yet decided |

**Note:** `APPROVED_WITH_CHANGES` is NOT available when using the Frame.io integration — only `APPROVED` and `NEEDS_WORK` are supported there.

Reviewers do not make a binding decision — their participation is tracked but does not affect overall status.

## Overall Approval Status Values

The overall status rolls up from all participant decisions:

| Status | Condition |
|--------|-----------|
| `PENDING_REVIEW` | Participants notified but no one has opened the asset yet |
| `IN_REVIEW` | At least one reviewer has viewed the asset; review incomplete; no approvers assigned |
| `REVIEWED` | All reviewers have completed their review; no approvers assigned |
| `NEEDS_WORK` | All reviews/approvals complete; at least one approver decided `NEEDS_WORK` |
| `APPROVED_WITH_CHANGES` | All complete; at least one approver decided `APPROVED_WITH_CHANGES` (no `NEEDS_WORK`) |
| `APPROVED` | All approvers decided `APPROVED` |

## Decision Priority / Rollup Logic

When multiple approvers have decided, the "worst" decision wins:

```
NEEDS_WORK  >  APPROVED_WITH_CHANGES  >  APPROVED
```

- If any approver says `NEEDS_WORK` → overall status is `NEEDS_WORK`
- If no `NEEDS_WORK` but any `APPROVED_WITH_CHANGES` → overall is `APPROVED_WITH_CHANGES`
- Only if ALL approvers say `APPROVED` → overall is `APPROVED`

## Status Transitions

```
(approval created)
        ↓
PENDING_REVIEW  →  IN_REVIEW  →  REVIEWED        (reviewer-only path)
        ↓
IN_REVIEW  →  (approvers decide)
        ↓
NEEDS_WORK  |  APPROVED_WITH_CHANGES  |  APPROVED
```

After `NEEDS_WORK`: a new document version is typically uploaded and a new approval started on that version.

## Reading Approval Status

```javascript
async function getApprovalStatus(approvalId, token) {
    const res = await fetch(
        `<baseURL>/document-approvals/${approvalId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
    )
    const approval = await res.json()
    return {
        overallStatus: approval.status,       // e.g. "APPROVED_WITH_CHANGES"
        stages: approval.stages?.map(s => ({
            stageId: s.ID,
            deadline: s.deadline,
            participants: s.participants?.map(p => ({
                name: p.participantUser?.name || p.participantTeam?.name,
                isApprover: p.isApprover,
                decision: p.decision,          // null if pending
                decisionDate: p.decisionDate
            }))
        }))
    }
}
```

## Listening for Decision Changes via Event Subscriptions

To react to approval decisions programmatically, combine with the Event Subscriptions API (`workfront-events-api`):

```javascript
// Subscribe to Document Approval UPDATE events
{
    "objCode": "DOCU",         // document changes trigger when approval status updates
    "eventType": "UPDATE",
    "url": "https://your-webhook.example.com/approval-handler",
    "authToken": "your-secret",
    "filters": [
        { "fieldName": "approvalStatus", "operator": "changed" }
    ]
}
```

## Reporting on Approvals

Use Canvas Dashboards (beta) for Unified Approvals reporting — standard Workfront reports do NOT support Unified Approvals data.

Key reportable objects:
- `Document Approval` — Status, linked Document Version
- `Approval Stage` — Deadline
- `Approval Stage Participant` — Decision Date, Participant User/Team, Requester, Created At

Date filter syntax: `$$TODAY`, `$$TODAY-2w` (relative date operators supported)
