# Testing Design Principles

## Stack

Jest only. No Playwright, no E2E tests, no integration tests against live endpoints.

## Test Pattern

Tests call `main(params)` directly — the same entry point Adobe I/O Runtime calls. This tests the full request handling pipeline without a live HTTP server:

```javascript
const { main } = require('../actions/skills-mcp/index.js')

test('health check', async () => {
    const result = await main({ __ow_method: 'get', LOG_LEVEL: 'info' })
    expect(result.statusCode).toBe(200)
    const body = JSON.parse(result.body)
    expect(body.status).toBe('healthy')
})
```

## Pretest Hook

`package.json` runs `node scripts/generate-registry.js` before any test run (via `"pretest"` script). This ensures `registry.json` is up to date with current skill files before tests execute.

```bash
npm test
# → node scripts/generate-registry.js (auto)
# → jest
```

## Coverage Requirements

Every new tool handler needs:
- Happy path (valid input → expected output)
- Invalid input (unknown name → `isError: true`)
- Edge cases specific to the tool

See `test/skills-mcp.test.js` for the full suite.

## What NOT to Test

- The MCP SDK internals
- JSON-RPC framing (the SDK handles this)
- Network/HTTP transport
- Webpack bundle output

## Running Tests

```bash
npm test          # run all tests (pretest generates registry first)
npm run test:watch  # watch mode
```
