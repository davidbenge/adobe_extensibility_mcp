# Workfront Issues API — Custom Forms on Issues

> For full Custom Form definitions (Category/Parameter objects, form structure, parameter types),
> load the **workfront-forms-api** skill. This file covers reading/writing custom form data on issue objects only.

## Reading Custom Form Data

Custom form values are in `parameterValues` on the issue:

```http
GET /attask/api/v21.0/issue/{id}?fields=parameterValues
```

Response:
```json
{
    "data": {
        "ID": "issue-id",
        "parameterValues": {
            "DE:Root Cause": "Configuration",
            "DE:Customer Impacted": "true",
            "DE:Resolution Notes": "Updated firewall rule"
        }
    }
}
```

Custom form fields use the `DE:` prefix followed by the field label.

## Writing Custom Form Data

```http
PUT /attask/api/v21.0/issue/{id}
Content-Type: application/json

{
    "parameterValues": {
        "DE:Root Cause": "User Error",
        "DE:Customer Impacted": "false"
    }
}
```

## Which Forms are Attached?

```http
GET /attask/api/v21.0/issue/{id}?fields=objectCategories
```

Response includes `objectCategories` with category IDs — look up category details for field definitions.

## Searching by Custom Field Value

```http
GET /attask/api/v21.0/issue/search?DE:Customer%20Impacted=true&fields=name,status
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
