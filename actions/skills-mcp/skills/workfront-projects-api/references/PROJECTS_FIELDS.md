# Workfront Projects API — Project Fields

## Core Fields

| API Field | Type | Description |
|-----------|------|-------------|
| `ID` | string | Unique project ID (GUID) |
| `name` | string | Project name |
| `description` | string | Project description (HTML) |
| `status` | string | Status code: PLN, CUR, CPL, DED |
| `condition` | string | On Target, At Risk, In Trouble |
| `conditionType` | string | `manual` or `auto` |
| `percentComplete` | number | 0–100 |
| `priority` | number | 0=None, 1=Urgent, 2=High, 3=Normal, 4=Low |
| `referenceNumber` | number | Human-readable reference number |
| `actualWorkRequiredDouble` | number | v21: total hours (replaces legacy minutes field) |

## Date Fields

| API Field | Type | Description |
|-----------|------|-------------|
| `plannedStartDate` | datetime | ISO 8601 |
| `plannedCompletionDate` | datetime | ISO 8601 |
| `actualStartDate` | datetime | When work actually started |
| `actualCompletionDate` | datetime | When project was completed |

## Ownership & Hierarchy Fields

| API Field | Type | Description |
|-----------|------|-------------|
| `ownerID` | string | Project owner user ID |
| `owner:name` | string | Project owner full name |
| `groupID` | string | Group/department ID |
| `portfolioID` | string | Parent portfolio ID |
| `portfolio:name` | string | Parent portfolio name |
| `programID` | string | Parent program ID |
| `program:name` | string | Parent program name |
| `milestonePathID` | string | Applied milestone path ID |
| `templateID` | string | Template used to create this project |

## Status Codes

| Code | Label | Description |
|------|-------|-------------|
| `PLN` | Planning | Project is in planning, not started |
| `CUR` | Current | Project is active |
| `CPL` | Complete | Project is complete |
| `DED` | Dead | Project is cancelled/dead |

## Condition Values

| Value | Description |
|-------|-------------|
| `On Target` | Project is on schedule |
| `At Risk` | Project may miss targets |
| `In Trouble` | Project is behind/in trouble |

Note: Condition is only writable when `conditionType` is `manual`.

## Field Selection Example

```http
GET /attask/api/v21.0/proj/{id}?fields=name,status,condition,percentComplete,owner:name,portfolio:name,program:name,plannedStartDate,plannedCompletionDate
```

## Project Object Reference URL

To retrieve the complete structure of the Project object — including all fields, references, collections, actions, search parameters, and supported operations — fetch the following metadata URL:

```
https://testdrive.testdrive.workfront.com/attask/api/v21.0/project/metadata
```
