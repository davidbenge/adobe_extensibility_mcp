# Workfront Custom Forms — Category Object

## What is a Category?

In the Workfront API, a **Category** = a Custom Form. Categories are reusable form definitions that can be attached to any Workfront object type (Tasks, Issues, Projects, Users, Portfolios, Programs, etc.).

## List All Custom Forms

```http
GET /attask/api/v21.0/category/search?fields=name,description,objCodes
```

## Get Form Details

```http
GET /attask/api/v21.0/category/{id}?fields=name,description,objCodes,parameterGroups:parameterGroup:name
```

## Find Which Forms Are on an Object

```http
GET /attask/api/v21.0/task/{id}?fields=objectCategories
GET /attask/api/v21.0/issue/{id}?fields=objectCategories
GET /attask/api/v21.0/proj/{id}?fields=objectCategories
```

Or query objectCategory:

```http
GET /attask/api/v21.0/objectCategory/search?objCode=TASK&objID={taskId}&fields=category:name,categoryID
```

## Filter Categories by Object Type

```http
GET /attask/api/v21.0/category/search?objCodes=TASK&fields=name,description
GET /attask/api/v21.0/category/search?objCodes=OPTASK&fields=name,description
GET /attask/api/v21.0/category/search?objCodes=PROJ&fields=name,description
```

## Category Fields

| API Field | Type | Description |
|-----------|------|-------------|
| `ID` | string | Form ID |
| `name` | string | Form name |
| `description` | string | Form description |
| `objCodes` | array | Object types this form applies to |
| `catObjCode` | string | Primary object type |
| `isGlobal` | boolean | Available to all object types |
| `parameterGroups` | array | Sections of the form |

## JavaScript: Load Form Schema

```javascript
async function getFormSchema(categoryId, token, domain) {
    const res = await fetch(
        `https://${domain}.my.workfront.com/attask/api/v21.0/category/${categoryId}?fields=name,parameterGroups:parameterGroup:categoryParameters:parameter:name,parameter:label,parameter:dataType,parameter:displayType,parameter:isRequired,parameter:possibleValues`,
        { headers: { 'Authorization': `Bearer ${token}` } }
    )
    const data = await res.json()
    return data.data
}
```

## Creating a Category (Admin)

```http
POST /attask/api/v21.0/category
Content-Type: application/json

{
    "name": "My Custom Form",
    "catObjCode": "TASK",
    "description": "Custom fields for task tracking"
}
```

Creating forms requires admin or group admin permissions.
