# Workfront Tasks API — Bulk Operations

## Bulk Update via PUT

Update multiple tasks in one request:

```http
PUT /attask/api/v21.0/task
Content-Type: application/json
Authorization: Bearer {token}

{
    "updates": [
        { "ID": "task-id-1", "status": "INP", "percentComplete": 50 },
        { "ID": "task-id-2", "status": "CPL", "percentComplete": 100 },
        { "ID": "task-id-3", "assignedToID": "user-id-abc" }
    ]
}
```

## Bulk Status Change

```javascript
async function bulkUpdateTaskStatus(taskIds, newStatus, token, domain) {
    const updates = taskIds.map(id => ({ ID: id, status: newStatus }))

    const response = await fetch(`https://${domain}.my.workfront.com/attask/api/v21.0/task`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ updates })
    })

    const data = await response.json()
    return data.data  // array of updated task objects
}
```

## Batch Create

```http
POST /attask/api/v21.0/task
Content-Type: application/json

{
    "updates": [
        { "name": "Task 1", "projectID": "proj-id", "plannedStartDate": "2025-01-15" },
        { "name": "Task 2", "projectID": "proj-id", "parentID": "parent-task-id" }
    ]
}
```

## Bulk Delete

```http
DELETE /attask/api/v21.0/task
Content-Type: application/json

{
    "IDs": ["task-id-1", "task-id-2", "task-id-3"]
}
```

## Error Handling in Bulk

Workfront bulk operations return partial success. Check each item:

```javascript
const results = data.data  // updated objects
const errors = data.errors || []

if (errors.length > 0) {
    console.error('Some tasks failed to update:', errors)
}
```

## Rate Limiting

- Chunk large batches into groups of 50–100
- Use exponential backoff on 429 responses
- Log each batch completion for auditability
