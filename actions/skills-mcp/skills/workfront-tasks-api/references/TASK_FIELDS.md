# Workfront Tasks API — Task Fields

## Core Fields

| API Field | Type | Description |
|-----------|------|-------------|
| `ID` | string | Unique task ID (GUID) |
| `name` | string | Task name |
| `description` | string | Task description (HTML) |
| `status` | string | Status code: NEW, INP, CPL, etc. |
| `percentComplete` | number | 0–100 |
| `plannedStartDate` | datetime | ISO 8601 format |
| `plannedCompletionDate` | datetime | ISO 8601 format |
| `actualStartDate` | datetime | When work actually started |
| `actualCompletionDate` | datetime | When task was completed |
| `priority` | number | 0=None, 1=Urgent, 2=High, 3=Normal, 4=Low |
| `durationMinutes` | number | Duration in minutes |
| `plannedHours` | number | Planned effort hours |
| `actualHours` | number | Logged hours |
| `workRequired` | number | Total work required in minutes |
| `actualWorkRequiredDouble` | number | v21: hours (replaces legacy minutes field) |

## Assignment Fields

| API Field | Type | Description |
|-----------|------|-------------|
| `assignedTo` | object | Primary assignee user object |
| `assignedTo:ID` | string | Assignee user ID |
| `assignedTo:name` | string | Assignee full name |
| `assignments` | array | All assignments (supports multi-assign) |

## Hierarchy Fields

| API Field | Type | Description |
|-----------|------|-------------|
| `projectID` | string | Parent project ID |
| `project` | object | Parent project reference |
| `project:name` | string | Parent project name |
| `parentID` | string | Parent task ID (for subtasks) |
| `parent` | object | Parent task reference |
| `children` | array | Subtask references |
| `numberOfChildren` | number | Count of subtasks |

## Status Codes

| Code | Label |
|------|-------|
| `NEW` | New |
| `INP` | In Progress |
| `CPL` | Complete |
| `APP` | Pending Approval |
| `PLA` | Planning |
| `RDY` | Ready to Start |
| `ONH` | On Hold |

## Field Selection Examples

```http
# Core task with assignment and dates
GET /attask/api/v21.0/task/{id}?fields=name,status,percentComplete,assignedTo:name,project:name,plannedStartDate,plannedCompletionDate

# Full task with hierarchy
GET /attask/api/v21.0/task/{id}?fields=*,parent:name,children[ID,name,status]

# Subtasks for a parent task
GET /attask/api/v21.0/task/search?parentID={parentId}&fields=name,status,percentComplete,assignedTo:name
```

## Task Object Reference URL

To retrieve the complete structure of the Task object — including all fields, references, collections, actions, search parameters, and supported operations — fetch the following metadata URL:

```
https://testdrive.testdrive.workfront.com/attask/api/v21.0/task/metadata
```
