# Workfront Approvals API — Participants

## Two Participant Roles

| Role | Can Comment | Can Mark Up | Must Decide | Decision Affects Status |
|------|-------------|-------------|-------------|------------------------|
| **Reviewer** | Yes | Yes | No (optional) | No |
| **Approver** | Yes | Yes | Yes (required) | Yes |

Marking a review complete is optional for reviewers. Approvers must make an explicit decision before the approval can advance.

## Adding Reviewers vs. Approvers

In the Unified Approvals API, the role is determined by a boolean flag on the participant:
- `isApprover: true` → Approver (binding decision required)
- `isApprover: false` (or omitted) → Reviewer (feedback only)

## Adding a Participant to a Document Approval

```javascript
// Add an approver to a document approval stage
async function addApprover({ approvalId, stageId, userId }, token) {
    const res = await fetch(
        `<baseURL>/approval-stages/${stageId}/participants`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                participantUserID: userId,
                isApprover: true
            })
        }
    )
    return res.json()
}

// Add a reviewer (non-binding)
async function addReviewer({ stageId, userId }, token) {
    const res = await fetch(
        `<baseURL>/approval-stages/${stageId}/participants`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                participantUserID: userId,
                isApprover: false
            })
        }
    )
    return res.json()
}
```

## Adding a Team as Approver/Reviewer

Teams can be added as collective participants — any team member can fulfill the role:

```javascript
async function addTeamParticipant({ stageId, teamId, isApprover }, token) {
    const res = await fetch(
        `<baseURL>/approval-stages/${stageId}/participants`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                participantTeamID: teamId,
                isApprover
            })
        }
    )
    return res.json()
}
```

## Approval Stage Participant Fields

| Field | Type | Description |
|-------|------|-------------|
| `ID` | string | Participant record ID |
| `participantUserID` | string | Workfront user ID (if user participant) |
| `participantTeamID` | string | Team ID (if team participant) |
| `participantUser` | object | Expanded user object |
| `participantTeam` | object | Expanded team object |
| `isApprover` | boolean | `true` = Approver; `false` = Reviewer |
| `decision` | string | Current decision: `APPROVED`, `APPROVED_WITH_CHANGES`, `NEEDS_WORK`, or `null` |
| `decisionDate` | datetime | When the decision was made |
| `requester` | object | User who added this participant |
| `createdAt` | datetime | When participant was added |

## Viewing Participants on an Approval

```javascript
async function getApprovalParticipants(approvalId, token) {
    const res = await fetch(
        `<baseURL>/document-approvals/${approvalId}/approval-stages`,
        { headers: { 'Authorization': `Bearer ${token}` } }
    )
    const { stages } = await res.json()
    return stages.flatMap(s => s.participants)
}
```

## Where Participants Appear in the UI

Unified Approvals participants are shown in the **Document Summary pane** → Approvals section.
They do NOT appear in the proofing workflow tab.
SOCD (Sent/Opened/Comment/Decision) data in the document list is proofing-specific — it does not reflect Unified Approval decisions.

## Access Requirements

- **Add reviewer/approver:** Contributor license or higher; View access to the parent object
- **Frame.io integration:** Standard license required
- **Remove participant:** Same user who added them, or user with Manage permissions on the document
