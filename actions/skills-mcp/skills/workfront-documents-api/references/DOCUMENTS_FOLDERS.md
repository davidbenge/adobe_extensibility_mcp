# Workfront Documents API — Document Folders

## Document Folder (DOCFDR) Object

Document folders organize documents within Workfront. Each folder is scoped to an object (project, task, etc.).

## List Document Folders

```http
GET /attask/api/v21.0/docfdr/search?fields=*
```

## List Folders on a Specific Object

```http
GET /attask/api/v21.0/docfdr/search?fields=*&projectID={id}
```

## DOCFDR Fields

| API Field | Type | Description |
|-----------|------|-------------|
| `ID` | string | Folder ID (GUID) |
| `name` | string | Folder name |
| `parentID` | string | Parent folder ID (null if top-level) |

The type of object a folder is associated with is determined by the object type ID field being populated.
For example, a folder that exists on a project will have a value for `projectID`. A task level folder will have a `taskID`, and so on. More than one object ID will not be populated simultaneously.

## External Document Integrations

Workfront supports linking external storage providers (Box, Dropbox, Google Drive) as document sources.

### Supported External Integration Types

| Type | Description |
|------|-------------|
| `BOX` | Box cloud storage |
| `DROPBOX` | Dropbox cloud storage |
| `GOOGLEDRIVE` | Google Drive |

### Link an External Folder

External folders are linked via the `documentProviderID` — the registered external provider:

```http
POST /attask/api/v21.0/docfdr
Content-Type: application/json

{
    "name": "My Box Folder",
    "docObjCode": "PROJ",
    "objID": "project-id-here",
    "documentProviderID": "box-provider-id",
    "externalIntegrationType": "BOX",
    "extRefID": "box-folder-id"
}
```

## Document Webhooks API (for External Storage Providers)

If you are building a custom external document storage integration, Workfront calls your webhook endpoints:

| Endpoint | Purpose |
|----------|---------|
| `GET /metadata` | Get metadata for a file or folder |
| `GET /files` | List files in a folder |
| `GET /search` | Search for files |
| `GET /download` | Download file content |
| `POST /uploadInit` | Initialize a chunked upload |
| `POST /upload` | Upload file chunk |
| `GET /thumbnail` | Get thumbnail image |

Your external storage webhook must implement these endpoints and be registered with Workfront as a Document Provider.
