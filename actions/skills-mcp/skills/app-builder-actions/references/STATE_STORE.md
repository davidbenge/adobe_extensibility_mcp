# App Builder Actions — State Store (`@adobe/aio-lib-state`)

Adobe I/O State is a key-value API; the backing service only accepts **string or binary** values. Passing a plain object may **throw** or **silently stringify** to `"[object Object]"`. Always **serialize on write** and **parse on read** (or use `Buffer` for binary).

## Keys

- Type: non-empty **string**
- Allowed characters: **alphanumeric** plus `-`, `_`, `.` only (per Adobe Developer docs)
- Max key size: **1024 bytes** (UTF-8 length matters for multi-byte characters)

Design keys accordingly (e.g. `job:abc123`, `entity.index.v1`); avoid spaces and arbitrary punctuation.

## Values

| Stored as | When |
|-----------|------|
| `JSON.stringify(obj)` | Objects, arrays, nested data |
| Plain string | Already text |
| `Buffer` | Binary payloads |

On read, treat `result.value` as a string unless you know you wrote binary; use `JSON.parse` inside try/catch when the payload is JSON.

## Pattern (copy-paste)

```javascript
const { init: initState } = require('@adobe/aio-lib-state')

function safeParse(jsonString, fallback = null) {
    if (jsonString == null || jsonString === '') return fallback
    try {
        return JSON.parse(jsonString)
    } catch {
        return fallback
    }
}

async function main(params) {
    const state = await initState()
    const key = 'my-namespace.record-1'

    const existing = await state.get(key)
    const data = safeParse(existing?.value, {})

    data.updatedAt = Date.now()
    await state.put(key, JSON.stringify(data), { ttl: 86400 })

    await state.delete(key)
}
```

## TTL

- Optional `{ ttl: seconds }` on `put`; max **365 days** (`31536000` seconds).

## See also

- Async job progress using State: **MANIFEST_PATTERNS.md** (State Store pattern)
- Other integrations from actions: **IO_EVENTS.md**
