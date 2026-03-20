# Workfront Approvals API — Overview

## Two Approval Systems

Workfront has two active approval systems. Know which one you need:

| System | Use For | API |
|--------|---------|-----|
| **Unified Approvals** | Document/asset review and approval workflows | Unified Approvals API (separate endpoint) |
| **Legacy Work Item Approvals** | Project/task/issue status-based approvals | Standard REST API (`/attask/api/v21.0/`) |

Legacy document approvals are being removed. Build new integrations on Unified Approvals.

## Unified Approvals API

The Unified Approvals API is a distinct REST API — NOT the standard `/attask/api/` endpoint.

- **API spec:** `https://developer.adobe.com/workfront-apis/api/approvals/unified-approvals/`
- **Auth:** Adobe IMS OAuth 2.0 Server-to-Server (Bearer token)
- **Credentials:** Created in Adobe Developer Console → automatically creates a Technical Account user in Workfront

## Authentication Setup

1. Create a Server-to-Server credential in [Adobe Developer Console](https://developer.adobe.com/console/)
2. Add the Workfront API to the project
3. A Technical Account email is generated — this becomes a Workfront user
4. Elevate the Technical Account to appropriate access level in Workfront Admin Console if needed
5. Exchange credentials for an IMS access token:

```javascript
async function getImsToken(clientId, clientSecret, imsOrg, scopes) {
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

Use `Authorization: Bearer <access_token>` on all Unified Approvals API requests.

## Key Object Types

| Object | Description |
|--------|-------------|
| **Document Approval** | The top-level approval workflow for a document version |
| **Document Version** | A specific version of a document — approvals are version-specific |
| **Approval Stage** | A phase in a multi-stage approval workflow |
| **Approval Stage Participant** | A reviewer or approver assigned to a stage |
| **Approval Template** | A reusable configuration for approval workflows |
| **Document** | The parent document object (DOCU in standard REST API) |

## Legacy Work Item Approval Actions (Standard REST API)

For projects, tasks, and issues with attached approval processes, use the standard REST API with `action` parameter:

```http
# Approve a pending approval
PUT /attask/api/v21.0/project/{id}?action=approveApproval
Authorization: Bearer {token}

# Reject a pending approval
PUT /attask/api/v21.0/project/{id}?action=rejectApproval

# Recall (withdraw) a submitted approval
PUT /attask/api/v21.0/project/{id}?action=recallApproval
```

Same pattern works for `/task/{id}` and `/issue/{id}`.

## Approval Process Objects (Standard REST API)

| Object | API Endpoint | Description |
|--------|-------------|-------------|
| `ApprovalProcess` | `/attask/api/v21.0/approval` | Reusable approval process definition |
| `ApproverStatus` | `/attask/api/v21.0/approverstatus` | Individual approver status on a work item |

```http
# List approval processes for tasks
GET /attask/api/v21.0/approval/search?objCode=TASK&fields=name,description

# Get approver statuses for a project
GET /attask/api/v21.0/approverstatus/search?projectID={id}&fields=approverID,status,approver:name
```
