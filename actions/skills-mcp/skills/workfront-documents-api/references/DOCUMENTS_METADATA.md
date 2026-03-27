# Workfront Documents API — Document Metadata

The Document (`DOCU`) object represents a file attached to a Workfront object (project, task, issue, etc.). Documents track versions, approvals, folder placement, and download URLs. The parent object is identified by `docObjCode` and `objID`.

## Object

| Property | Value |
|----------|-------|
| Name | Document |
| objCode | `DOCU` |

## Fields

| Name | Label | Field Type | Editable |
|------|-------|------------|----------|
| `ID` | ID | string | false |
| `accessorIDs` | Accessor IDs | string[] | false |
| `advancedProofingOptions` | Advanced Proofing Options | string | false |
| `categoryID` | Category ID | string | true |
| `checkOutTimestamp` | Check Out Timestamp | dateTime | false |
| `checkedOutByID` | Checked Out By ID | string | false |
| `createProof` | Create Proof | boolean | false |
| `currentVersionID` | Current Version ID | string | false |
| `customerID` | Customer ID | string | false |
| `description` | Description | string | true |
| `docObjCode` | Document Type | string | false |
| `documentProviderID` | Document Provider ID | string | false |
| `documentRequestID` | Document Request ID | string | false |
| `downloadURL` | Download URL | string | false |
| `extRefID` | External Reference ID | string | true |
| `externalIntegrationType` | External Integration Type | string | false |
| `fileType` | File Type | string | false |
| `folderIDs` | Folder IDs | string[] | false |
| `handle` | Handle | string | false |
| `hasNotes` | Has Notes | boolean | false |
| `isPrivate` | Is Private | boolean | false |
| `isPublic` | Is Public | boolean | false |
| `iterationID` | Iteration ID | string | false |
| `lastModDate` | Last Modified | dateTime | false |
| `lastNoteID` | Last Note ID | string | false |
| `lastSyncDate` | Last Sync Date | dateTime | false |
| `lastUpdateDate` | Last Update Date | dateTime | false |
| `lastUpdatedByID` | Last Updated By ID | string | false |
| `lastVersionNum` | Last Version Number | string | false |
| `name` | Name | string | true |
| `objID` | Obj ID | string | false |
| `opTaskID` | Issue ID | string | false |
| `ownerID` | Owner ID | string | false |
| `portfolioID` | Portfolio ID | string | false |
| `previewURL` | Preview URL | string | false |
| `programID` | Program ID | string | false |
| `projectID` | Project ID | string | false |
| `publicToken` | Public Token | string | false |
| `referenceNumber` | Reference Number | int | false |
| `referenceObjCode` | Reference Obj Code | string | false |
| `referenceObjID` | Reference Obj ID | string | false |
| `referenceObjectClosed` | Reference Object Closed | string | false |
| `referenceObjectName` | Reference Object Name | string | false |
| `releaseVersionID` | Release Version ID | string | false |
| `securityRootID` | Security Root ID | string | false |
| `securityRootObjCode` | Security Root Obj Code | string | false |
| `taskID` | Task ID | string | false |
| `templateID` | Template ID | string | false |
| `templateTaskID` | Template Task ID | string | false |
| `topDocObjCode` | Top Document Type | string | false |
| `topObjID` | Top Obj ID | string | false |
| `userID` | User ID | string | false |

### Field Examples

```http
# Get a document with all fields and all currentVersion reference fields
GET /attask/api/v21.0/docu/{ID}?fields=*,currentVersion:*

# Get all documents on a specific project
GET /attask/api/v21.0/docu/search?projectID={projectID}&fields=*
```

## References

References are related objects accessible via the `fields` parameter using colon notation.

| Name | Label | objCode | Field Type |
|------|-------|---------|------------|
| `category` | Category | CTGY | Category |
| `checkedOutBy` | Checked Out By | USER | User |
| `currentVersion` | Current Version | DOCV | DocumentVersion |
| `customer` | Customer | CUST | Customer |
| `documentRequest` | Document Request | DOCREQ | DocumentRequest |
| `iteration` | Iteration | ITRN | Iteration |
| `lastNote` | Last Note | NOTE | Note |
| `lastUpdatedBy` | Last Updated By | USER | User |
| `opTask` | Issue | OPTASK | OpTask |
| `owner` | Owner | USER | User |
| `portfolio` | Portfolio | PORT | Portfolio |
| `program` | Program | PRGM | Program |
| `project` | Project | PROJ | Project |
| `releaseVersion` | Release Version | DOCV | DocumentVersion |
| `task` | Task | TASK | Task |
| `template` | Template | TMPL | Template |
| `templateTask` | Template Task | TTSK | TemplateTask |
| `user` | User | USER | User |

