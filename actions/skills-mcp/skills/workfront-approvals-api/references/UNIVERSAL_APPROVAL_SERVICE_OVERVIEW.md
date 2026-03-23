# Workfront Universal Approval Service — Overview

> This document covers the **Universal Approval Service (UAS)** only.
> The UAS is used exclusively for **Document approvals** in Workfront.
> It is NOT used for approving Projects, Tasks, or Issues — those use the Legacy Work Item Approval system via the standard REST API.
> For legacy approvals, see `LEGACY_WORK_ITEM_APPROVALS.md`.

## What is the Universal Approval Service?

The Universal Approval Service (also called Unified Approvals) is a distinct REST API for managing document review and approval workflows in Workfront. It is a complete redesign of the legacy document approval system and is the required approach for all new document approval integrations.

Key characteristics:
- **Document-scoped only** — approvals are tied to a specific Document Version (`DOCV`), not to projects, tasks, or issues
- **Single-stage only** — these endpoints only support single-stage approvals; they will not work with multi-stage approvals
- **Separate API endpoint** — not the standard `/attask/api/` REST endpoint
- **Adobe IMS authentication** — uses OAuth 2.0 Server-to-Server tokens, not Workfront session tokens
- **Two participant roles** — Reviewers (feedback only) and Approvers (binding decision required)
- **Technical account scope** — when authenticating as a technical account, you can only act as that account; you cannot act on behalf of another user
- **Version-specific** — each approval is tied to one document version; if a document is revised, upload a new version and create a new approval for the new `documentVersionId`; the previous approval remains on record

## API Reference

Full API spec: `https://developer.adobe.com/workfront-apis/api/approvals/unified-approvals`

## Base URL

All UAS requests use this base URL:

```
https://workfront.adobe.io/unified-approvals/public/api/v1/approvals
```

Approvals are addressed by **asset type** and **asset ID** (the document version ID). For document versions, `assetType` is always `DOCV`.

### URL Patterns

| Operation | Method | Path |
|-----------|--------|------|
| Get an approval | `GET` | `/DOCV/{documentVersionId}` |
| Create or update an approval | `PUT` | `/DOCV/{documentVersionId}/stages` |
| Make a decision | `PUT` | `/DOCV/{documentVersionId}/decisions` |
| Add or update participants | `PUT` | `/DOCV/{documentVersionId}/participants` |
| Delete participants | `DELETE` | `/DOCV/{documentVersionId}/participants` |
| Lock a stage | `PUT` | `/DOCV/{documentVersionId}/stages/{stageId}/lock` |
| Unlock a stage | `PUT` | `/DOCV/{documentVersionId}/stages/{stageId}/unlock` |

Full example:
```
GET https://workfront.adobe.io/unified-approvals/public/api/v1/approvals/DOCV/673fc29b0006af515e33732d1ebdc39a
```

## Authentication & Required Headers

The UAS requires an Adobe IMS OAuth 2.0 Server-to-Server access token. Every request must include these four headers:

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <access_token>` — IMS token |
| `x-gw-subdomain` | Yes | Customer's Workfront subdomain (e.g. `your-workfront-subdomain`) |
| `x-api-key` | Yes | API key generated from Adobe Developer Console |
| `x-request-id` | Yes | A unique UUID for the request |

```javascript
const UAS_BASE = 'https://workfront.adobe.io/unified-approvals/public/api/v1/approvals'

function uasHeaders(token, apiKey, subdomain) {
    return {
        'Authorization': `Bearer ${token}`,
        'x-gw-subdomain': subdomain,
        'x-api-key': apiKey,
        'x-request-id': crypto.randomUUID(),
        'Content-Type': 'application/json'
    }
}
```

### Obtaining an IMS Token

```javascript
async function getImsToken(clientId, clientSecret, scopes) {
    const res = await fetch('https://ims-na1.adobelogin.com/ims/token/v3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
            scope: scopes  // e.g. 'openid,AdobeID,workfront'
        })
    })
    const data = await res.json()
    return data.access_token
}
```

### Setup Steps

1. Create a Server-to-Server credential in [Adobe Developer Console](https://developer.adobe.com/console/)
2. Add the Workfront API to the project
3. A Technical Account email is automatically generated — this becomes a Workfront user
4. Elevate the Technical Account to the appropriate access level in Workfront Admin Console if needed
5. Include all four required headers on every UAS request

## Approval Response Object

All endpoints return the same approval object shape:

| Field | Type | Description |
|-------|------|-------------|
| `approvalGuid` | string | Unique approval identifier |
| `assetId` | string | Document version ID |
| `assetType` | string | Always `"DOCV"` |
| `creatorId` | string | IMS user ID of the creator |
| `customerDomain` | string | Workfront domain (e.g. `example.workfront.com`) |
| `templateId` | string | Template used (if any) |
| `productId` | string | Always `"workfront"` |
| `imsOrgId` | string | Adobe IMS organization ID |
| `status` | string | Overall approval status (see `UAS_STATUS_AND_DECISIONS.md`) |
| `isLocked` | boolean | Whether the approval is locked |
| `decisionDate` | datetime | When the final decision was made |
| `createdAt` | datetime | When the approval was created |
| `updatedAt` | datetime | When the approval was last updated |
| `stages` | array | Stage details |
| `structure` | array | Stage structure configuration |

## Scope Boundary

| Use Case | Correct System |
|----------|---------------|
| Approve a document or asset | Universal Approval Service (this skill) |
| Approve a project, task, or issue | Legacy Work Item Approvals (`LEGACY_WORK_ITEM_APPROVALS.md`) |
| Proof-based review workflows | ProofHQ API (`https://api.proofhq.com/`) |

## When to Load Reference Files

| Task | Load |
|------|------|
| Create, update, or use templates; lock/unlock stages | `UAS_TEMPLATES_AND_STAGES.md` |
| Add or remove reviewers and approvers | `UAS_PARTICIPANTS.md` |
| Read approval status or individual decisions; make a decision | `UAS_STATUS_AND_DECISIONS.md` |
