# Workfront Events API — Event Filtering

## Filter Syntax

Filters are included in the subscription creation payload:

```json
{
    "objCode": "TASK",
    "eventType": "UPDATE",
    "url": "https://your-webhook.example.com/handler",
    "authToken": "your-secret",
    "filters": [
        {
            "fieldName": "status",
            "fieldValue": "CPL",
            "operator": "eq"
        }
    ]
}
```

## Supported Operators

| Operator | Description |
|----------|-------------|
| `eq` | Equal |
| `ne` | Not equal |
| `gt` | Greater than |
| `gte` | Greater than or equal |
| `lt` | Less than |
| `lte` | Less than or equal |
| `contains` | String contains |
| `notContains` | String does not contain |
| `changed` | Field value changed (UPDATE events only) |

## Filter Limits

- Up to **10 filter groups** per subscription
- Up to **5 filters per group**
- Filters within a group: **AND logic**
- Across groups: **OR logic**

## Example: Notify Only When Status Changes

```json
{
    "objCode": "TASK",
    "eventType": "UPDATE",
    "url": "https://your-webhook.example.com/handler",
    "authToken": "your-secret",
    "filters": [
        {
            "fieldName": "status",
            "operator": "changed"
        }
    ]
}
```

## Example: Notify Only When Project Status = CPL

```json
{
    "objCode": "PROJ",
    "eventType": "UPDATE",
    "url": "https://your-webhook.example.com/handler",
    "authToken": "your-secret",
    "filters": [
        {
            "fieldName": "status",
            "fieldValue": "CPL",
            "operator": "eq"
        }
    ]
}
```

## Example: Multiple Filter Groups (OR logic)

```json
{
    "objCode": "TASK",
    "eventType": "UPDATE",
    "url": "https://your-webhook.example.com/handler",
    "authToken": "your-secret",
    "filters": [
        {
            "fieldName": "status",
            "fieldValue": "CPL",
            "operator": "eq"
        },
        {
            "fieldName": "status",
            "fieldValue": "ONH",
            "operator": "eq"
        }
    ]
}
```

Note: Multiple top-level filter objects are treated as OR groups.
