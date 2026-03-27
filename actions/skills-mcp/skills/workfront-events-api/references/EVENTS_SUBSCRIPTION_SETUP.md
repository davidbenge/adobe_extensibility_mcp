# Workfront Events API — Subscription Setup

## Endpoint

Event Subscriptions use a DIFFERENT base URL than the REST API:

```
POST https://<workfront_host>/attask/eventsubscription/api/v1/subscriptions
GET  https://<workfront_host>/attask/eventsubscription/api/v1/subscriptions
DELETE https://<workfront_host>/attask/eventsubscription/api/v1/subscriptions/{id}
```

## Create a Subscription

CRITICAL: Include ONLY required fields — extra fields cause failures.

### Supported Object Types

| Name | objCode |
|------|---------|
| Approval | `APPROVAL` |
| Approval Stage | `ARVSTP` |
| Approval Stage Participant | |
| Assignment | `ASSGN` |
| Company | `CMPY` |
| Dashboard | `PTLTAB` |
| Document | `DOCU` |
| Document Version | `DOCV` |
| Expense | `EXPNS` |
| Field | `JRNLF` |
| Hour | `HOUR` |
| Issue | `OPTASK` |
| Note | `NOTE` |
| Portfolio | `PORT` |
| Program | `PRGM` |
| Project | `PROJ` |
| Proof Approval | `PRFAPL` |
| Report | `PTLSEC` |
| Staffing Plan | |
| Staffing Plan Parameter Value | |
| Staffing Plan Resource | |
| Staffing Plan Resource Attribute Value | |
| Staffing Plan Resource Attribute Value Set | |
| Staffing Plan Resource Parameter Value | |
| Task | `TASK` |
| Template | `TMPL` |
| Timesheet | `TSHET` |
| User | `USER` |
| Workspace | |

Required fields:
- `objCode` — Workfront object type (see above table)
- `eventType` — CREATE, UPDATE, DELETE, or "all"
- `url` — Your webhook endpoint (must be HTTPS, public, no self-signed cert)
- `authToken` — A secret string you choose; sent as `Authorization` header on delivery

```bash
curl -X POST \
  'https://<workfront_host>/attask/eventsubscription/api/v1/subscriptions' \
  -H 'Authorization: Bearer <api-token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "objCode": "TASK",
    "eventType": "UPDATE",
    "url": "https://your-webhook.example.com/handler",
    "authToken": "your-secret-token-here"
  }'
```

Node.js (axios):
```javascript
const axios = require('axios')

async function createSubscription({ objCode, eventType, url, authToken }, apiToken, domain) {
    const res = await axios.post(
        `${workfront_host}/attask/eventsubscription/api/v1/subscriptions`,
        { objCode, eventType, url, authToken },
        { headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' } }
    )
    return res.data  // { id, objCode, eventType, url, ... }
}
```

## List Subscriptions

```bash
curl -X GET \
  'https://<workfront_host>/attask/eventsubscription/api/v1/subscriptions' \
  -H 'Authorization: Bearer <api-token>'
```

## Delete a Subscription

```bash
curl -X DELETE \
  'https://<workfront_host>/attask/eventsubscription/api/v1/subscriptions/{subscriptionId}' \
  -H 'Authorization: Bearer <api-token>'
```

## Environment Hostnames

| Environment | Hostname Pattern |
|-------------|-----------------|
| Production | `<instance>.my.workfront.com` |
| Preview | `<instance>.preview.workfront.com` |
| Sandbox | `<instance>.sb01.workfront.com` |
