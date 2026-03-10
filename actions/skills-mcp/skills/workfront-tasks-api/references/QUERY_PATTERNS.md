# Workfront Tasks API — Query Patterns

## Basic Search

```http
GET /attask/api/v21.0/task/search?projectID=proj-id&status=INP&fields=name,status,assignedTo:name
```

## Wildcard Search

```http
GET /attask/api/v21.0/task/search?name=Deploy*&fields=name,status
```

## Filter Modifiers

```http
# Not equal
GET /attask/api/v21.0/task/search?status=CPL&status_Mod=ne

# Greater than or equal
GET /attask/api/v21.0/task/search?percentComplete=50&percentComplete_Mod=gte

# In list
GET /attask/api/v21.0/task/search?status=NEW,INP&status_Mod=in

# Date range
GET /attask/api/v21.0/task/search?plannedStartDate=2025-01-01&plannedStartDate_Mod=gte&plannedCompletionDate=2025-03-31&plannedCompletionDate_Mod=lte
```

Common modifiers: `eq` (default), `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `notin`, `contains`, `cicontains`, `notcontains`, `between`

## Sorting and Pagination

```http
GET /attask/api/v21.0/task/search
    ?projectID=proj-id
    &fields=name,status,plannedCompletionDate
    &$$LIMIT=50
    &$$FIRST=0
    &$$ORDERBY=plannedCompletionDate
    &$$ORDERDIR=ASC
```

- `$$LIMIT`: page size (max 2000)
- `$$FIRST`: offset (0-based)
- `$$ORDERBY`: field to sort
- `$$ORDERDIR`: ASC or DESC

## OR Queries

```http
# Tasks in project A OR owned by user B
GET /attask/api/v21.0/task/search?projectID=proj-a&OR:1:assignedTo:ID=user-id-b
```

## Nested Object Filtering

```http
# Tasks assigned to a specific user
GET /attask/api/v21.0/task/search?assignedTo:emailAddr=user@company.com&fields=name,status

# Tasks in projects with a specific status
GET /attask/api/v21.0/task/search?project:status=CUR&fields=name,project:name
```

## Count Only

```http
GET /attask/api/v21.0/task/search?projectID=proj-id&$$LIMIT=0
```

Returns `totalCount` in response headers.

## JavaScript Pattern

```javascript
async function searchTasks({ projectId, status, assigneeId, limit = 50, offset = 0 }, token, domain) {
    const params = new URLSearchParams({
        fields: 'name,status,percentComplete,assignedTo:name,plannedCompletionDate',
        $$LIMIT: limit,
        $$FIRST: offset,
        $$ORDERBY: 'plannedCompletionDate',
        $$ORDERDIR: 'ASC'
    })
    if (projectId) params.set('projectID', projectId)
    if (status) { params.set('status', status); params.set('status_Mod', 'in') }
    if (assigneeId) params.set('assignedTo:ID', assigneeId)

    const url = `https://${domain}.my.workfront.com/attask/api/v21.0/task/search?${params}`
    const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    return { tasks: data.data, total: parseInt(response.headers.get('X-Total-Count') || '0', 10) }
}
```
