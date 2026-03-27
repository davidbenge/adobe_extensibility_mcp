# App Builder Actions — I/O Events & Integration

## I/O Events

Adobe I/O Events allows actions to subscribe to product events (e.g., AEM, Analytics, Creative Cloud):

```javascript
// Event-triggered action — params contains the event payload
async function main(params) {
    const logger = Core.Logger('event-handler', { level: params.LOG_LEVEL || 'info' })

    // Event payload is in params (varies by event type)
    const event = params.event || params
    logger.info('Received event:', event.type)

    // Process the event
    await processEvent(event)

    return { statusCode: 200, body: { processed: true } }
}
```

## State Store Integration

> **Load STATE_STORE.md** for Adobe key rules (charset, 1024-byte limit) and why values must be **string or binary**—never pass a raw object.

```javascript
const { init: initState } = require('@adobe/aio-lib-state')

async function main(params) {
    const state = await initState()

    const result = await state.get('my-key')
    const value = result?.value ? JSON.parse(result.value) : null

    await state.put('my-key', JSON.stringify(data), { ttl: 86400 })

    await state.delete('my-key')
}
```

## Files Integration (Blob Storage)

```javascript
const { init: initFiles } = require('@adobe/aio-lib-files')

async function main(params) {
    const files = await initFiles()

    // Write a file
    await files.write('path/to/file.json', JSON.stringify(data))

    // Read a file
    const buffer = await files.read('path/to/file.json')
    const content = buffer.toString('utf8')

    // Delete
    await files.delete('path/to/file.json')

    // List files
    const list = await files.list('path/to/')
}
```

## External Services Pattern

Initialize from params (never from process.env in action code):

```javascript
async function main(params) {
    // All config comes from params (set in app.config.yaml inputs or at deploy time)
    const apiClient = createClient({
        endpoint: params.API_ENDPOINT,
        apiKey: params.API_KEY
    })

    const result = await apiClient.doWork()
    return { statusCode: 200, body: result }
}
```

## Data Flow Summary

```
HTTP Request → API Gateway → I/O Runtime action main(params)
  params.__ow_headers  — request headers
  params.__ow_path     — URL path
  params.__ow_body     — request body (string or object)
  params.__ow_method   — HTTP method
  params.MY_CONFIG     — from manifest inputs / deploy-time env

Response: { statusCode, body } or { error: { statusCode, body } }
```

## Key Libraries

| Library | Package | Use |
|---------|---------|-----|
| SDK | `@adobe/aio-sdk` | Logger, Core |
| State Store | `@adobe/aio-lib-state` | Key-value persistence |
| Files | `@adobe/aio-lib-files` | Blob storage |
| Fetch | built-in / node-fetch | External HTTP calls |
