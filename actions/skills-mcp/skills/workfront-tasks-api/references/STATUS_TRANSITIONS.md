# Workfront Tasks API — Status Transitions

## Updating Task Status

```http
PUT /attask/api/v21.0/task/{id}
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
INP → CPL (direct completion)
INP → REJ (rejected, won't fix)
CPL → RPN (re-opened)
```

## Full Status List

To retrieve all available statuses — including native and custom statuses configured in the system — use the following query:

```http
GET /attask/api/v21.0/CSTEM/search?fields=*&enumClass=STATUS_TASK
```

Each result includes a `value` field which is the code to use when setting `status` on a task:

```json
{
    "data": [
        { "label": "New", "value": "NEW", "enumClass": "STATUS_TASK" },
        { "label": "In Progress", "value": "INP", "enumClass": "STATUS_TASK" },
        { "label": "My Custom Status", "value": "CST", "enumClass": "STATUS_TASK" }
    ]
}
```

Use the `value` field directly when updating status:

```http
PUT /attask/api/v21.0/task/{id}
Content-Type: application/json

{
    "status": "CST"
}
```

## Status with Resolution

When closing a task, set status and optional resolution together:

```http
PUT /attask/api/v21.0/task/{id}
Content-Type: application/json

{
    "status": "CPL",
    "resolveTaskID": "task-id-that-resolved-it"
}
```

Or close without a resolving object:

```javascript
async function closeTask(taskId, resolution, token) {
    const response = await fetch(`https://${workfront_host}/attask/api/v21.0/task/${taskId}`, {
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

## Status Validation

Always check for errors — Workfront returns an error if a transition is not allowed:

```javascript
async function safeStatusUpdate(taskId, newStatus, token) {
    const response = await fetch(
        `https://${workfront_host}/attask/api/v21.0/task/${taskId}`,
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

## Approvals

For task approvals, load the **workfront-approvals-api** skill.
