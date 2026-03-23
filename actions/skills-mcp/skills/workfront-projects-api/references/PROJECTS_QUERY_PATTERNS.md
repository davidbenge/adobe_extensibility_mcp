# Workfront Projects API — Query Patterns

## Get Project by ID

```http
GET /attask/api/v21.0/proj/{id}?fields=name,status,condition,percentComplete,owner:name,plannedStartDate,plannedCompletionDate
```

## Search by Status

```http
GET /attask/api/v21.0/proj/search?status=CUR&fields=name,status,percentComplete,owner:name
```

## Search by Owner

```http
GET /attask/api/v21.0/proj/search?ownerID={userId}&status=CUR&fields=name,status,plannedCompletionDate
```

## Filter Modifiers

```http
# Projects >= 50% complete
GET /attask/api/v21.0/proj/search?percentComplete=50&percentComplete_Mod=gte&fields=name,percentComplete

# Projects due before a date
GET /attask/api/v21.0/proj/search?plannedCompletionDate=2025-12-31&plannedCompletionDate_Mod=lt&fields=name,plannedCompletionDate

# Projects in trouble
GET /attask/api/v21.0/proj/search?condition=In%20Trouble&fields=name,condition,owner:name
```

## OR Queries

```http
# Projects in portfolio A OR owned by user B
GET /attask/api/v21.0/proj/search?portfolioID=port-id-a&OR:1:ownerID=user-id-b&fields=name,status
```

## Sorting and Pagination

Sort by appending `{fieldName}_Sort=asc` or `{fieldName}_Sort=desc` as a parameter.

```http
GET /attask/api/v21.0/proj/search
    ?status=CUR
    &fields=name,status,percentComplete,plannedCompletionDate
    &$$LIMIT=50
    &$$FIRST=0
    &entryDate_Sort=asc
```

## Expand Task Collection Inline

```http
GET /attask/api/v21.0/proj/{id}?fields=*,tasks[ID,name,status,percentComplete,assignedTo:name]
```

## JavaScript Search Pattern

```javascript
async function searchProjects({ status, ownerId, portfolioId, limit = 50, offset = 0 }, token, domain) {
    const params = new URLSearchParams({
        fields: 'name,status,condition,percentComplete,owner:name,plannedCompletionDate',
        $$LIMIT: limit,
        $$FIRST: offset
    })
    if (status) { params.set('status', status); params.set('status_Mod', 'in') }
    if (ownerId) params.set('ownerID', ownerId)
    if (portfolioId) params.set('portfolioID', portfolioId)

    const url = `https://${workfront_host}/attask/api/v21.0/proj/search?${params}`
    const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
    const data = await response.json()
    return data.data
}
```
