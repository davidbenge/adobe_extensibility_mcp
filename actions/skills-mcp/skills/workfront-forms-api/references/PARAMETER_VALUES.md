# Workfront Custom Forms — Parameter Values

> parameterValues are available on ANY Workfront object with custom forms attached:
> Tasks, Issues, Projects, Users, Portfolios, Programs, and more.
> The `DE:` prefix + field label is the universal key format across all object types.

## Reading parameterValues

parameterValues are available on any object that has custom forms attached:

```http
GET /attask/api/v21.0/task/{id}?fields=parameterValues
GET /attask/api/v21.0/issue/{id}?fields=parameterValues
GET /attask/api/v21.0/proj/{id}?fields=parameterValues
GET /attask/api/v21.0/user/{id}?fields=parameterValues
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

Custom field values can be set two equivalent ways — directly as top-level fields or nested in `parameterValues`:

```http
PUT /attask/api/v21.0/task/{id}
Content-Type: application/json

{
    "DE:Risk Level": "Medium",
    "DE:Story Points": "8"
}
```

```http
PUT /attask/api/v21.0/task/{id}
Content-Type: application/json

{
    "parameterValues": {
        "DE:Risk Level": "Medium",
        "DE:Story Points": "8"
    }
}
```

Only include fields you want to change. Other values are preserved.

## Setting the Category (Custom Form) on Write

A `categoryID` must be provided when writing custom field values. Use a single value or an array of category objects:

```http
PUT /attask/api/v21.0/task/{id}
Content-Type: application/json

{
    "categoryID": "5e7bb46701272381d25674d88f958e89",
    "DE:Risk Level": "Medium"
}
```

To attach multiple forms at once, use `objectCategories`:

```http
PUT /attask/api/v21.0/task/{id}
Content-Type: application/json

{
    "objectCategories": [
        { "categoryID": "5e7bb46701272381d25674d88f958e89", "categoryOrder": 0, "objCode": "CTGY" },
        { "categoryID": "5755c21100548959f37973f394e99c2f", "categoryOrder": 1, "objCode": "CTGY" }
    ],
    "DE:Risk Level": "Medium",
    "DE:Story Points": "8"
}
```

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

```http
GET /attask/api/v21.0/task/search?projectID={id}&fields=name,parameterValues&$$LIMIT=200
GET /attask/api/v21.0/issue/search?projectID={id}&fields=name,parameterValues&$$LIMIT=200
```

## Finding Field Labels

If you know the field name but not the label (for the `DE:` key):

```javascript
async function getParamLabel(paramName, token, domain) {
    const res = await fetch(
        `https://${workfront_host}/attask/api/v21.0/parameter/search?name=${paramName}&fields=label`,
        { headers: { 'Authorization': `Bearer ${token}` } }
    )
    const data = await res.json()
    return data.data?.[0]?.label
}
```
