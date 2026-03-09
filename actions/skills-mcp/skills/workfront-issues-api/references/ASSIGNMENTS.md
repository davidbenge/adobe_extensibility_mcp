# Workfront Issues API — Assignments

## Assign to a Single User

```http
PUT /attask/api/v18.0/issue/{id}
Content-Type: application/json

{
    "assignedToID": "user-id-here"
}
```

## Assign to a Team

```http
PUT /attask/api/v18.0/issue/{id}
Content-Type: application/json

{
    "teamID": "team-id-here"
}
```

## Multi-Assignment (Assignments Object)

```http
POST /attask/api/v18.0/assignment
Content-Type: application/json

{
    "issueID": "issue-id-here",
    "assignedToID": "user-id-here",
    "isPrimary": true
}
```

Or add multiple in one call:

```javascript
async function assignIssueToUsers(issueId, userIds, token, domain) {
    const assignments = userIds.map((userId, i) => ({
        issueID: issueId,
        assignedToID: userId,
        isPrimary: i === 0
    }))

    const response = await fetch(`https://${domain}.my.workfront.com/attask/api/v18.0/assignment`, {
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
GET /attask/api/v18.0/issue/{id}?fields=assignments,assignedTo:name,team:name
```

## Remove Assignment

```http
DELETE /attask/api/v18.0/assignment/{assignmentId}
Authorization: Bearer {token}
```

## Re-assign (Replace Primary)

```javascript
async function reassignIssue(issueId, newAssigneeId, token, domain) {
    // Simply update assignedToID — replaces primary assignment
    return updateIssue(issueId, { assignedToID: newAssigneeId }, token, domain)
}
```
