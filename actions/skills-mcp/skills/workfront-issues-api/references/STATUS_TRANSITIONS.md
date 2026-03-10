# Workfront Issues API — Status Transitions

## Updating Issue Status

```http
PUT /attask/api/v21.0/issue/{id}
Content-Type: application/json
Authorization: Bearer {token}

{
    "status": "INP"
}
```

## Common Transition Flows

```
NEW → INP (assign and start work)
INP → AWA (awaiting info from requester)
AWA → INP (info received, resuming)
INP → PRA (pending approval)
PRA → APP (approved)
APP → CPL (work complete)
INP → CPL (direct completion)
INP → REJ (rejected, won't fix)
CPL → RPN (re-opened)
```

## Status with Resolution

When closing an issue, set status and optional resolution together:

```http
PUT /attask/api/v21.0/issue/{id}
Content-Type: application/json

{
    "status": "CPL",
    "resolveTaskID": "task-id-that-resolved-it"
}
```

Or close without a resolving object:

```javascript
async function closeIssue(issueId, resolution, token, domain) {
    const response = await fetch(`https://${domain}.my.workfront.com/attask/api/v21.0/issue/${issueId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: 'CPL',
            description: resolution
        })
    })
    return response.json()
}
```

## Approval Flow

```javascript
// Submit for approval
await updateIssue(id, { status: 'PRA' }, token, domain)

// Approve (requires approver permissions)
await updateIssue(id, { status: 'APP', approverID: approverId }, token, domain)

// Reject with comment
await updateIssue(id, { status: 'REJ' }, token, domain)
await addComment(id, 'Rejected: reason here', token, domain)
```

## Status Validation

Always check for errors — Workfront returns an error if a transition is not allowed:

```javascript
async function safeStatusUpdate(issueId, newStatus, token, domain) {
    const response = await fetch(
        `https://${domain}.my.workfront.com/attask/api/v21.0/issue/${issueId}`,
        {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        }
    )
    const data = await response.json()
    if (data.error) {
        throw new Error(`Status transition failed: ${data.error.message}`)
    }
    return data.data
}
```
