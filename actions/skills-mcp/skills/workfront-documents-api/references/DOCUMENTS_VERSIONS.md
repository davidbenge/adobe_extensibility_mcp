# Workfront Documents API — Document Versions

## Document Version (DOCV) Object

Each version of a document is a DOCV object. The parent DOCU object tracks the current version via `currentVersionID`.

## Upload a New Version

Same 2-step pattern as initial upload, but POST to `/docv` in step 2:

```javascript
async function uploadNewVersion({ documentId, filePath, fileName }, token, domain) {
    const base = `https://${workfront_host}/attask/api/v21.0`

    // Step 1: Upload file to get handle
    const form = new FormData()
    form.append('uploadedFile', fs.createReadStream(filePath), { filename: fileName })

    const uploadRes = await fetch(`${base}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, ...form.getHeaders() },
        body: form
    })
    const { data: { handle } } = await uploadRes.json()

    // Step 2: Create new version
    const versionRes = await fetch(`${base}/docv`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentID: documentId, handle, fileName })
    })
    const versionData = await versionRes.json()
    if (versionData.error) throw new Error(versionData.error.message)
    return versionData.data  // DOCV object
}
```

## Get All Versions for a Document

```http
GET /attask/api/v21.0/document/{id}?fields=*,versions:*
```

Response includes `versions` array and `currentVersionID`.

## List Versions via Search

```http
GET /attask/api/v21.0/docv/search?documentID={docId}&fields=ID,version,fileName,docSize,enteredByID,entryDate
```

## DOCV Fields

| API Field | Type | Description |
|-----------|------|-------------|
| `ID` | string | Version ID (GUID) |
| `documentID` | string | Parent document ID |
| `versionNum` | number | Version number (sequential) |
| `fileName` | string | File name for this version |
| `docSize` | number | File size in bytes |
| `ext` | string | File extension |
| `enteredByID` | string | User who uploaded this version |
| `entryDate` | datetime | When this version was uploaded |

## Get Current Version Details

```http
GET /attask/api/v21.0/document/{id}?fields=currentVersionID,currentVersion:*
```
