# Workfront Tasks API — Custom Forms on Tasks

## Reading Custom Form Data

Custom form values are in `parameterValues` on the task:

```http
GET /attask/api/v21.0/task/{id}?fields=parameterValues
```

Response:
```json
{
    "data": {
        "ID": "task-id",
        "parameterValues": {
            "DE:Risk Level": "High",
            "DE:Sprint": "Sprint 23",
            "DE:Story Points": "5"
        }
    }
}
```

Custom form fields use the `DE:` prefix followed by the field label.

## Writing Custom Form Data

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

## Which Forms are Attached?

```http
GET /attask/api/v21.0/task/{id}?fields=objectCategories
```

Response includes `objectCategories` with category IDs — look up category details for field definitions.

## Searching by Custom Field Value

```http
GET /attask/api/v21.0/task/search?DE:Risk%20Level=High&fields=name,status
```

URL-encode field names with special characters.

## Discovering Custom Fields on a Form

```http
GET /attask/api/v21.0/category/{categoryId}?fields=parameterGroups:parameterGroup:categoryParameters:parameter
```

Returns full parameter definition including labels, field types, and allowed values.

## Field Type Value Formats

| Workfront Type | Value Format |
|---------------|-------------|
| Text | string |
| Number | string (numeric) |
| Date | ISO 8601 string |
| Dropdown | exact label string |
| Multi-Select | comma-separated labels |
| Checkbox | `"true"` or `"false"` (as string) |
| Currency | string (numeric with decimals) |
