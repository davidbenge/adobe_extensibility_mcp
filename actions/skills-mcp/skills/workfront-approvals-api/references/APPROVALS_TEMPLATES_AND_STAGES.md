# Workfront Approvals API — Templates, Deadlines, and Stages

## Approval Templates

Templates let you define a reusable approval configuration (participants, roles, deadlines) and apply it when creating new approvals — saving setup time for recurring workflows.

### Who Can Create Templates
Standard license users and above can create approval templates.

### Template Fields

| Field | Type | Description |
|-------|------|-------------|
| `ID` | string | Template ID |
| `name` | string | Template name |
| `description` | string | Template description |
| `stages` | array | Ordered list of approval stages |
| `createdByID` | string | User who created the template |
| `createdAt` | datetime | Creation timestamp |

### List Available Templates

```javascript
async function listApprovalTemplates(token) {
    const res = await fetch(
        `<baseURL>/approval-templates`,
        { headers: { 'Authorization': `Bearer ${token}` } }
    )
    return res.json()  // array of template objects
}
```

### Apply a Template When Creating an Approval

```javascript
async function createApprovalFromTemplate({ documentVersionId, templateId, deadline }, token) {
    const res = await fetch(
        `<baseURL>/document-approvals`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                documentVersionID: documentVersionId,
                approvalTemplateID: templateId,
                deadline: deadline   // ISO 8601 datetime string
            })
        }
    )
    return res.json()
}
```

### Create an Approval Without a Template

```javascript
async function createApproval({ documentVersionId, deadline, participants }, token) {
    // participants: [{ userID, isApprover }, ...]
    const res = await fetch(
        `<baseURL>/document-approvals`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                documentVersionID: documentVersionId,
                deadline,
                participants
            })
        }
    )
    return res.json()
}
```

## Deadlines

- Deadlines are set at the approval level (and optionally per stage in multi-stage workflows)
- Workfront automatically sends reminder notifications at **72 hours** and **24 hours** before deadline
- Deadline value format: ISO 8601 datetime string (e.g. `"2025-06-30T17:00:00Z"`)
- Overdue approvals are surfaced in Home widgets and Canvas Dashboards

```javascript
// Update deadline on an existing approval
async function updateApprovalDeadline(approvalId, newDeadline, token) {
    const res = await fetch(
        `<baseURL>/document-approvals/${approvalId}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ deadline: newDeadline })
        }
    )
    return res.json()
}
```

## Approval Stages

Multi-stage approvals let you sequence review/approval rounds (e.g., internal review → executive sign-off).

**Status:** Multi-stage approvals were listed as "Coming soon" as of early 2026 for Unified Approvals. Check release notes before implementing.

### Stage Fields

| Field | Type | Description |
|-------|------|-------------|
| `ID` | string | Stage ID |
| `approvalID` | string | Parent approval ID |
| `stageOrder` | number | Position in sequence (1-based) |
| `deadline` | datetime | Stage-specific deadline |
| `status` | string | Stage status |
| `participants` | array | Reviewers and approvers in this stage |

### Stage Workflow

```
Stage 1 (e.g. Design Review)
  → all Stage 1 participants complete
  → Stage 2 activates (e.g. Legal Sign-off)
  → all Stage 2 participants complete
  → overall approval resolved
```

### Create a Multi-Stage Approval

```javascript
async function createMultiStageApproval({ documentVersionId, stages }, token) {
    // stages: [{ deadline, participants: [{ userID, isApprover }] }, ...]
    const res = await fetch(
        `<baseURL>/document-approvals`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                documentVersionID: documentVersionId,
                stages
            })
        }
    )
    return res.json()
}
```

## Workfront Home Widgets

Unified Approvals surfaces KPIs in the Workfront Home area:
- Pending approvals count
- Overdue approvals count
- Average approval duration
- Approvals by decision (Approved / Needs Work / etc.)

These are read-only UI widgets — no API equivalent; use Canvas Dashboards for programmatic reporting.

## AI Reviewer

Workfront includes an AI Reviewer that can automate brand compliance checks as part of an approval workflow. It is added as a participant (like a user) and makes automated decisions. Configuration is done in the Workfront UI — there is no direct API for configuring the AI Reviewer.
