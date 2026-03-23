# Unit Tests

**✅ PASSED** — 37/37 tests passed in 2.12s

_2026-03-20 17:20:06 UTC_

---

## ✅ `test/utils.test.js` (24/24)

### (root)

- ✅ interface _(4ms)_

### errorResponse

- ✅ (400, errorMessage) _(1ms)_
- ✅ (400, errorMessage, logger) _(2ms)_

### stringParameters

- ✅ no auth header _(0ms)_
- ✅ with auth header _(2ms)_
- ✅ with ims credentials _(1ms)_
- ✅ with ims credentials and authorization header _(1ms)_

### checkMissingRequestInputs

- ✅ ({ a: 1, b: 2 }, [a]) _(0ms)_
- ✅ ({ a: 1 }, [a, b]) _(0ms)_
- ✅ ({ a: { b: { c: 1 } }, f: { g: 2 } }, [a.b.c, f.g.h.i]) _(1ms)_
- ✅ ({ a: { b: { c: 1 } }, f: { g: 2 } }, [a.b.c, f.g.h]) _(0ms)_
- ✅ ({ a: 1, __ow_headers: { h: 1, i: 2 } }, undefined, [h]) _(0ms)_
- ✅ ({ a: 1, __ow_headers: { f: 2 } }, [a], [h, i]) _(1ms)_
- ✅ ({ c: 1, __ow_headers: { f: 2 } }, [a, b], [h, i]) _(0ms)_
- ✅ ({ a: 0 }, [a]) _(1ms)_
- ✅ ({ a: null }, [a]) _(0ms)_
- ✅ ({ a: '' }, [a]) _(1ms)_
- ✅ ({ a: undefined }, [a]) _(0ms)_

### getBearerToken

- ✅ ({}) _(1ms)_
- ✅ ({ authorization: Bearer fake, __ow_headers: {} }) _(0ms)_
- ✅ ({ authorization: Bearer fake, __ow_headers: { authorization: fake } }) _(0ms)_
- ✅ ({ __ow_headers: { authorization: Bearerfake} }) _(1ms)_
- ✅ ({ __ow_headers: { authorization: Bearer fake} }) _(0ms)_
- ✅ ({ __ow_headers: { authorization: Bearer fake Bearer fake} }) _(0ms)_

## ✅ `test/skills-mcp.test.js` (13/13)

### Adobe Developer Skills MCP Server › Health Check

- ✅ should respond to GET request with health status _(24ms)_

### Adobe Developer Skills MCP Server › CORS Support

- ✅ should handle OPTIONS request for CORS preflight _(4ms)_

### Adobe Developer Skills MCP Server › MCP Protocol

- ✅ should handle initialize request _(19ms)_
- ✅ tools/list should return exactly 3 tools: list_skills, load_skill, read_skill_resource _(18ms)_
- ✅ list_skills should return JSON array with 10 skills, each with name + description _(18ms)_
- ✅ load_skill with valid name returns non-empty markdown body _(14ms)_
- ✅ load_skill with invalid name returns isError: true _(13ms)_
- ✅ read_skill_resource with valid skill + valid path returns content _(15ms)_
- ✅ read_skill_resource with valid skill + invalid path returns isError: true with available paths _(14ms)_
- ✅ read_skill_resource with invalid skill name returns isError: true _(13ms)_

### Adobe Developer Skills MCP Server › Error Handling

- ✅ should handle invalid JSON-RPC request _(3ms)_
- ✅ should handle unknown tool call _(13ms)_
- ✅ should handle unsupported HTTP method _(2ms)_
