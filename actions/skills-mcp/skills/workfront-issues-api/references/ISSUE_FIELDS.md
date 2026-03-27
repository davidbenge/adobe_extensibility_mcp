# Workfront Issues API — Issue Fields

## CRITICAL: objCode is OPTASK

Issues/Requests use objCode `OPTASK`. The API endpoint is `/issue` but the object code used in forms, subscriptions, and searches is always `OPTASK` — never "ISSUE".

## Core Fields

| API Field | Type | Description |
|-----------|------|-------------|
| `ID` | string | Unique issue ID (GUID) |
| `name` | string | Issue name/title |
| `description` | string | Issue description (HTML) |
| `status` | string | Status code: NEW, INP, AWA, CPL, etc. |
| `priority` | number | 0=None, 1=Urgent, 2=High, 3=Normal, 4=Low |
| `severity` | string | BUG_SEVERITY_1 through BUG_SEVERITY_5 |
| `plannedStartDate` | datetime | ISO 8601 |
| `plannedCompletionDate` | datetime | ISO 8601 |
| `actualStartDate` | datetime | When work started |
| `actualCompletionDate` | datetime | When resolved |
| `age` | number | Days since creation |
| `isHelpDesk` | boolean | Is this a request queue issue |
| `referenceNumber` | number | Human-readable reference number |

## Assignment Fields

| API Field | Type | Description |
|-----------|------|-------------|
| `assignedTo` | object | Primary assignee |
| `assignedTo:ID` | string | Assignee user ID |
| `assignedTo:name` | string | Assignee full name |
| `assignedTo:emailAddr` | string | Assignee email |
| `team` | object | Assigned team (if team assignment) |
| `role` | object | Assigned job role |

## Hierarchy Fields

| API Field | Type | Description |
|-----------|------|-------------|
| `projectID` | string | Parent project ID |
| `project:name` | string | Parent project name |
| `queueTopicID` | string | Request queue topic ID |
| `resolveTask` | object | Linked resolving task (if applicable) |
| `resolveProject` | object | Linked resolving project |

## Status Codes

| Code | Label |
|------|-------|
| `NEW` | New |
| `INP` | In Progress |
| `AWA` | Awaiting Feedback |
| `PRA` | Pending Approval |
| `APP` | Approved |
| `CPL` | Closed/Complete |
| `REJ` | Rejected |
| `RPN` | Re-Opened |

## Severity Codes

| Code | Label |
|------|-------|
| `BUG_SEVERITY_1` | Cosmetic |
| `BUG_SEVERITY_2` | Causes Confusion |
| `BUG_SEVERITY_3` | Workaround Available |
| `BUG_SEVERITY_4` | No Workaround |
| `BUG_SEVERITY_5` | Fatal |

## Issue Object Reference URL

To retrieve the complete structure of the Issue object — including all fields, references, collections, actions, search parameters, and supported operations — fetch the following metadata URL:

```
https://testdrive.testdrive.workfront.com/attask/api/v21.0/optask/metadata
```
