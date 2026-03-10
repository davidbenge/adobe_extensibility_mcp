# Workfront Documents API — Document Metadata

## DOCU Field Reference

| API Field | Type | Description |
|-----------|------|-------------|
| `ID` | string | Document ID (GUID) |
| `name` | string | Document name |
| `docObjCode` | string | Object type document is linked to |
| `objID` | string | ID of the linked object |
| `currentVersionID` | string | ID of the current DOCV version |
| `downloadURL` | string | URL to download the current version |
| `fileExtension` | string | File extension (pdf, docx, etc.) |
| `fileSize` | number | File size in bytes |
| `createdDate` | datetime | When document was created |
| `lastUpdateDate` | datetime | When document was last updated |

## Get Document with Version Details

```http
GET /attask/api/v21.0/document/{id}?fields=*,currentVersion:*
```

## List Documents on an Object

```http
# All documents on a project
GET /attask/api/v21.0/document/search?docObjCode=PROJ&objID={projectId}&fields=name,fileExtension,fileSize,downloadURL

# All documents on a task
GET /attask/api/v21.0/document/search?docObjCode=TASK&objID={taskId}&fields=name,fileExtension,downloadURL
```

## Download a Document

1. Get the `downloadURL` from the document object
2. GET that URL with your Bearer token

```javascript
async function downloadDocument(documentId, token, domain) {
    // Step 1: Get document metadata including downloadURL
    const metaRes = await fetch(
        `https://${domain}.my.workfront.com/attask/api/v21.0/document/${documentId}?fields=downloadURL,name,fileExtension`,
        { headers: { 'Authorization': `Bearer ${token}` } }
    )
    const { data: doc } = await metaRes.json()

    // Step 2: Download the file
    const fileRes = await fetch(doc.downloadURL, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    return { buffer: await fileRes.arrayBuffer(), fileName: doc.name, extension: doc.fileExtension }
}
```

## Get Temporary Cloud URL (v21)

v21 added a `getTemporaryCloudURL` action for generating short-lived download URLs:

```http
PUT /attask/api/v21.0/document/{id}?action=getTemporaryCloudURL
Authorization: Bearer {token}
```

Response includes a time-limited URL that does not require Bearer token — useful for sharing.

## Move Document to Different Object

```http
PUT /attask/api/v21.0/document/{id}
Content-Type: application/json

{
    "docObjCode": "TASK",
    "objID": "new-task-id"
}
```
