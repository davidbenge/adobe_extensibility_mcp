# Workfront Issues API — Query Patterns

## Basic Issue Search

```http
GET /attask/api/v18.0/issue/search?projectID=proj-id&status=INP&fields=name,status,assignedTo:name
```

## Issue Queue Search

```http
GET /attask/api/v18.0/issue/search?isHelpDesk=true&status=NEW&fields=name,referenceNumber,submittedByID
```

## Filter by Severity

```http
GET /attask/api/v18.0/issue/search?severity=BUG_SEVERITY_4&status=INP&fields=name,priority,severity
```

## Date Range Filters

```http
GET /attask/api/v18.0/issue/search?plannedCompletionDate=2025-01-01&plannedCompletionDate_Mod=lte&status=NEW&fields=name,plannedCompletionDate
```

## Sorting and Pagination

```http
GET /attask/api/v18.0/issue/search
    ?projectID=proj-id
    &fields=name,status,priority,assignedTo:name
    &$$LIMIT=50
    &$$FIRST=0
    &$$ORDERBY=priority
    &$$ORDERDIR=ASC
```

## Issues Without Assignee

```http
GET /attask/api/v18.0/issue/search?assignedToID=&assignedToID_Mod=isblank&status=NEW
```

## Multiple Status Values

```http
GET /attask/api/v18.0/issue/search?status=NEW,INP,AWA&status_Mod=in&fields=name,status
```

## JavaScript Helper

```javascript
async function searchIssues({ projectId, status, severity, unassigned, limit = 50, offset = 0 }, token, domain) {
    const params = new URLSearchParams({
        fields: 'name,status,priority,severity,assignedTo:name,plannedCompletionDate,referenceNumber',
        $$LIMIT: limit,
        $$FIRST: offset,
        $$ORDERBY: 'priority',
        $$ORDERDIR: 'ASC'
    })
    if (projectId) params.set('projectID', projectId)
    if (status) { params.set('status', Array.isArray(status) ? status.join(',') : status); params.set('status_Mod', 'in') }
    if (severity) params.set('severity', severity)
    if (unassigned) { params.set('assignedToID', ''); params.set('assignedToID_Mod', 'isblank') }

    const url = `https://${domain}.my.workfront.com/attask/api/v18.0/issue/search?${params}`
    const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
    const data = await response.json()
    return data.data
}
```
