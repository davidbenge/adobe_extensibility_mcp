# Workfront Forms API — Form Structure

## Hierarchy

```
Category (Custom Form)
  └── ParameterGroup (Section)
        └── CategoryParameter (junction)
              └── Parameter (Field)
```

## Category → ParameterGroups → Parameters

Get full form structure in one call:

```http
GET /attask/api/v18.0/category/{id}?fields=parameterGroups:parameterGroup:categoryParameters:parameter
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

## Listing Forms for an Object Type

```http
GET /attask/api/v18.0/category/search?objCode=TASK&fields=name,description
GET /attask/api/v18.0/category/search?objCode=OPTASK&fields=name,description
GET /attask/api/v18.0/category/search?objCode=PROJ&fields=name,description
```

## Object Codes

| Object | objCode |
|--------|---------|
| Task | TASK |
| Issue/Request | OPTASK |
| Project | PROJ |
| User | USER |
| Portfolio | PORT |
| Program | PRGM |

## Attaching a Form to an Object

```http
POST /attask/api/v18.0/objectCategory
Content-Type: application/json

{
    "objCode": "TASK",
    "objID": "task-id-here",
    "categoryID": "form-id-here"
}
```

## Detaching a Form

```http
DELETE /attask/api/v18.0/objectCategory/{objectCategoryId}
Authorization: Bearer {token}
```

First find the objectCategory ID:
```http
GET /attask/api/v18.0/objectCategory/search?objCode=TASK&objID={taskId}&fields=categoryID
```
