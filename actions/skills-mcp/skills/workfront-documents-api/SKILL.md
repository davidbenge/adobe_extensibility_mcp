---
name: workfront-documents-api
description: >
  Use for Workfront Document (DOCU) operations: uploading files, creating document
  objects linked to projects/tasks/issues, managing document versions (DOCV),
  retrieving metadata and download URLs, and working with document folders (DOCFDR).
  Trigger phrases: upload document, attach file, document version, DOCU objCode,
  download file, document folder, 2-step upload, file upload to Workfront.
  Covers the 2-step upload pattern (upload → create). Do NOT use for proofing
  workflows (separate Workfront Proof API).
metadata:
  author: adobe-enterprise-architecture
  version: "1.0"
---

# Workfront Documents API

## Role
Specialist for Workfront Document (DOCU) object operations. Knows the 2-step upload pattern, document linking to projects/tasks/issues, version management, metadata retrieval, and folder/external integration patterns.

## When to Load References

| Task | Load |
|------|------|
| Upload a file and attach to a Workfront object | DOCUMENTS_UPLOAD.md |
| Add a new version or list versions | DOCUMENTS_VERSIONS.md |
| Get document metadata or download URL | DOCUMENTS_METADATA.md |
| Work with document folders or external storage | DOCUMENTS_FOLDERS.md |

## Constitution & Impl-Log

> Skip any file below that does not exist in this project — not all projects use all layers.

### Design Principles (read-only, if `docs/design-principles/` exists)
- `docs/design-principles/architecture.md` — approved patterns, banned patterns; read before any structural decision
- `docs/design-principles/backend.md` — handler structure, error patterns, service boundaries; read before writing implementation code

### Impl-Log (if `docs/impl-log/` exists)
**Before implementing:**
- Read `docs/impl-log/backend/index.md` — current backend state (required before writing new code)
- Scan `docs/impl-log/backend/log.md` header lines — prior decisions relevant to this task

**At task completion:**
- Update `docs/impl-log/backend/index.md` in-place to reflect new current state
- Append an entry to `docs/impl-log/backend/log.md`

## Core Concepts

- **2-step upload:** First POST to `/upload` to get a handle, then POST to `/document` to create the record
- **Handles are temporary:** Re-upload if the handle becomes stale before step 2
- **Object linking:** Use `docObjCode` + `objID` to link a document to a PROJ, TASK, OPTASK, PORT, PRGM, or TMPL
- **Versions:** Each upload of a new file version creates a DOCV (Document Version) object
- **Download:** Retrieve `downloadURL` field, then GET that URL with Bearer token
- **Not for proofing:** Workfront Proof workflows use a separate API

## Quick Reference

| Task | Load |
|------|------|
| Upload file + create document | DOCUMENTS_UPLOAD.md |
| Add new version, list versions | DOCUMENTS_VERSIONS.md |
| Get metadata, download URL | DOCUMENTS_METADATA.md |
| Document folders, external storage | DOCUMENTS_FOLDERS.md |
