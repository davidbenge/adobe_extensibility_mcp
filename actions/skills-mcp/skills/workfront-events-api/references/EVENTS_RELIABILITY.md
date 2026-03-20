# Workfront Events API — Reliability & Handler Patterns

## authToken Verification

Always verify the Authorization header on incoming webhooks matches your configured authToken:

```javascript
function verifyAuth(req) {
    const incoming = req.headers['authorization']
    const expected = process.env.WF_AUTH_TOKEN
    if (incoming !== expected) {
        throw new Error('Unauthorized webhook request')
    }
}
```

## TLS Requirements

- Webhook URL MUST be HTTPS
- No self-signed certificates — must use a trusted CA
- Workfront uses DigiCert Global Root CA for its own certificates
- Test your endpoint with a TLS validator before registering

## 5-Second Response Rule

Your webhook handler MUST respond with HTTP 200 within 5 seconds. If it doesn't, Workfront treats the delivery as failed.

**Pattern: Acknowledge immediately, process async:**

```javascript
// Express.js example
app.post('/webhook', (req, res) => {
    // 1. Verify auth
    const authHeader = req.headers['authorization']
    if (authHeader !== process.env.WF_AUTH_TOKEN) {
        return res.status(401).send('Unauthorized')
    }

    // 2. Acknowledge IMMEDIATELY (within 5 seconds)
    res.status(200).send('OK')

    // 3. Process asynchronously AFTER responding
    processEventAsync(req.body).catch(err => {
        console.error('Event processing error:', err)
    })
})

async function processEventAsync(payload) {
    const { eventType, newState, oldState } = payload
    // Heavy processing here — no time limit now
    console.log(`Processing ${eventType} for ${newState?.objCode || oldState?.objCode}`)
}
```

## Retry Schedule

- Workfront retries failed deliveries with exponential backoff
- Retry window: up to **48 hours**
- If your endpoint is consistently failing:
  - **Disabled state:** triggered after 70%+ failure rate over 100+ attempts
  - **Frozen state:** triggered after 50,000 consecutive failures
  - Recovery from disabled: system retries every 10 minutes

## Idempotency

Design handlers to safely handle duplicate deliveries. Workfront may deliver the same event more than once.

```javascript
const processedEvents = new Set()  // Use Redis/DB in production

async function processEventAsync(payload) {
    const eventKey = `${payload.subscriptionId}:${payload.eventTime.epochSecond}:${payload.eventTime.nano}`

    if (processedEvents.has(eventKey)) {
        console.log('Duplicate event, skipping:', eventKey)
        return
    }
    processedEvents.add(eventKey)

    // Process event...
}
```

## Subscription Health Monitoring

```javascript
async function listSubscriptions(apiToken, domain) {
    const res = await fetch(
        `https://${workfront_host}/attask/eventsubscription/api/v1/subscriptions`,
        { headers: { 'Authorization': `Bearer ${apiToken}` } }
    )
    const subs = await res.json()
    // Check for disabled/frozen subscriptions
    subs.forEach(sub => {
        if (sub.disabled) console.warn(`Subscription ${sub.id} is disabled!`)
    })
    return subs
}
```
