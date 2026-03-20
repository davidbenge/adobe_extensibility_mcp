# Universal Approval Service — Status and Decisions

```javascript
const UAS_BASE = 'https://workfront.adobe.io/unified-approvals/public/api/v1/approvals'

function uasHeaders(token, apiKey, subdomain) {
    return {
        'Authorization': `Bearer ${token}`,
        'x-gw-subdomain': subdomain,
        'x-api-key': apiKey,
        'x-request-id': crypto.randomUUID(),
        'Content-Type': 'application/json'
    }
}
```

## Decision Values (Request Body)

When submitting a decision via the API, use these exact lowercase string values:

| Value | Description |
|-------|-------------|
| `"approved"` | Document is ready as-is |
| `"approved with changes"` | Document is ready once specified changes are made |
| `"needs work"` | Document needs changes and is NOT ready |
| `"reviewed"` | Reviewer has completed their review (reviewer-only; no binding decision) |

> **Note:** `"approved with changes"` is NOT available when using the Frame.io integration — only `"approved"` and `"needs work"` are supported there.

## Overall Approval Status Values

The `status` field on the approval object uses lowercase with spaces:

| Status | Condition |
|--------|-----------|
| `"pending review"` | Participants notified; no one has opened the asset yet |
| `"in review"` | At least one participant has viewed the asset; review incomplete |
| `"reviewed"` | All reviewers have completed their review; no approvers assigned |
| `"needs work"` | At least one approver decided `"needs work"` |
| `"approved with changes"` | At least one approver decided `"approved with changes"` (no `"needs work"`) |
| `"approved"` | All approvers decided `"approved"` |

## Decision Priority / Rollup Logic

When multiple approvers have decided, the "worst" decision wins:

```
"needs work"  >  "approved with changes"  >  "approved"
```

- If any approver says `"needs work"` → overall status is `"needs work"`
- If no `"needs work"` but any `"approved with changes"` → overall is `"approved with changes"`
- Only if ALL approvers say `"approved"` → overall is `"approved"`

## Status Transition Flow

```
(approval created)
        ↓
"pending review"  →  "in review"  →  "reviewed"     (reviewer-only path, no approvers)
        ↓
"in review"  →  (approvers decide)
        ↓
"needs work"  |  "approved with changes"  |  "approved"
```

After `"needs work"`: upload a new document version and create a new approval on that version.

## Reading Approval Status

```javascript
async function getApprovalStatus(documentVersionId, token, apiKey, subdomain) {
    const res = await fetch(
        `${UAS_BASE}/DOCV/${documentVersionId}`,
        { headers: uasHeaders(token, apiKey, subdomain) }
    )
    const approval = await res.json()
    return {
        overallStatus: approval.status,
        isLocked: approval.isLocked,
        decisionDate: approval.decisionDate,
        stages: approval.stages
    }
}
```

## Making a Decision

Submits or updates a decision for the authenticated participant. Overall stage and approval status will be updated based on the decision and other participants. Returns an error if the approval is not found or if the participant is not allowed.

```javascript
async function makeDecision({ documentVersionId, decision }, token, apiKey, subdomain) {
    // decision: "approved" | "approved with changes" | "needs work" | "reviewed"
    const res = await fetch(
        `${UAS_BASE}/DOCV/${documentVersionId}/decisions`,
        {
            method: 'PUT',
            headers: uasHeaders(token, apiKey, subdomain),
            body: JSON.stringify({ decision })
        }
    )
    return res.json()
}
```

Request body example:
```json
{ "decision": "needs work" }
```

## Listening for Decision Changes via Event Subscriptions

To react to approval decisions programmatically, combine with the Event Subscriptions API (`workfront-events-api`):

```javascript
{
    "objCode": "DOCU",
    "eventType": "UPDATE",
    "url": "https://your-webhook.example.com/approval-handler",
    "authToken": "your-secret",
    "filters": [
        { "fieldName": "approvalStatus", "operator": "changed" }
    ]
}
```

## Reporting on Approvals

Use **Canvas Dashboards** for Unified Approvals reporting — standard Workfront reports do NOT support UAS data.

Key reportable objects:
- `Document Approval` — status, linked document version
- `Approval Stage` — deadline
- `Approval Stage Participant` — decision date, participant user/team, requester, created at

Date filter syntax: `$$TODAY`, `$$TODAY-2w` (relative date operators supported)
