# Workfront Issues API — Query Patterns

## Basic Issue Search

```http
GET /attask/api/v21.0/issue/search?projectID=proj-id&status=INP&fields=name,status,assignedTo:name
```

## Request Queue Search

```http
GET /attask/api/v21.0/issue/search?isHelpDesk=true&status=NEW&fields=name,referenceNumber,submittedByID
```

## Filter by Severity

```http
GET /attask/api/v21.0/issue/search?severity=BUG_SEVERITY_4&status=INP&fields=name,priority,severity
```

## Date Range Filters

```http
GET /attask/api/v21.0/issue/search?plannedCompletionDate=2025-01-01&plannedCompletionDate_Mod=lte&status=NEW&fields=name,plannedCompletionDate
```

## Issues Without Assignee

```http
GET /attask/api/v21.0/issue/search?assignedToID=&assignedToID_Mod=isblank&status=NEW
```

## Multiple Status Values

```http
GET /attask/api/v21.0/issue/search?status=NEW,INP,AWA&status_Mod=in&fields=name,status
```

## OR Queries

```http
# Issues in project A OR assigned to user B
GET /attask/api/v21.0/issue/search?projectID=proj-a&OR:1:assignedTo:ID=user-id-b&fields=name,status
```

## Sorting and Pagination

Sort by appending `{fieldName}_Sort=asc` or `{fieldName}_Sort=desc` as a parameter.

```http
GET /attask/api/v21.0/issue/search
    ?projectID=proj-id
    &fields=name,status,priority,assignedTo:name
    &$$LIMIT=50
    &$$FIRST=0
    &entryDate_Sort=asc
```

## JavaScript Helper

```javascript
async function searchIssues({ projectId, status, severity, unassigned, limit = 50, offset = 0 }, token, domain) {
    const params = new URLSearchParams({
        fields: 'name,status,priority,severity,assignedTo:name,plannedCompletionDate,referenceNumber',
        $$LIMIT: limit,
        $$FIRST: offset
    })
    if (projectId) params.set('projectID', projectId)
    if (status) { params.set('status', Array.isArray(status) ? status.join(',') : status); params.set('status_Mod', 'in') }
    if (severity) params.set('severity', severity)
    if (unassigned) { params.set('assignedToID', ''); params.set('assignedToID_Mod', 'isblank') }

    const url = `https://${workfront_host}/attask/api/v21.0/issue/search?${params}`
    const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
    const data = await response.json()
    return data.data
}
```
