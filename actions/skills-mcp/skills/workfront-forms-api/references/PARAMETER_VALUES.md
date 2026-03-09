# Workfront Forms API — Parameter Values

## Reading parameterValues

parameterValues are available on any object that has custom forms attached:

```http
GET /attask/api/v18.0/task/{id}?fields=parameterValues
GET /attask/api/v18.0/issue/{id}?fields=parameterValues
GET /attask/api/v18.0/proj/{id}?fields=parameterValues
```

Response:
```json
{
    "data": {
        "ID": "object-id",
        "parameterValues": {
            "DE:Risk Level": "High",
            "DE:Sprint": "Sprint 23",
            "DE:Story Points": "5",
            "DE:Approved": "true"
        }
    }
}
```

The key format is `DE:{field label}` — the `DE:` prefix is always present.

## Writing parameterValues

```http
PUT /attask/api/v18.0/task/{id}
Content-Type: application/json

{
    "parameterValues": {
        "DE:Risk Level": "Medium",
        "DE:Story Points": "8",
        "DE:Sprint": "Sprint 24"
    }
}
```

Only include fields you want to change. Other values are preserved.

## Value Formats by Field Type

| Field Type | Format | Example |
|-----------|--------|---------|
| Text | string | `"my value"` |
| Number/Int | string | `"42"` |
| Currency | string | `"1500.00"` |
| Date | string (ISO) | `"2025-03-15"` |
| DateTime | string (ISO) | `"2025-03-15T10:00:00"` |
| Checkbox | string | `"true"` or `"false"` |
| Dropdown | label string | `"High Priority"` |
| Multi-select | comma-separated | `"Option1,Option2"` |

## Bulk Read parameterValues

To read parameterValues for many objects at once:

```http
GET /attask/api/v18.0/task/search?projectID={id}&fields=name,parameterValues&$$LIMIT=200
```

## Finding Field Labels

If you know the field name but not the label (for the `DE:` key), look up the Parameter:

```javascript
async function getParamLabel(paramName, token, domain) {
    const res = await fetch(
        `https://${domain}.my.workfront.com/attask/api/v18.0/parameter/search?name=${paramName}&fields=label`,
        { headers: { 'Authorization': `Bearer ${token}` } }
    )
    const data = await res.json()
    return data.data?.[0]?.label
}
```
