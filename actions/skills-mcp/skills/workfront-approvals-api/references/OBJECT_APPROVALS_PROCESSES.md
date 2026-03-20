# Object Approvals — Approval Processes

An **Approval Process** is a reusable template that defines the steps, approvers, and rules for an object approval workflow. Approval Processes are configured in the Workfront UI and then attached to projects, tasks, or issues to trigger approval workflows when specific statuses are set.

## Query Approval Processes

Approval Processes are queryable via the standard REST API. Filter by `objCode` to get processes applicable to a specific object type.

```http
# List approval processes for projects
GET https://<workfront_host>/attask/api/v21.0/approvalprocess/search?objCode=PROJ&fields=name,description,ID
Authorization: Bearer {token}

# List approval processes for tasks
GET https://<workfront_host>/attask/api/v21.0/approvalprocess/search?objCode=TASK&fields=name,description,ID
Authorization: Bearer {token}

# List approval processes for issues
GET https://<workfront_host>/attask/api/v21.0/approvalprocess/search?objCode=OPTASK&fields=name,description,ID
Authorization: Bearer {token}
```

```javascript
async function listApprovalProcesses(objCode, token) {
    // objCode: 'PROJ' | 'TASK' | 'OPTASK'
    const res = await fetch(
        `https://<workfront_host>/attask/api/v21.0/approvalprocess/search?objCode=${objCode}&fields=name,description,ID`,
        { headers: { 'Authorization': `Bearer ${token}` } }
    )
    return res.json()
}
```

## Approval Process Fields

| Field | Type | Description |
|-------|------|-------------|
| `ID` | string | Approval process ID — use this when attaching to an object |
| `name` | string | Display name of the approval process |
| `description` | string | Description |
| `objCode` | string | Always `ARVPRC` |
| `approvalObjCode` | string | Object type this process applies to (`PROJ`, `TASK`, `OPTASK`) |
| `approvalStatuses` | string[] | Status values that trigger this approval process (e.g. `["CPL"]`) |
| `isActive` | boolean | Whether this process is currently active |
| `isPrivate` | boolean | Whether this process is private to its creator |
| `durationMinutes` | number | Expected duration of the approval in minutes |
| `groupID` | string | Group this process belongs to (if group-scoped) |

## Attach an Approval Process to an Object

Set `approvalProcessID` on a project, task, or issue via a standard `PUT`:

```http
PUT https://<workfront_host>/attask/api/v21.0/project/{id}
Authorization: Bearer {token}
Content-Type: application/json

{ "approvalProcessID": "{approvalProcessId}" }
```

```javascript
async function attachApprovalProcess({ objType, objectId, approvalProcessId }, token) {
    // objType: 'project' | 'task' | 'issue'
    const res = await fetch(
        `https://<workfront_host>/attask/api/v21.0/${objType}/${objectId}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ approvalProcessID: approvalProcessId })
        }
    )
    return res.json()
}
```

## Read Approval State on an Object

To see the current approval process and step for an object, fetch the object with `approvalProcess:*` and `currentApprovalStep:*` as field references:

```http
GET https://<workfront_host>/attask/api/v21.0/project/{id}?fields=status,approvalProcess:*,currentApprovalStep:*
Authorization: Bearer {token}
```

Same pattern works for tasks and issues:
```http
GET https://<workfront_host>/attask/api/v21.0/task/{id}?fields=status,approvalProcess:*,currentApprovalStep:*
GET https://<workfront_host>/attask/api/v21.0/issue/{id}?fields=status,approvalProcess:*,currentApprovalStep:*
```

Example response:
```json
{
    "data": {
        "ID": "69a0c87800054a686195f5ef9ba27440",
        "name": "PMI PSD Creation Brief",
        "objCode": "PROJ",
        "status": "CPL:A",
        "approvalProcess": {
            "ID": "68963aaf0003436625deffac7998fc29",
            "name": "Debrief Approval",
            "objCode": "ARVPRC",
            "approvalObjCode": "PROJ",
            "approvalStatuses": ["CPL"],
            "isActive": true,
            "isPrivate": false,
            "durationMinutes": 480
        },
        "currentApprovalStep": {
            "ID": "68963aaf000343688616cfeb1806013a",
            "name": "Debrief Approval",
            "objCode": "ARVSTP",
            "approvalPathID": "68963aaf0003436702aa1a44f0aebc3e",
            "approvalType": "OM",
            "sequenceNumber": 0
        }
    }
}
```

Key interpretation:
- **`approvalProcess`** — the process definition attached to this object; `approvalStatuses` lists which status values trigger the approval
- **`currentApprovalStep`** — present only when the object is actively pending approval; `null` or absent means no pending approval
- **`status` ends in `:A`** — the quickest check for pending approval (see `OBJECT_APPROVALS_OVERVIEW.md`)

