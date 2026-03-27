# Workfront Projects API — CRUD Operations

## Create Project from Scratch

Required fields: `name`. Recommended fields shown below.

```http
POST /attask/api/v21.0/proj
Content-Type: application/json
Authorization: Bearer {token}

{
    "name": "My New Project",
    "status": "PLN",
    "ownerID": "user-id-here",
    "plannedStartDate": "2025-04-01",
    "plannedCompletionDate": "2025-06-30",
    "description": "Project description here"
}
```

## Create Project from Template

```http
POST /attask/api/v21.0/proj
Content-Type: application/json

{
    "name": "My New Project",
    "templateID": "template-id-here",
    "ownerID": "user-id-here",
    "plannedStartDate": "2025-04-01"
}
```

List available templates:
```http
GET /attask/api/v21.0/tmpl/search?fields=name,description
```

## Update Project Fields

```http
PUT /attask/api/v21.0/proj/{id}
Content-Type: application/json
Authorization: Bearer {token}

{
    "status": "CUR",
    "percentComplete": 25,
    "condition": "On Target"
}
```

Note: Setting `condition` requires `conditionType` to be `manual`. To switch to manual condition:
```json
{ "conditionType": "manual", "condition": "At Risk" }
```

## Full Node.js CRUD Example

```javascript
const BASE = `https://${workfront_host}/attask/api/v21.0`

async function createProject(fields, token, domain) {
    const res = await fetch(`${BASE(domain)}/proj`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return data.data
}

async function updateProject(projectId, fields, token, domain) {
    const res = await fetch(`${BASE(domain)}/proj/${projectId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return data.data
}

async function getProject(projectId, fields, token, domain) {
    const url = `${BASE(domain)}/proj/${projectId}?fields=${fields}`
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
    const data = await res.json()
    return data.data
}
```

## Soft Delete vs Hard Delete

Workfront supports two delete modes:

```http
# Soft delete (moves to recycle bin — recoverable)
DELETE /attask/api/v21.0/proj/{id}
Authorization: Bearer {token}

# Hard delete (permanent — requires recycle bin entry first)
DELETE /attask/api/v21.0/proj/{id}?hardDelete=true
```

Soft delete is the default and recommended for production use.
