# App Builder Actions — Error Handling

## Response Contract

OpenWhisk expects one of:
- **Success**: `{ statusCode: 200, body: <data> }`
- **Error**: `{ error: { statusCode: 4xx|5xx, body: { error: 'message' } } }`

Never throw from `main()`. Always return a response object.

## errorResponse() Utility

```javascript
// utils.js — shared across actions
function errorResponse(statusCode, message, logger) {
    if (logger?.info) logger.info(`${statusCode}: ${message}`)
    return {
        error: {
            statusCode,
            body: { error: message }
        }
    }
}

module.exports = { errorResponse }
```

## Status Code Mapping

| Scenario | Code | Example |
|----------|------|---------|
| Missing required param | 400 | `errorResponse(400, "id is required", logger)` |
| Auth failed / no token | 401 | `errorResponse(401, "Authentication required", logger)` |
| Permission denied | 403 | `errorResponse(403, "You do not have permission", logger)` |
| Not found | 404 | `errorResponse(404, "Item not found: " + id, logger)` |
| Conflict / stale | 409 | `errorResponse(409, "Modified by another user. Refresh and retry.", logger)` |
| Server error | 500 | `errorResponse(500, "Internal server error", logger)` |

## Catch Pattern

```javascript
try {
    // business logic
    return { statusCode: 200, body: result }
} catch (error) {
    // Check for known error types with statusCode
    if (error && typeof error === 'object' && 'statusCode' in error) {
        return {
            error: {
                statusCode: error.statusCode || 401,
                body: { error: error.message || 'Request failed' }
            }
        }
    }
    // Unknown error — log full details, return generic 500
    logger.error('Unhandled error:', error instanceof Error ? error.message : String(error))
    return errorResponse(500, 'Internal server error', logger)
}
```

## Input Validation Pattern

```javascript
// Validate at the top of main(), before any async work
const missingParams = []
if (!params.id) missingParams.push('id')
if (!params.__ow_headers?.authorization) missingParams.push('authorization')
if (missingParams.length > 0) {
    return errorResponse(400, `missing parameter(s): '${missingParams.join("', '")}'`, logger)
}
```

## Anti-Patterns

| Anti-Pattern | Fix |
|---|---|
| `throw error` from main | Wrap in try/catch, return errorResponse |
| `body: error` (returning Error object) | Return `body: { error: error.message }` |
| Stack traces in response body | Log internally, return generic 500 |
| Auth check after loading resource | Check auth FIRST, then load resource, then check permission |
| No input validation | Validate all required params at top of main |
