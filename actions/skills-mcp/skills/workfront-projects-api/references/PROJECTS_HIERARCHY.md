# Workfront Projects API — Portfolio, Program, and Milestone Hierarchy

## Hierarchy

```
Portfolio (PORT)
  └── Program (PRGM)
        └── Project (PROJ)
```

## Portfolio → Program → Project Rules

- A project can belong to one portfolio and one program
- Adding a project to a program automatically links it to the program's portfolio
- A program belongs to exactly one portfolio
- A project can exist without a portfolio or program

## Add Project to a Program

```http
PUT /attask/api/v21.0/proj/{projectId}
Content-Type: application/json

{
    "programID": "program-id-here"
}
```

This automatically sets `portfolioID` to the program's portfolio.

## Add Project to a Portfolio (without program)

```http
PUT /attask/api/v21.0/proj/{projectId}
Content-Type: application/json

{
    "portfolioID": "portfolio-id-here"
}
```

## List Projects in a Portfolio

```http
GET /attask/api/v21.0/proj/search?portfolioID={portId}&fields=name,status,percentComplete
```

## List Projects in a Program

```http
GET /attask/api/v21.0/proj/search?programID={prgmId}&fields=name,status,percentComplete
```

## Apply Milestone Path

Milestone paths can be applied to projects in PLN or CUR status:

```http
PUT /attask/api/v21.0/proj/{projectId}
Content-Type: application/json

{
    "milestonePathID": "mpath-id-here"
}
```

List available milestone paths:
```http
GET /attask/api/v21.0/mpath/search?fields=name,milestones:name
```

## Full Node.js Example: Create Project in a Program

```javascript
async function createProjectInProgram({ name, programId, ownerId, startDate, endDate }, token, domain) {
    const res = await fetch(`https://${workfront_host}/attask/api/v21.0/proj`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name,
            programID: programId,   // auto-links portfolio
            ownerID: ownerId,
            status: 'PLN',
            plannedStartDate: startDate,
            plannedCompletionDate: endDate
        })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return data.data
}
```

## Full Node.js Example: Apply Milestone Path

```javascript
async function applyMilestonePath(projectId, milestonePathId, token, domain) {
    const res = await fetch(`https://${workfront_host}/attask/api/v21.0/proj/${projectId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestonePathID: milestonePathId })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return data.data
}
```
