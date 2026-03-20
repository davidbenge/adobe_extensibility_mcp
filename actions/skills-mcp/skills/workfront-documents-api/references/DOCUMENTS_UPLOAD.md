# Workfront Documents API — Upload Pattern

## 2-Step Upload Process

Uploading a document to Workfront requires TWO steps:
1. **Upload the file** → receive a temporary `handle`
2. **Create the document record** → link the handle to a Workfront object

## Step 1: Upload File (get handle)

```http
POST /attask/api/v21.0/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

[form-data: uploadedFile = <file binary>]
```

Response:
```json
{
    "data": {
        "handle": "abc123xyz-handle-value"
    }
}
```

**Handle is temporary** — use it in step 2 immediately. If it expires, re-upload.

## Step 2: Create Document Record

```http
POST /attask/api/v21.0/document
Content-Type: application/json
Authorization: Bearer {token}

{
    "name": "filename.pdf",
    "handle": "abc123xyz-handle-value",
    "docObjCode": "PROJ",
    "objID": "project-id-here"
}
```

## docObjCode Values

| docObjCode | Object type to link document to |
|-----------|--------------------------------|
| `PROJ` | Project |
| `TASK` | Task |
| `OPTASK` | Issue/Request |
| `PORT` | Portfolio |
| `PRGM` | Program |
| `TMPL` | Template |

## Full Node.js Example (FormData + fetch)

```javascript
const FormData = require('form-data')
const fs = require('fs')

async function uploadDocument({ filePath, fileName, docObjCode, objId }, token, domain) {
    const base = `https://${workfront_host}/attask/api/v21.0`

    // Step 1: Upload file
    const form = new FormData()
    form.append('uploadedFile', fs.createReadStream(filePath), { filename: fileName })

    const uploadRes = await fetch(`${base}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, ...form.getHeaders() },
        body: form
    })
    const uploadData = await uploadRes.json()
    if (!uploadData.data?.handle) throw new Error('Upload failed: no handle returned')

    const handle = uploadData.data.handle

    // Step 2: Create document record
    const docRes = await fetch(`${base}/document`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fileName, handle, docObjCode, objID: objId })
    })
    const docData = await docRes.json()
    if (docData.error) throw new Error(docData.error.message)
    return docData.data  // Document object with ID, name, downloadURL, etc.
}
```

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `handle not found` | Handle expired or invalid | Re-upload the file |
| `handle already used` | Handle used twice | Re-upload, each handle is single-use |
| `Missing required field` | docObjCode or objID missing | Ensure both fields are in step 2 |
