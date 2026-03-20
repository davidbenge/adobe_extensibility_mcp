# Workfront Documents API — Document Folders

Document folders organize documents within Workfront. Each folder is scoped to an object (project, task, issue, etc.). Folders can be nested via `parentID`. The type of object a folder belongs to is determined by which object ID field is populated — only one will be set at a time (e.g., a project folder has `projectID` set; a task folder has `taskID` set).

## Object

| Property | Value |
|----------|-------|
| Name | DocumentFolder |
| objCode | `DOCFDR` |

## Fields

| Name | Label | Field Type | Editable |
|------|-------|------------|----------|
| `ID` | ID | string | false |
| `accessorIDs` | Accessor IDs | string[] | false |
| `customerID` | Customer ID | string | false |
| `enteredByID` | Entered By ID | string | false |
| `entryDate` | Entry Date | dateTime | false |
| `issueID` | Issue ID | string | true |
| `iterationID` | Iteration ID | string | true |
| `lastModDate` | Last Modified | dateTime | false |
| `linkedFolderID` | Linked Folder ID | string | false |
| `name` | Name | string | true |
| `parentID` | Parent ID | string | true |
| `portfolioID` | Portfolio ID | string | true |
| `programID` | Program ID | string | true |
| `projectID` | Project ID | string | true |
| `securityRootID` | Security Root ID | string | false |
| `securityRootObjCode` | Security Root Obj Code | string | false |
| `taskID` | Task ID | string | true |
| `templateID` | Template ID | string | true |
| `templateTaskID` | Template Task ID | string | true |
| `userID` | User ID | string | false |

### Field Example

```http
GET /attask/api/v21.0/docfdr/{ID}?fields=name,projectID,parentID,entryDate
GET /attask/api/v21.0/docfdr/search?projectID={projectID}&fields=ID,name,parentID,taskID
```

## References

References are related objects accessible via the `fields` parameter using colon notation.

| Name | Label | objCode | Field Type |
|------|-------|---------|------------|
| `customer` | Customer | CUST | Customer |
| `enteredBy` | Entered By | USER | User |
| `issue` | Issue | OPTASK | OpTask |
| `iteration` | Iteration | ITRN | Iteration |
| `linkedFolder` | Linked Folder | LNKFDR | LinkedFolder |
| `parent` | Parent | DOCFDR | DocumentFolder |
| `portfolio` | Portfolio | PORT | Portfolio |
| `program` | Program | PRGM | Program |
| `project` | Project | PROJ | Project |
| `task` | Task | TASK | Task |
| `template` | Template | TMPL | Template |
| `templateTask` | Template Task | TTSK | TemplateTask |
| `user` | User | USER | User |

### Reference Example

```http
GET /attask/api/v21.0/docfdr/{ID}?fields=project:name,project:status
GET /attask/api/v21.0/docfdr/{ID}?fields=parent:name,enteredBy:name,task:name
GET /attask/api/v21.0/docfdr/{ID}?fields=*,project:*
```

## Collections

Collections are objects contained within the folder, accessed the same way as references.

| Name | Label | objCode | Field Type |
|------|-------|---------|------------|
| `children` | Children | DOCFDR | DocumentFolder |
| `documents` | Documents | DOCU | Document |

### Collection Example

```http
GET /attask/api/v21.0/docfdr/{ID}?fields=children:*
GET /attask/api/v21.0/docfdr/{ID}?fields=documents:*
GET /attask/api/v21.0/docfdr/{ID}?fields=children:*,documents:*
```

## Actions

Actions are invoked via PUT to the folder ID URL with an `action` parameter.

| Name |
|------|
| `getFolderSizeInBytes` |
| `isLinkedFolder` |
| `isSmartFolder` |
| `unlinkFolders` |

### Action Example

