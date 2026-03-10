# Workfront Custom Forms — Form Structure

> Custom forms apply to ALL Workfront object types: Tasks (TASK), Issues (OPTASK),
> Projects (PROJ), Users (USER), Portfolios (PORT), Programs (PRGM), and more.
> For reading/writing custom field values on a specific object, also see PARAMETER_VALUES.md.

## Hierarchy

```
Category (Custom Form)
  └── ParameterGroup (Section)
        └── CategoryParameter (junction)
              └── Parameter (Field)
```

## Get Full Form Structure

```http
GET /attask/api/v21.0/category/{id}?fields=parameterGroups:parameterGroup:categoryParameters:parameter
```

Response structure:
```json
{
    "data": {
        "ID": "form-id",
        "name": "Project Risk Form",
        "parameterGroups": [
            {
                "parameterGroup": {
                    "name": "Risk Assessment",
                    "categoryParameters": [
                        {
                            "parameter": {
                                "name": "riskLevel",
                                "label": "Risk Level",
                                "dataType": "CHAR",
                                "displayType": "DROP",
                                "isRequired": true
                            }
                        }
                    ]
                }
            }
        ]
    }
}
```

## List Forms for an Object Type

```http
GET /attask/api/v21.0/category/search?objCode=TASK&fields=name,description
GET /attask/api/v21.0/category/search?objCode=OPTASK&fields=name,description
GET /attask/api/v21.0/category/search?objCode=PROJ&fields=name,description
GET /attask/api/v21.0/category/search?objCode=USER&fields=name,description
```

## Object Codes for Custom Forms

| Object | objCode |
|--------|---------|
| Task | TASK |
| Issue/Request | OPTASK |
| Project | PROJ |
| User | USER |
| Portfolio | PORT |
| Program | PRGM |

## Attach a Form to an Object

```http
POST /attask/api/v21.0/objectCategory
Content-Type: application/json

{
    "objCode": "TASK",
    "objID": "task-id-here",
    "categoryID": "form-id-here"
}
```

## Detach a Form

```http
DELETE /attask/api/v21.0/objectCategory/{objectCategoryId}
Authorization: Bearer {token}
```

Find the objectCategory ID first:
```http
GET /attask/api/v21.0/objectCategory/search?objCode=TASK&objID={taskId}&fields=categoryID
```
