# Universal Approval Service — Templates and Stages

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

> **Single-stage only:** The UAS public API endpoints only support single-stage approvals. Multi-stage approvals are not supported via the API.

## Approval Templates

Templates define a reusable approval configuration (participants, roles, deadlines) that can be applied when creating new approvals — saving setup time for recurring workflows.

Standard license users and above can create approval templates. Templates are configured in the Workfront UI.

> **No API to list templates:** There is currently no endpoint to retrieve a list of template IDs. The `templateID` must be known in advance and supplied by the user.

### Apply a Template When Creating an Approval

When using a template, supply both `templateID` and the full `stages` configuration. The template pre-populates defaults, but the stage structure must still be provided in the request body.

```javascript
async function createApprovalFromTemplate({ documentVersionId, templateID, stages }, token, apiKey, subdomain) {
    const res = await fetch(
        `${UAS_BASE}/DOCV/${documentVersionId}/stages`,
        {
            method: 'PUT',
            headers: uasHeaders(token, apiKey, subdomain),
            body: JSON.stringify({ templateID, stages })
        }
    )
    return res.json()
}
```

Request body example:
```json
{
    "templateID": "65a86af23f71808d4583be0a",
    "stages": [
        {
            "name": "Marketing stage",
            "stageMetadata": {
                "property1": "string",
                "property2": "string"
            },
            "deadlineDate": "2024-11-25T22:48:13.598Z",
            "participants": [
                {
                    "participantId": "59281F01631245820A49421E@0000000000000000000000.e",
                    "participantType": "USER",
                    "participantRole": "approver",
                    "participantMetadata": {}
                }
            ],
            "config": {
                "autoLockEnabled": true
            }
        }
    ]
}
```

## Creating an Approval Without a Template

Omit `templateID` and provide the full stage configuration directly:

```javascript
async function createApproval({ documentVersionId, stages }, token, apiKey, subdomain) {
    const res = await fetch(
        `${UAS_BASE}/DOCV/${documentVersionId}/stages`,
        {
            method: 'PUT',
            headers: uasHeaders(token, apiKey, subdomain),
            body: JSON.stringify({ stages })
        }
    )
    return res.json()
}
```

Request body example:
```json
{
    "stages": [
        {
            "name": "Design Review",
            "deadlineDate": "2024-11-25T22:48:13.598Z",
            "participants": [
                {
                    "participantId": "59281F01631245820A49421E@0000000000000000000000.e",
                    "participantType": "USER",
                    "participantRole": "approver",
                    "participantMetadata": {}
                }
            ],
            "config": {
                "autoLockEnabled": true
            }
        }
    ]
}
```

## Stage Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name for the stage |
| `stageMetadata` | object | Arbitrary key/value metadata for the stage |
| `deadlineDate` | datetime | ISO 8601 deadline for this stage |
| `participants` | array | List of participants (see below) |
| `config.autoLockEnabled` | boolean | If `true`, stage auto-locks when all participants have decided |

## Participant Fields (within a stage)

| Field | Type | Description |
|-------|------|-------------|
| `participantId` | string | IMS user ID of the participant |
| `participantType` | string | `"USER"` or `"TEAM"` |
| `participantRole` | string | `"approver"` (binding decision) or `"reviewer"` (feedback only) |
| `participantMetadata` | object | Arbitrary key/value metadata for the participant |

## Lock a Stage

Locks the requested stage of the approval. When a stage is locked, participants cannot make a decision on it. Participants cannot be added or removed.

```javascript
async function lockStage({ documentVersionId, stageId }, token, apiKey, subdomain) {
    const res = await fetch(
        `${UAS_BASE}/DOCV/${documentVersionId}/stages/${stageId}/lock`,
        {
            method: 'PUT',
            headers: uasHeaders(token, apiKey, subdomain)
        }
    )
    return res.json()
}
```

## Unlock a Stage

Unlocks the requested stage. Participants will be able to make a decision on the stage again. Participants can be added or removed from the approval.

```javascript
async function unlockStage({ documentVersionId, stageId }, token, apiKey, subdomain) {
    const res = await fetch(
        `${UAS_BASE}/DOCV/${documentVersionId}/stages/${stageId}/unlock`,
        {
            method: 'PUT',
            headers: uasHeaders(token, apiKey, subdomain)
        }
    )
    return res.json()
}
```

## Workfront Home Widgets

Unified Approvals surfaces KPIs in the Workfront Home area (read-only UI — no API equivalent):
- Pending approvals count
- Overdue approvals count
- Average approval duration
- Approvals by decision (Approved / Needs Work / etc.)

Use Canvas Dashboards for programmatic reporting.

## AI Reviewer

Workfront includes an AI Reviewer that can automate brand compliance checks as part of an approval workflow. It is added as a participant (like a user) and makes automated decisions. Configuration is done in the Workfront UI — there is no direct API for configuring the AI Reviewer.
