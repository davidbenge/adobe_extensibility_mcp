# Workfront Tasks API — Assignments

## Assign to a Single User

```http
PUT /attask/api/v21.0/task/{id}
Content-Type: application/json

{
    "assignedToID": "user-id-here"
}
```

## Assign to a Team

```http
PUT /attask/api/v21.0/task/{id}
Content-Type: application/json

{
    "teamID": "team-id-here"
}
```

## Multi-Assignment

```http
POST /attask/api/v21.0/assignment
Content-Type: application/json

{
    "taskID": "task-id-here",
    "assignedToID": "user-id-here",
    "isPrimary": true
}
```

Batch multi-assign:

```javascript
async function assignTaskToUsers(taskId, userIds, token, domain) {
    const assignments = userIds.map((userId, i) => ({
        taskID: taskId,
        assignedToID: userId,
        isPrimary: i === 0
    }))

    const response = await fetch(`https://${workfront_host}/attask/api/v21.0/assignment`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ updates: assignments })
    })
    return response.json()
}
```

## View Current Assignments

```http
GET /attask/api/v21.0/task/{id}?fields=assignments,assignedTo:name,team:name
```

## Remove Assignment

```http
DELETE /attask/api/v21.0/assignment/{assignmentId}
Authorization: Bearer {token}
```

## Re-assign (Replace Primary)

```javascript
// Simply update assignedToID — replaces primary assignment
async function reassignTask(taskId, newAssigneeId, token, domain) {
    const response = await fetch(`https://${workfront_host}/attask/api/v21.0/task/${taskId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedToID: newAssigneeId })
    })
    return response.json()
}
```
