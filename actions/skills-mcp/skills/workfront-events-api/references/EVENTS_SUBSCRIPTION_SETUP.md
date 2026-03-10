# Workfront Events API — Subscription Setup

## Endpoint

Event Subscriptions use a DIFFERENT base URL than the REST API:

```
POST https://<instance>.my.workfront.com/attask/eventsubscription/api/v1/subscriptions
GET  https://<instance>.my.workfront.com/attask/eventsubscription/api/v1/subscriptions
DELETE https://<instance>.my.workfront.com/attask/eventsubscription/api/v1/subscriptions/{id}
```

## Create a Subscription

CRITICAL: Include ONLY required fields — extra fields cause failures.

Required fields:
- `objCode` — Workfront object type (PROJ, TASK, OPTASK, etc.)
- `eventType` — CREATE, UPDATE, DELETE, or "all"
- `url` — Your webhook endpoint (must be HTTPS, public, no self-signed cert)
- `authToken` — A secret string you choose; sent as `Authorization` header on delivery

```bash
curl -X POST \
  'https://<instance>.my.workfront.com/attask/eventsubscription/api/v1/subscriptions' \
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
        `https://${domain}.my.workfront.com/attask/eventsubscription/api/v1/subscriptions`,
        { objCode, eventType, url, authToken },
        { headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' } }
    )
    return res.data  // { id, objCode, eventType, url, ... }
}
```

## List Subscriptions

```bash
curl -X GET \
  'https://<instance>.my.workfront.com/attask/eventsubscription/api/v1/subscriptions' \
  -H 'Authorization: Bearer <api-token>'
```

## Delete a Subscription

```bash
curl -X DELETE \
  'https://<instance>.my.workfront.com/attask/eventsubscription/api/v1/subscriptions/{subscriptionId}' \
  -H 'Authorization: Bearer <api-token>'
```

## Environment Hostnames

| Environment | Hostname Pattern |
|-------------|-----------------|
| Production | `<instance>.my.workfront.com` |
| Preview | `<instance>.preview.workfront.com` |
| Sandbox | `<instance>.sb01.workfront.com` |
