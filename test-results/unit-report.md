# Unit Tests

**✅ PASSED** — 37/37 tests passed in 0.46s

_2026-03-11 06:14:20 UTC_

---

## ✅ `test/skills-mcp.test.js` (13/13)

### Adobe Developer Skills MCP Server › Health Check

- ✅ should respond to GET request with health status _(14ms)_

### Adobe Developer Skills MCP Server › CORS Support

- ✅ should handle OPTIONS request for CORS preflight _(2ms)_

### Adobe Developer Skills MCP Server › MCP Protocol

- ✅ should handle initialize request _(14ms)_
- ✅ tools/list should return exactly 3 tools: list_skills, load_skill, read_skill_resource _(14ms)_
- ✅ list_skills should return JSON array with 10 skills, each with name + description _(13ms)_
- ✅ load_skill with valid name returns non-empty markdown body _(12ms)_
- ✅ load_skill with invalid name returns isError: true _(13ms)_
- ✅ read_skill_resource with valid skill + valid path returns content _(12ms)_
- ✅ read_skill_resource with valid skill + invalid path returns isError: true with available paths _(12ms)_
- ✅ read_skill_resource with invalid skill name returns isError: true _(13ms)_

### Adobe Developer Skills MCP Server › Error Handling

- ✅ should handle invalid JSON-RPC request _(1ms)_
- ✅ should handle unknown tool call _(13ms)_
- ✅ should handle unsupported HTTP method _(1ms)_

## ✅ `test/utils.test.js` (24/24)

### (root)

- ✅ interface _(1ms)_

### errorResponse

- ✅ (400, errorMessage) _(0ms)_
- ✅ (400, errorMessage, logger) _(1ms)_

### stringParameters

- ✅ no auth header _(0ms)_
- ✅ with auth header _(0ms)_
- ✅ with ims credentials _(0ms)_
- ✅ with ims credentials and authorization header _(0ms)_

### checkMissingRequestInputs

- ✅ ({ a: 1, b: 2 }, [a]) _(0ms)_
- ✅ ({ a: 1 }, [a, b]) _(0ms)_
- ✅ ({ a: { b: { c: 1 } }, f: { g: 2 } }, [a.b.c, f.g.h.i]) _(0ms)_
- ✅ ({ a: { b: { c: 1 } }, f: { g: 2 } }, [a.b.c, f.g.h]) _(0ms)_
- ✅ ({ a: 1, __ow_headers: { h: 1, i: 2 } }, undefined, [h]) _(0ms)_
- ✅ ({ a: 1, __ow_headers: { f: 2 } }, [a], [h, i]) _(0ms)_
- ✅ ({ c: 1, __ow_headers: { f: 2 } }, [a, b], [h, i]) _(0ms)_
- ✅ ({ a: 0 }, [a]) _(0ms)_
- ✅ ({ a: null }, [a]) _(0ms)_
- ✅ ({ a: '' }, [a]) _(0ms)_
- ✅ ({ a: undefined }, [a]) _(0ms)_

### getBearerToken

- ✅ ({}) _(0ms)_
- ✅ ({ authorization: Bearer fake, __ow_headers: {} }) _(0ms)_
- ✅ ({ authorization: Bearer fake, __ow_headers: { authorization: fake } }) _(0ms)_
- ✅ ({ __ow_headers: { authorization: Bearerfake} }) _(0ms)_
- ✅ ({ __ow_headers: { authorization: Bearer fake} }) _(0ms)_
- ✅ ({ __ow_headers: { authorization: Bearer fake Bearer fake} }) _(1ms)_
