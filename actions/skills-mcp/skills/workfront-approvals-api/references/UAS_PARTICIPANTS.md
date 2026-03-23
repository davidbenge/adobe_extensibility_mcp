# Universal Approval Service — Participants

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

## Two Participant Roles

| Role | Can Comment | Can Mark Up | Must Decide | Decision Affects Status |
|------|-------------|-------------|-------------|------------------------|
| **Reviewer** | Yes | Yes | No (optional) | No |
| **Approver** | Yes | Yes | Yes (required) | Yes |

## Add or Update Participants

Adds new participants to an approval. You can also update an existing participant's role by passing the same `participantId` again with their new role.

The request body is an **array** of objects, each containing a `stageId` and a `participants` array:

```javascript
async function addParticipants({ documentVersionId, stageId, participants }, token, apiKey, subdomain) {
    // participants: [{ participantId, role }, ...]
    const res = await fetch(
        `${UAS_BASE}/DOCV/${documentVersionId}/participants`,
        {
            method: 'PUT',
            headers: uasHeaders(token, apiKey, subdomain),
            body: JSON.stringify([
                {
                    stageId,
                    participants   // non-empty array of AddParticipantBody objects
                }
            ])
        }
    )
    return res.json()
}
```

Request body example:
```json
[
    {
        "stageId": "design-review",
        "participants": [...]
    }
]
```

## Remove Participants

Removes requested participants from an approval. Removing the last participant will result in the approval being deleted.

```javascript
async function removeParticipants({ documentVersionId, stageId, participants }, token, apiKey, subdomain) {
    const res = await fetch(
        `${UAS_BASE}/DOCV/${documentVersionId}/participants`,
        {
            method: 'DELETE',
            headers: uasHeaders(token, apiKey, subdomain),
            body: JSON.stringify({
                stageId,
                participants   // non-empty array of participant objects to remove
            })
        }
    )
    return res.json()
}
```

## View Participants on an Approval

Participants are returned as part of the approval object:

```javascript
async function getApprovalParticipants(documentVersionId, token, apiKey, subdomain) {
    const res = await fetch(
        `${UAS_BASE}/DOCV/${documentVersionId}`,
        { headers: uasHeaders(token, apiKey, subdomain) }
    )
    const approval = await res.json()
    return approval.stages?.flatMap(s => s.participants) ?? []
}
```

## Access Requirements

| Action | Required Access |
|--------|----------------|
| Add reviewer/approver | Contributor license or higher; View access to the parent object |
| Remove participant | Same user who added them, or Manage permissions on the document |
| Frame.io integration | Standard license required |

> **Technical account note:** When authenticating as a technical account, you can only act as that account. If the technical account is not a participant on the approval, API calls that require participant status (e.g. making a decision) will return a 404.

## UI Location

Unified Approval participants appear in the **Document Summary pane → Approvals section**.
They do NOT appear in the proofing workflow tab. SOCD data (Sent/Opened/Comment/Decision) in the document list is proofing-specific and does not reflect UAS decisions.
