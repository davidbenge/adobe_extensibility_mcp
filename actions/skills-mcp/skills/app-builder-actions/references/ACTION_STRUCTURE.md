# App Builder Actions — Action Structure

## Platform
Adobe I/O Runtime is built on Apache OpenWhisk (serverless, event-driven). Actions are stateless functions invoked via HTTP or events.

## Runtime Limits

| Limit | Blocking (web) | Non-blocking |
|-------|----------------|--------------|
| Timeout | 60s default (up to 5min configurable) | Up to 3h |
| Memory | 256MB default; 128MB–4GB range | Same |
| Use for | APIs, search, single ops | Ingestion, bulk work |

## Action Shape (CommonJS)

```javascript
const { Core } = require('@adobe/aio-sdk')

async function main(params) {
    const logger = Core.Logger('action-name', { level: params.LOG_LEVEL || 'info' })

    try {
        logger.debug('Action invoked')

        // 1. Extract and validate input
        const id = params.id || params.__ow_path?.split('/').pop()
        if (!id) {
            return { error: { statusCode: 400, body: { error: 'id is required' } } }
        }

        // 2. Business logic
        const result = await doWork(params, id)

        // 3. Success response
        return { statusCode: 200, body: result }

    } catch (error) {
        logger.error('Unhandled error:', error.message)
        return { error: { statusCode: 500, body: { error: 'Internal server error' } } }
    }
}

module.exports = { main }
```

## Params Format

- **Body**: `params.__ow_body` (string, may be base64-encoded; or already parsed object)
- **Headers**: `params.__ow_headers` (object, keys are lowercase)
- **Path**: `params.__ow_path` (string)
- **Query**: merged into params directly
- **Config from manifest**: merged into params (e.g. `params.LOG_LEVEL`, `params.MY_API_KEY`)

## Key Concepts

| Concept | Description |
|---------|-------------|
| Logger | `Core.Logger('name', { level: params.LOG_LEVEL \|\| 'info' })` — always use params.LOG_LEVEL |
| State Store | `@adobe/aio-lib-state` — key-value store per namespace |
| Files | `@adobe/aio-lib-files` — blob storage per namespace |
| IMS | Adobe Identity Management System — token in `Authorization: Bearer <token>` |

## Body Parsing Pattern

```javascript
// Body may be string (base64 or JSON) or already an object
function parseBody(params) {
    if (!params.__ow_body) return params
    try {
        if (typeof params.__ow_body === 'string') {
            try {
                const decoded = Buffer.from(params.__ow_body, 'base64').toString('utf8')
                return JSON.parse(decoded)
            } catch {
                return JSON.parse(params.__ow_body)
            }
        }
        return params.__ow_body
    } catch {
        throw new Error('Invalid request body')
    }
}
```

## Deployment

- `aio app deploy` — builds and deploys all actions
- `aio app run` — local development server
- `aio app logs` — view runtime logs
- Action timeouts and memory are set in `app.config.yaml` under `limits:`