### Reference Example

```http
GET /attask/api/v21.0/docu/{ID}?fields=currentVersion:*,project:name,task:name,owner:name
GET /attask/api/v21.0/docu/{ID}?fields=*,currentVersion:*,category:name
```

## Collections

Collections are objects contained within the document, accessed the same way as references.

| Name | Label | objCode | Field Type |
|------|-------|---------|------------|
| `accessRules` | Access Rules | ACSRUL | AccessRule |
| `approvals` | Approvals | DOCAPL | DocumentApproval |
| `awaitingApprovals` | Awaiting Approvals | AWAPVL | AwaitingApproval |
| `folders` | Folders | DOCFDR | DocumentFolder |
| `groups` | Groups | GROUP | Group |
| `objectCategories` | Object Categories | OBJCAT | ObjectCategory |
| `subscribers` | Subscribers | USER | User |
| `versions` | Versions | DOCV | DocumentVersion |

### Collection Example

```http
GET /attask/api/v21.0/docu/{ID}?fields=versions:*
GET /attask/api/v21.0/docu/{ID}?fields=approvals:*,folders:*
```

## Actions

Actions are invoked via PUT to the document ID URL with an `action` parameter.

| Name |
|------|
| `calculateDataExtension` |
| `checkIn` |
| `checkOut` |
| `completeLargeDocument` |
| `createLargeDocument` |
| `createLinkedProofVersion` |
| `createProof` |
| `createProofRest` |
| `getDocumentProofTemplate` |
| `getProofRecipients` |
| `getProofStages` |
| `getProofTemplate` |
| `getTemporaryCloudURL` |
| `getTotalSizeForDocuments` |
| `isLinkedDocument` |
| `isProofAutoGenrationEnabled` |
| `move` |
| `moveToFolder` |
| `sendDocumentsToExternalProvider` |
| `unlinkDocuments` |

### Action Example

```http
PUT /attask/api/v21.0/docu/{ID}?action=checkOut&documentID={ID}
PUT /attask/api/v21.0/docu/{ID}?action=checkIn&documentID={ID}
PUT /attask/api/v21.0/docu/{ID}?action=moveToFolder&documentID={ID}&folderID={folderID}
```

## Operations

The following operations are supported on the `DOCU` object:

- `count` — Count matching documents
- `delete` — Delete a document (DELETE)
- `edit` — Update document fields (PUT)
- `get` — Retrieve a document by ID (GET)
- `report` — Generate aggregate reports
- `search` — Search documents with filters (GET /search)

## Download a Document

1. Get the `downloadURL` from the document object
2. GET that URL with your Bearer token

```javascript
async function downloadDocument(documentId, token) {
    // Step 1: Get document metadata including downloadURL
    const metaRes = await fetch(
        `${workfront_host}/attask/api/v21.0/docu/${documentId}?fields=downloadURL,name,currentVersion:ext`,
        { headers: { 'Authorization': `Bearer ${token}` } }
    )
    const { data: doc } = await metaRes.json()

    // Step 2: Download the file
    const fileRes = await fetch(`${workfront_host}${doc.downloadURL}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    return { buffer: await fileRes.arrayBuffer(), fileName: doc.name, extension: doc.currentVersion.ext }
}
```

## Get Temporary Cloud URL (v21)

v21 added a `getTemporaryCloudURL` action for generating short-lived download URLs:

```http
PUT /attask/api/v21.0/docu?action=getTemporaryCloudURL
Authorization: Bearer {token}
Content-Type: application/json
{
    "documentVersionID":"{id}"
}
```

Response includes a time-limited URL that does not require Bearer token — useful for sharing.

## Move Document to Different Object

```http
PUT /attask/api/v21.0/docu/{id}?action=move
Content-Type: application/json

{
    "docObjCode": "TASK",
    "objID": "new-task-id"
}
```

## Uploading a New Document or Document Version

Instructions for uploading new documents or adding new document versions are located in `DOCUMENTS_UPLOAD.md`.
