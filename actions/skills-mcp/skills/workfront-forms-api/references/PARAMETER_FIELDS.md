# Workfront Custom Forms — Parameter Fields

## Parameter Object

A Parameter is a single custom field (form field):

```http
GET /attask/api/v21.0/parameter/{id}?fields=name,label,dataType,displayType,isRequired,possibleValues
```

## Key Parameter Fields

| API Field | Type | Description |
|-----------|------|-------------|
| `ID` | string | Parameter ID |
| `name` | string | Internal name (used in API) |
| `label` | string | Display label shown to user |
| `dataType` | string | CHAR, INT, DOUBLE, DATE, DATETIME, BOOLEAN |
| `displayType` | string | EDIT, DROP, MULT, CHECK, RADIO, DATM, TEXT, CALC |
| `isRequired` | boolean | Whether field is required |
| `possibleValues` | array | Allowed values for DROP/MULT/RADIO fields |
| `size` | number | Max text length |
| `defaultValue` | string | Default value |
| `instructions` | string | Help text |

## Display Types

| displayType | Description |
|-------------|-------------|
| `EDIT` | Single-line text |
| `TEXT` | Multi-line text area |
| `DROP` | Single-select dropdown |
| `MULT` | Multi-select dropdown |
| `RADIO` | Radio button group |
| `CHECK` | Checkbox (boolean) |
| `DATE` | Date picker |
| `DATM` | Date + time picker |
| `CALC` | Calculated field (read-only) |
| `CURR` | Currency field |

## possibleValues (for DROP/MULT/RADIO)

```http
GET /attask/api/v21.0/parameter/{id}?fields=possibleValues
```

Response:
```json
{
    "possibleValues": [
        { "value": "High", "label": "High Priority" },
        { "value": "Medium", "label": "Medium Priority" },
        { "value": "Low", "label": "Low Priority" }
    ]
}
```

## Search Parameters for a Form

```http
GET /attask/api/v21.0/parameter/search?categoryID={formId}&fields=name,label,dataType,displayType,isRequired
```

## Required Field Validation

```javascript
async function validateRequiredFields(categoryId, parameterValues, token, domain) {
    const params = await getParametersForCategory(categoryId, token, domain)
    const required = params.filter(p => p.isRequired)
    const missing = required.filter(p => {
        const value = parameterValues[`DE:${p.label}`]
        return !value || value === ''
    })
    return missing.map(p => p.label)
}
```
