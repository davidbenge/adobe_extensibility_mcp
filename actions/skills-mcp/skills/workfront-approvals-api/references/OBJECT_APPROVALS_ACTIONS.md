# Object Approvals — Actions

Object approval actions are performed via `PUT` with an `action` parameter on the standard Workfront REST API. The same three actions are available on projects, tasks, and issues.

```
PUT https://<workfront_host>/attask/api/v21.0/{objType}/{id}?action={actionName}
Authorization: Bearer {token}
```

## approveApproval

Approves the pending approval on the object. The status change is finalized.

### Examples

```http
# Approve a project
PUT https://<workfront_host>/attask/api/v21.0/project/{id}?action=approveApproval
Authorization: Bearer {token}

# Approve a task
PUT https://<workfront_host>/attask/api/v21.0/task/{id}?action=approveApproval
Authorization: Bearer {token}

# Approve an issue
PUT https://<workfront_host>/attask/api/v21.0/issue/{id}?action=approveApproval
Authorization: Bearer {token}
```

```javascript
async function approveApproval({ objType, objectId, auditNote }, token) {
    // objType: 'project' | 'task' | 'issue'
    const body = {}
    if (auditNote) body.auditNote = auditNote

    const res = await fetch(
        `https://<workfront_host>/attask/api/v21.0/${objType}/${objectId}?action=approveApproval`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
    )
    return res.json()
}
```

## rejectApproval

Rejects the pending approval. The status change is denied and the object reverts to its previous status.

### Examples

```http
# Reject a project approval
PUT https://<workfront_host>/attask/api/v21.0/project/{id}?action=rejectApproval
Authorization: Bearer {token}

# Reject a task approval
PUT https://<workfront_host>/attask/api/v21.0/task/{id}?action=rejectApproval
Authorization: Bearer {token}

# Reject an issue approval
PUT https://<workfront_host>/attask/api/v21.0/issue/{id}?action=rejectApproval
Authorization: Bearer {token}
```

```javascript
async function rejectApproval({ objType, objectId, auditNote }, token) {
    const body = {}
    if (auditNote) body.auditNote = auditNote

    const res = await fetch(
        `https://<workfront_host>/attask/api/v21.0/${objType}/${objectId}?action=rejectApproval`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
    )
    return res.json()
}
```

## recallApproval

Recalls (withdraws) an approval that was previously submitted. Used by the requester to pull back a pending approval before it is decided. Takes no parameters.

### Examples

```http
# Recall a project approval
PUT https://<workfront_host>/attask/api/v21.0/project/{id}?action=recallApproval
Authorization: Bearer {token}

# Recall a task approval
PUT https://<workfront_host>/attask/api/v21.0/task/{id}?action=recallApproval
Authorization: Bearer {token}

# Recall an issue approval
PUT https://<workfront_host>/attask/api/v21.0/issue/{id}?action=recallApproval
Authorization: Bearer {token}
```

```javascript
async function recallApproval({ objType, objectId }, token) {
    const res = await fetch(
        `https://<workfront_host>/attask/api/v21.0/${objType}/${objectId}?action=recallApproval`,
        {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        }
    )
    return res.json()
}
```

## Object Type Path Segments

| Object | Path Segment |
|--------|-------------|
| Project | `project` |
| Task | `task` |
| Issue | `issue` |

> **Note:** The path segment `issue` maps to objCode `OPTASK`. Both `/attask/api/v21.0/issue/{id}` and `/attask/api/v21.0/optask/{id}` resolve to the same object.
