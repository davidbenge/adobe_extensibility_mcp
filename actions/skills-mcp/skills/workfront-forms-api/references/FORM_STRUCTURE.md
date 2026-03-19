# Workfront Custom Forms — Form Structure

> Custom forms apply to ALL Workfront object types: Tasks (TASK), Issues (OPTASK),
> Projects (PROJ), Users (USER), Portfolios (PORT), Programs (PRGM), and more.
> For reading/writing custom field values on a specific object, also see PARAMETER_VALUES.md.

## Hierarchy

```
Category (Custom Form)
  └── CategoryParameter (junction)
        └── Parameter (Field)
        └── ParameterGroup (Section)
```

## Get Full Form Structure

```http
GET /attask/api/v21.0/category/{id}?fields=*,categoryParameters:*,categoryParameters:parameter:*,categoryParameters:parameterGroup:*
```

Response structure:
```json
{
  "data": {
    "ID": "697a6ab2000128f0b72c4b62c189ab44",
    "name": "Custom Extension",
    "objCode": "CTGY",
    "catObjCode": "CMPY",
    "customerID": "63091f4a059594007be96c8c001ad934",
    "description": "",
    "enteredByID": "683608100c84910fae582ddb6ce71173",
    "extRefID": null,
    "groupID": "63091f560595b3b79cfc61628bf759b6",
    "hasCalculatedFields": false,
    "isActive": true,
    "lastUpdateDate": "2026-03-19T16:56:27:899-0600",
    "lastUpdatedByID": "683608100c84910fae582ddb6ce71173",
    "objTypes": [
      "CMPY",
      "PORT",
      "PRGM",
      "PROJ",
      "TASK",
      "OPTASK",
      "USER",
      "DOCU",
      "EXPNS",
      "ITRN",
      "BILL",
      "GROUP"
    ],
    "categoryParameters": [
      {
        "objCode": "CTGYPA",
        "parameter": {
          "ID": "68559ccf0004ee569abad7bc2c782e02",
          "name": "Account ID",
          "objCode": "PARAM",
          "configurations": {},
          "customerID": "63091f4a059594007be96c8c001ad934",
          "dataType": "TEXT",
          "description": null,
          "displaySize": 30,
          "displayType": "TEXT",
          "extRefID": null,
          "formatConstraint": null,
          "isActive": true,
          "isRequired": false,
          "label": "Account ID",
          "lastUpdateDate": "2025-06-20T11:39:27:230-0600",
          "lastUpdatedByID": "683608100c84910fae582ddb6ce71173",
          "refObjCode": null
        },
        "categoryID": "697a6ab2000128f0b72c4b62c189ab44",
        "configurations": {},
        "customerID": "63091f4a059594007be96c8c001ad934",
        "displayOrder": 3,
        "hideFormulaFromDescription": false,
        "isInvalidExpression": false,
        "isRequired": false,
        "parameterGroupID": "69bc7f1b000336dbe880c87e4f298f18",
        "parameterID": "68559ccf0004ee569abad7bc2c782e02",
        "rowShared": false,
        "securityLevel": "ELU",
        "viewSecurityLevel": "V",
        "parameterGroup": {
          "ID": "69bc7f1b000336dbe880c87e4f298f18",
          "name": "MyNewSection",
          "objCode": "PGRP",
          "customerID": "63091f4a059594007be96c8c001ad934",
          "description": null,
          "displayOrder": 0,
          "extRefID": null,
          "isDefault": false,
          "lastUpdateDate": "2026-03-19T16:56:27:899-0600",
          "lastUpdatedByID": "683608100c84910fae582ddb6ce71173"
        }
      },
      {
        "objCode": "CTGYPA",
        "parameter": {
          "ID": "697a6b3b000095fb7c1bea58fff00201",
          "name": "Context Table",
          "objCode": "PARAM",
          "configurations": {},
          "customerID": "63091f4a059594007be96c8c001ad934",
          "dataType": "WIDGET",
          "description": null,
          "displaySize": 50,
          "displayType": "UIEXTNSION",
          "extRefID": null,
          "formatConstraint": null,
          "isActive": true,
          "isRequired": false,
          "label": "Context Table",
          "lastUpdateDate": "2026-03-19T16:56:27:800-0600",
          "lastUpdatedByID": "683608100c84910fae582ddb6ce71173",
          "refObjCode": null
        },
        "categoryID": "697a6ab2000128f0b72c4b62c189ab44",
        "configurations": {},
        "customerID": "63091f4a059594007be96c8c001ad934",
        "displayOrder": 1,
        "hideFormulaFromDescription": false,
        "isInvalidExpression": false,
        "isRequired": false,
        "parameterGroupID": "630921c0003a38accff639613d2288a2",
        "parameterID": "697a6b3b000095fb7c1bea58fff00201",
        "rowShared": true,
        "securityLevel": "ELU",
        "viewSecurityLevel": "V",
        "parameterGroup": {
          "ID": "630921c0003a38accff639613d2288a2",
          "name": "Default Custom Form Section",
          "objCode": "PGRP",
          "customerID": "63091f4a059594007be96c8c001ad934",
          "description": null,
          "displayOrder": 0,
          "extRefID": null,
          "isDefault": true,
          "lastUpdateDate": "2026-03-09T16:30:22:268-0600",
          "lastUpdatedByID": "690f3aee017dfd8c61d7eeec519bed45"
        }
      },
      {
        "objCode": "CTGYPA",
        "parameter": {
          "ID": "697a9afd0000a488eb94dfd5a3b6d890",
          "name": "Second Widget",
          "objCode": "PARAM",
          "configurations": {},
          "customerID": "63091f4a059594007be96c8c001ad934",
          "dataType": "WIDGET",
          "description": null,
          "displaySize": 50,
          "displayType": "UIEXTNSION",
          "extRefID": null,
          "formatConstraint": null,
          "isActive": true,
          "isRequired": false,
          "label": "Second Widget",
          "lastUpdateDate": "2026-03-19T16:56:27:839-0600",
          "lastUpdatedByID": "683608100c84910fae582ddb6ce71173",
          "refObjCode": null
        },
        "categoryID": "697a6ab2000128f0b72c4b62c189ab44",
        "configurations": {},
        "customerID": "63091f4a059594007be96c8c001ad934",
        "displayOrder": 2,
        "hideFormulaFromDescription": false,
        "isInvalidExpression": false,
        "isRequired": false,
        "parameterGroupID": "630921c0003a38accff639613d2288a2",
        "parameterID": "697a9afd0000a488eb94dfd5a3b6d890",
        "rowShared": false,
        "securityLevel": "ELU",
        "viewSecurityLevel": "V",
        "parameterGroup": {
          "ID": "630921c0003a38accff639613d2288a2",
          "name": "Default Custom Form Section",
          "objCode": "PGRP",
          "customerID": "63091f4a059594007be96c8c001ad934",
          "description": null,
          "displayOrder": 0,
          "extRefID": null,
          "isDefault": true,
          "lastUpdateDate": "2026-03-09T16:30:22:268-0600",
          "lastUpdatedByID": "690f3aee017dfd8c61d7eeec519bed45"
        }
      }
    ]
  }
}
```

## List Forms for an Object Type

```http
GET /attask/api/v21.0/category/search?catObjCode=TASK&fields=name,description
GET /attask/api/v21.0/category/search?catObjCode=OPTASK&fields=name,description
GET /attask/api/v21.0/category/search?catObjCode=PROJ&fields=name,description
GET /attask/api/v21.0/category/search?catObjCode=USER&fields=name,description
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

## Attach a Form to an Object (Project example)

```http
POST /attask/api/v21.0/project  -> For new project
PUT /attask/api/v21.0/project/{id}  -> For existing project
Content-Type: application/json

{
    "categoryID": "form-id-here"
}
```

## Detach a Form

```http
PUT /attask/api/v21.0/project/{id} 
Content-Type: application/json

{
    "categoryID": ""
}
```
