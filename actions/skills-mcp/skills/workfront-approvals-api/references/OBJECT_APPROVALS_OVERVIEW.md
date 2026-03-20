# Object Approvals — Overview

> Object approvals apply to **Projects, Tasks, and Issues** in Workfront.
> They are NOT the Universal Approval Service (UAS) — for document/asset approvals see `UNIVERSAL_APPROVAL_SERVICE_OVERVIEW.md`.

## What Are Object Approvals?

Object approvals are status-based approval workflows attached directly to projects, tasks, and issues via **Approval Processes**. When an object's status is changed to a status that triggers an approval, the object enters a pending approval state and designated approvers must act on it before the status change is finalized.

This system uses the standard Workfront REST API (`/attask/api/v21.0/`) — not a separate endpoint.

## How They Work

```
1. An Approval Process is attached to an object (project/task/issue)
2. A user changes the object's status to one that requires approval
3. The object enters "Pending Approval" state
4. Designated approvers are notified
5. An approver calls approveApproval, rejectApproval, or recallApproval
6. The status change is finalized (or rejected/recalled)
```

## Supported Object Types

| Object | objCode | Approval Actions Available |
|--------|---------|--------------------------|
| Project | `PROJ` | `approveApproval`, `rejectApproval`, `recallApproval` |
| Task | `TASK` | `approveApproval`, `rejectApproval`, `recallApproval` |
| Issue | `OPTASK` | `approveApproval`, `rejectApproval`, `recallApproval` |

## Key Related Objects

| Object | objCode | Description |
|--------|---------|-------------|
| `ApprovalProcess` | `ARVPRC` | Reusable approval process definitions — query these to get IDs to attach to objects |
| `ApprovalStep` | `ARVSTP` | A step within an approval process |

## Checking Whether an Object is Pending Approval

The simplest check is the object's `status` field. If the status value ends in `:A`, the object is pending approval. If it does not end in `:A`, it is not pending approval.

```
"CPL:A"   → pending approval for the "Complete" status
"PLN:A"   → pending approval for the "Planning" status
"CPL"     → not pending approval (status finalized)
```

```http
GET https://<workfront_host>/attask/api/v21.0/project/{id}?fields=status
Authorization: Bearer {token}
```

```javascript
function isPendingApproval(status) {
    return status?.endsWith(':A') ?? false
}
```

## Authentication

Object approvals use the standard Workfront REST API authentication — Bearer token (OAuth 2.0) or API key. No separate IMS credentials required.

```http
Authorization: Bearer {token}
```

## When to Load Reference Files

| Task | Load |
|------|------|
| Approve, reject, or recall an approval on an object | `OBJECT_APPROVALS_ACTIONS.md` |
| Find approval process IDs, query approver status | `OBJECT_APPROVALS_PROCESSES.md` |
