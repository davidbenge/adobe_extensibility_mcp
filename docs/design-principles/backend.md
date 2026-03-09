# Backend Design Principles

## Stack

- **Adobe I/O Runtime** (Apache OpenWhisk serverless)
- **Node.js 20** — CommonJS modules
- **`@modelcontextprotocol/sdk`** — MCP server and transport
- **`@adobe/aio-sdk`** — logger
- **`gray-matter`** — frontmatter parsing (build time only)

## Action Shape

All actions export `module.exports = { main }` with signature:

```javascript
async function main(params) {
    const logger = Core.Logger('action-name', { level: params.LOG_LEVEL || 'info' })
    try {
        // business logic
        return { statusCode: 200, body: result }
    } catch (error) {
        logger.error('Error:', error.message)
        return { statusCode: 500, body: { error: 'Internal server error' } }
    }
}
module.exports = { main }
```

## MCP Server Pattern

The `skills-mcp` action uses the stateless per-request pattern:

1. Create fresh `McpServer` instance
2. Register tools via `server.tool(name, description, schema, handler)`
3. Create `StreamableHTTPServerTransport({ enableJsonResponse: true })`
4. `server.connect(transport)` then `transport.handleRequest(req, res, body)`
5. Await response completion via `responseComplete` promise

Tools only (`capabilities: { tools: {}, logging: {} }`). No resources or prompts.

## No Credentials in Action Code

All config comes from `params` injected by the manifest `inputs:` section. Never use `process.env` in action code.

## Input Handling

The Adobe I/O Runtime raw-http mode delivers:
- `params.__ow_body` — request body (string, may be base64)
- `params.__ow_headers` — headers object (normalize to lowercase)
- `params.__ow_method` — HTTP method
- `params.__ow_path` — URL path

## Logging

Always use `Core.Logger` from `@adobe/aio-sdk`:

```javascript
const logger = Core.Logger('action-name', { level: params.LOG_LEVEL || 'info' })
```

`params.LOG_LEVEL` is set in `app.config.yaml` inputs and can be overridden at deploy time.

## No Authentication

This server is a public knowledge endpoint. No IMS tokens, no API keys, no `require-adobe-auth`. Skills content is not sensitive.
