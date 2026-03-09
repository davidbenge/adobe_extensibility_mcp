# App Builder Actions — Manifest Patterns

## app.config.yaml Structure

```yaml
application:
  actions: actions
  runtimeManifest:
    packages:
      my-package:
        license: MIT
        actions:
          # Action name (I/O Runtime deployment name only)
          my-action:
            # file path — does NOT need to match action name
            function: actions/my-action/index.js
            web: 'yes'
            runtime: 'nodejs:20'
            limits:
              timeout: 60000      # ms; default 60s
              memory: 512         # MB
            inputs:
              LOG_LEVEL: info
            annotations:
              require-adobe-auth: false
              final: true
              web-export: true
              raw-http: true      # needed for MCP/streaming
```

**Important**: The action name key (e.g. `my-action`) is the I/O Runtime deployment name only. The `function:` field is the actual file path. They do not need to match.

## Action Types

| Type | When to use | timeout |
|------|-------------|---------|
| Standard web action | API, search, status reads | 60s default |
| Long-running web action | Ingestion, batch | Up to 300s (5min) |
| Non-blocking action | Background jobs | Up to 3h |

## State Store Pattern (async progress)

For long-running work, use State Store + a status action:

```javascript
const stateLib = require('@adobe/aio-lib-state')

async function main(params) {
    const state = await stateLib.init()

    // Initialize progress
    const progress = { status: 'in-progress', total: 100, done: 0 }
    await state.put('job:status', JSON.stringify(progress), { ttl: 3600 })

    // Do work in loop, updating periodically
    for (let i = 0; i < total; i++) {
        await processItem(items[i])
        if (i % 10 === 0) {
            progress.done = i
            await state.put('job:status', JSON.stringify(progress))
        }
    }

    // Final update
    progress.status = 'complete'
    progress.done = total
    await state.put('job:status', JSON.stringify(progress))

    return { statusCode: 200, body: { status: 'complete', processed: total } }
}
```

## State Store Key Patterns

- `entity:<id>` — single entity (e.g. `diagram:abc123`)
- `entity:index` — list of IDs (e.g. `diagrams:index`)
- `job:status` — progress for async task
- Max TTL: 365 days (in seconds: 31536000); use -1 is no longer valid
- Values are strings; use JSON.stringify/JSON.parse

## Multiple Extension Points

When app has multiple extension points, use `-e` flag for dev/run:
```bash
aio app run -e dx-excshell-1
aio app deploy   # deploys all extension points
```