```http
PUT /attask/api/v21.0/docfdr/{ID}?action=isLinkedFolder&documentFolderID={ID}
PUT /attask/api/v21.0/docfdr/{ID}?action=isSmartFolder&documentFolderID={ID}
PUT /attask/api/v21.0/docfdr/{ID}?action=getFolderSizeInBytes&folderID={ID}&recursive=true&includeLinked=false
PUT /attask/api/v21.0/docfdr/{ID}?action=unlinkFolders&ids[]={ID1}&ids[]={ID2}
```

## Queries

Queries are GET operations accessed via a named path segment.

| Name |
|------|
| `myFolders` |

### Query Example

```http
GET /attask/api/v21.0/docfdr/myFolders
```

## Operations

The following operations are supported on the `DOCFDR` object:

- `add` — Create a new folder (POST)
- `count` — Count matching folders
- `delete` — Delete a folder (DELETE)
- `edit` — Update folder fields (PUT)
- `get` — Retrieve a folder by ID (GET)
- `report` — Generate aggregate reports
- `search` — Search folders with filters (GET /search)

## External Document Integrations

Workfront supports linking external storage providers (Box, Dropbox, Google Drive) as document sources.

### Supported External Integration Types

| Type | Description |
|------|-------------|
| `BOX` | Box cloud storage |
| `DROPBOX` | Dropbox cloud storage |
| `DROPBOX_BUSINESS` | Dropbox Business cloud storage |
| `WEBDAM` | WebDAM digital asset management |
| `ONEDRIVE` | Microsoft OneDrive cloud storage |
| `SHAREPOINT` | Microsoft SharePoint |
| `GOOGLEDRIVE` | Google Drive cloud storage |
| `QUIP` | Quip collaborative documents |

## Example: Linked Folder Object

A linked folder is a `DOCFDR` with a populated `linkedFolderID` field. Requesting `linkedFolder` as a reference returns the associated `LNKFDR` object, which contains the external integration details.

```http
GET /attask/api/v21.0/docfdr/{ID}?fields=*,linkedFolder:*
```

```json
{
    "data": {
        "ID": "69bd581d000191d4f9557c074a73935f",
        "name": "Hyatt",
        "objCode": "DOCFDR",
        "customerID": "a3369f9805578ce4e040007f01003947",
        "enteredByID": "a336cdc4d91a7d1de040007f010017ed",
        "entryDate": "2026-03-20T10:22:21:964-0400",
        "issueID": null,
        "iterationID": null,
        "lastModDate": "2026-03-20T10:22:21:964-0400",
        "linkedFolderID": "69bd581d000191d5e70b225cadfb144b",
        "parentID": null,
        "portfolioID": null,
        "programID": null,
        "projectID": "5ec58ab203ab570663686759a933de77",
        "securityRootID": "5ec58ab203ab570663686759a933de77",
        "securityRootObjCode": "PROJ",
        "taskID": null,
        "templateID": null,
        "templateTaskID": null,
        "userID": null,
        "linkedFolder": {
            "ID": "69bd581d000191d5e70b225cadfb144b",
            "objCode": "LNKFDR",
            "customerID": "a3369f9805578ce4e040007f01003947",
            "documentProviderID": "684064e60008cef8c83a79fdb7e151ca",
            "externalIntegrationType": "GOOGLE",
            "externalStorageID": "13tOjy9-QlNGojkM2tFsyXr7mE3B7I_Ll",
            "folderID": "69bd581d000191d4f9557c074a73935f",
            "isTopLevelFolder": true,
            "lastSyncDate": "2026-03-20T10:22:21:967-0400",
            "linkedByID": "a336cdc4d91a7d1de040007f010017ed",
            "linkedDate": "2026-03-20T10:22:21:967-0400"
        }
    }
}
```

Key indicators that a folder is linked to external storage:
- `linkedFolderID` is populated
- `linkedFolder.externalIntegrationType` identifies the provider
- `linkedFolder.externalStorageID` is the ID of the folder in the external system
- `linkedFolder.isTopLevelFolder` is `true` if this is the root of the linked folder tree
