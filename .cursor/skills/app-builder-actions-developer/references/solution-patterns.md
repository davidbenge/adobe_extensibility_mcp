# App Builder Actions — Solution Patterns

> Action template, async task, State Store, error handling, anti-patterns, integration, testing, and performance. For platform and concepts, see [platform.md](platform.md).

---

## Solution Patterns

### Pattern: Action Template

**Description**: Standard shape for an HTTP-handling action: logger, auth, input extraction, validation, business logic, and a single place for error handling and response formatting.

**When to apply**: Every Runtime action that handles HTTP (CRUD, search, status, etc.).

**Pattern Atlas example** (diagrams read):

```typescript
// src/dx-excshell-1/actions/diagrams/read.ts
import { Core } from '@adobe/aio-sdk';
import { init as initState } from '@adobe/aio-lib-state';
import { errorResponse } from '../utils';
import { requireAuth } from '../auth/validate-ims';
import { checkPermission, DiagramPermission } from '../auth/access-control';

export async function main(params: any) {
  const logger = Core.Logger('diagrams-read', { level: params.LOG_LEVEL || 'info' });

  try {
    logger.debug('Reading diagram');

    // 1. Authenticate user
    const auth = await requireAuth(params);
    logger.debug(`User authenticated: ${auth.userId}`);

    // 2. Extract and validate input
    const diagramId = params.id || params.__ow_path?.split('/').pop();
    if (!diagramId) {
      return errorResponse(400, 'Diagram ID is required', logger);
    }

    // 3. Retrieve from State
    const state = await initState();
    const result = await state.get(`diagram:${diagramId}`);
    if (!result || !result.value) {
      return errorResponse(404, `Diagram not found: ${diagramId}`, logger);
    }
    const diagram = JSON.parse(result.value);

    // 4. Authorization
    if (!checkPermission(diagram, auth, DiagramPermission.READ)) {
      return errorResponse(403, 'You do not have permission to read this diagram', logger);
    }

    // 5. Success response
    return { statusCode: 200, body: diagram };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      return {
        statusCode: (error as any).statusCode || 401,
        body: { error: 'Authentication failed', message: (error as any).message || 'Invalid or expired token' }
      };
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Error reading diagram: ${errorMessage}`);
    return errorResponse(500, 'Internal server error', logger);
  }
}
```

**Variations**:

- **No auth**: For health or public endpoints, skip `requireAuth` and document why.
- **Body parsing**: If body is JSON string, parse once and validate: `const data = typeof params.body === 'string' ? JSON.parse(params.body) : params;`
- **Optional LOG_LEVEL**: Always use `params.LOG_LEVEL || 'info'` so debug can be enabled per request.

---

### Pattern: Async Task (long-running with progress)

**Description**: Run a long-running job inside the action (e.g., batch ingestion), persist progress in State Store, and return a summary when done. Callers can poll a separate "get status" action.

**When to apply**: Batch processing that exceeds a few seconds; ingestion, bulk updates, report generation.

**Pattern Atlas example** (ODP ingestion uses State Store for progress):

```typescript
// From src/dx-excshell-1/actions/ingest/ingest-odps.ts (simplified)
const stateLib = require('@adobe/aio-lib-state');
const stateStore = await stateLib.init();

const progress: IngestionProgress = {
  status: 'in-progress',
  startTime: Date.now(),
  totalODPs: totalODPs,
  processedODPs: 0,
  percentComplete: 0,
  nodesCreated: 0,
  relationshipsCreated: 0,
  embeddingsGenerated: 0,
  errors: []
};
await stateStore.put('ingest-status', JSON.stringify(progress));

// ... process in loop ...
progress.processedODPs++;
progress.percentComplete = (progress.processedODPs / progress.totalODPs) * 100;
if (progress.processedODPs % CONFIG.progressUpdateInterval === 0) {
  await stateStore.put('ingest-status', JSON.stringify(progress));
}

// On completion
progress.status = 'complete';
progress.endTime = Date.now();
progress.percentComplete = 100;
await stateStore.put('ingest-status', JSON.stringify(progress));

return {
  statusCode: 200,
  body: {
    status: 'complete',
    summary: {
      totalProcessed: progress.processedODPs,
      nodesCreated: progress.nodesCreated,
      relationshipsCreated: progress.relationshipsCreated,
      errors: progress.errors.length,
      durationMinutes: (progress.endTime! - progress.startTime) / 1000 / 60
    }
  }
};
```

**Get-status action** (blocking, fast read):

```typescript
// From src/dx-excshell-1/actions/ingest/get-status.ts
async function main(params: StatusParams): Promise<{ statusCode: number; body: any }> {
  const stateStore = await stateLib.init();
  const statusRecord = await stateStore.get('ingest-status');
  if (!statusRecord?.value) {
    return { statusCode: 404, body: { error: 'No ingestion in progress or completed' } };
  }
  const progress = typeof statusRecord.value === 'string'
    ? JSON.parse(statusRecord.value)
    : statusRecord.value;
  const elapsedTime = progress.endTime
    ? progress.endTime - progress.startTime
    : Date.now() - progress.startTime;
  return {
    statusCode: 200,
    body: {
      ...progress,
      elapsedMinutes: Math.round((elapsedTime / 1000 / 60) * 100) / 100,
      timestamp: Date.now()
    }
  };
}
```

**Variations**:

- **Fire-and-forget**: Return 202 immediately and do work asynchronously (requires another mechanism to run the worker).
- **Chunked work**: Store a queue in State and process N items per invocation to stay under timeout.
- **Idempotency key**: Store `jobId` in State and reject duplicate starts.

---

### Pattern: State Store

**Description**: Use `@adobe/aio-lib-state` for key-value data: progress, indexes (e.g., list of diagram IDs), session or feature flags. Values are strings; serialize objects with `JSON.stringify` / `JSON.parse`.

**When to apply**: Progress for long-running tasks; indexes for "list all" when the backend has no native list; small config or cache.

**Pattern Atlas examples**:

**Single entity (diagram)**:

```typescript
// diagrams/read.ts, create.ts, update.ts
const state = await initState();

// Get
const result = await state.get(`diagram:${diagramId}`);
if (result?.value) {
  const diagram = JSON.parse(result.value);
}

// Put (optional TTL: -1 = no expiry) this pattern is no longer valid and the max is 365 days. this is entered in seconds
await state.put(`diagram:${diagramId}`, JSON.stringify(diagram), { ttl: 31536000 });
```

**Index for listing** (diagrams list):

```typescript
// diagrams/create.ts – maintain index when creating
const indexData = await state.get('diagrams:index');
let index = { diagramIds: [] as string[] };
if (indexData?.value) index = JSON.parse(indexData.value);
if (!index.diagramIds.includes(diagramId)) {
  index.diagramIds.push(diagramId);
  await state.put('diagrams:index', JSON.stringify(index));
}
```

**Progress blob** (ingestion):

```typescript
// ingest-odps.ts
await stateStore.put('ingest-status', JSON.stringify(progress));
// get-status reads the same key
```

**Guidelines**:

- Key namespacing: use a prefix like `diagram:`, `diagrams:index`, `ingest-status`.
- Keep value size reasonable; State Store has limits per value.
- For "list all" at scale, prefer a proper database with indexes; use State index only for MVP/small sets.

---

### Pattern: Error Handling

**Description**: Use a shared `errorResponse(statusCode, message, logger)` so every action returns a consistent `{ error: { statusCode, body: { error: message } } }`. In `main()`, catch domain errors (e.g., `AuthError`) and map them to status codes; catch unexpected errors and return 500.

**When to apply**: Every action that can fail (validation, auth, not found, conflict, server error).

**Pattern Atlas shared util**:

```typescript
// src/dx-excshell-1/actions/utils.ts
export function errorResponse(
  statusCode: number,
  message: string,
  logger?: Logger
): ActionErrorResponse {
  if (logger?.info) logger.info(`${statusCode}: ${message}`);
  return {
    error: {
      statusCode,
      body: { error: message }
    }
  };
}
```

**AuthError (custom class)**:

```typescript
// src/dx-excshell-1/actions/auth/validate-ims.ts
export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401,
    public code: string = 'UNAUTHORIZED'
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
```

**Generic catch for read/update/delete** (any error with statusCode):

```typescript
} catch (error: unknown) {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    return {
      statusCode: (error as any).statusCode || 401,
      body: {
        error: 'Authentication failed',
        message: (error as any).message || 'Invalid or expired token'
      }
    };
  }
  const errorMessage = error instanceof Error ? error.message : String(error);
  logger.error(`Error updating diagram: ${errorMessage}`);
  return errorResponse(500, 'Internal server error', logger);
}
```

**Variations**:

- **Validation**: Return `errorResponse(400, 'missing parameter(s) \'id\'', logger)` using `checkMissingRequestInputs(params, ['id'], ['authorization'])` from utils.
- **Conflict**: Return `errorResponse(409, 'Diagram has been modified by another user. Please refresh and try again.', logger)` for optimistic locking.
- **Not found**: Return `errorResponse(404, 'Diagram not found: ' + diagramId, logger)`.

**When to use which pattern**:

| Need | Pattern |
|------|---------|
| HTTP CRUD, search, or status read | Action Template |
| Batch job that runs minutes/hours | Async Task + State Store |
| Progress, index, or small key-value data | State Store |
| Consistent 4xx/5xx and logging | Error Handling |

---

## Anti-Patterns

### 1. Returning thrown errors as body

**What not to do**: Let exceptions bubble and return `{ body: error }` or expose stack traces.

**Refactor**: Always use try/catch; return `errorResponse(500, 'Internal server error', logger)` and log the real error; never put stack or internal messages in `body`.

### 2. Skipping auth or doing it after business logic

**What not to do**: Fetch the diagram first, then check auth.

**Refactor**: Authenticate first, then load resource, then check permission (as in diagrams/read.ts).

### 3. Hardcoding credentials or env names

**What not to do**: `process.env.MY_NEO4J_URI` without accepting params.

**Refactor**: Initialize from params in main: `initNeo4jDriver(params.NEO4J_URI, ...)` and require params when the action needs Neo4j.

### 4. Assuming body is always an object

**What not to do**: `const name = params.body.name` when `params.body` might be a JSON string.

**Refactor**: Parse once at the top: `const body = typeof params.body === 'string' ? JSON.parse(params.body) : (params.body || params);` then validate `body.name`.

### 5. No input validation or idempotency

**Refactor**: Use `checkMissingRequestInputs(params, ['id'])` or explicit `if (!params.id) return errorResponse(400, ...)`. For updates, use optimistic locking with `version` and return 409 on mismatch.

### 6. Long-running work without progress or timeout

**Refactor**: Use Async Task pattern: update State Store periodically, return summary when done, and provide a get-status action.

---

## Integration Points

| Domain | Integration | Pattern Atlas usage |
|--------|-------------|----------------------|
| **IMS / Auth** | Token in `Authorization` or `__ow_user`; validate via UserInfo or JWT fallback. | `requireAuth(params)`, `AuthError`, `access-control.ts` for diagram permissions. |
| **State** | `@adobe/aio-lib-state` init in each action; keys are namespaced. | Diagrams (entity + index), ingest-status. |
| **Files** | `@adobe/aio-lib-files`; path-based. | Diagram SVG content (`contentFileId`). |
| **Neo4j** | Driver created from params; singleton per process. | `lib/neo4j-client.ts` `initNeo4jDriver` + `getNeo4jDriver()`; used by ingest and retrieval. |
| **Azure OpenAI** | Client from params (endpoint, key, deployment). | Embeddings in ingest; retrieval orchestrator. |
| **New Relic** | Optional; custom events and performance. | `newrelic-helper.ts` in ingest-odps. |

### Data flow (high level)

- **Request** → API Gateway → Runtime action `main(params)`.
- **Params**: `__ow_headers`, `__ow_path`, `body`, plus query and app-specific params.
- **Auth**: Extract token → validate IMS or use `__ow_user` → get `AuthInfo` → use in permission checks.
- **State**: Init state once in handler → get/put with string values (JSON when needed).
- **Response**: Always `{ statusCode, body }` or `{ error: { statusCode, body } }`; no streaming.

---

## Testing Strategies

- **Mock params**: Build `params` with `__ow_headers`, `body`, `id`, `LOG_LEVEL`, etc.
- **Mock auth**: Stub `requireAuth` to return a fixed `AuthInfo` or throw `AuthError` to test 401/403.
- **Mock State/Files**: Use jest or similar to mock `@adobe/aio-lib-state` and `@adobe/aio-lib-files`.
- **Assert response shape**: Expect `statusCode` and either `body` or `error.body.error`.

Test patterns: Happy path (200/201), missing input (400), not found (404), forbidden (403), auth failure (401), conflict (409).

---

## Performance Considerations

- **Lazy init**: Create Neo4j driver only when needed and reuse via singleton after `initNeo4jDriver(params)` in main.
- **Batch when possible**: In ingest, process in a loop with small delays to avoid rate limits.
- **Index in State**: For "list all" over State keys, maintain an index key (e.g., `diagrams:index` with `diagramIds[]`).
- **Cold start**: Keep actions small and avoid heavy top-level imports.
- **Timeout**: Increase in `manifest.yml` for actions that must run longer (e.g., ingest-odps with 3-hour timeout); document why.

---

## Summary Checklist for New Actions

- [ ] **Action template**: Logger, try/catch, single return shape (`{ statusCode, body }` or `errorResponse`).
- [ ] **Auth**: Call `requireAuth(params)` first; handle `AuthError` with correct status code.
- [ ] **Input**: Parse body if string; validate required params; return 400 with clear message.
- [ ] **Authorization**: After loading resource, check permission (e.g., `checkPermission(diagram, auth, DiagramPermission.READ)`).
- [ ] **Errors**: Use `errorResponse()`; never expose stack or internal details in body.
- [ ] **State/Files**: Init once in handler; use consistent key naming; keep values small.
- [ ] **External services**: Init from params (Neo4j, OpenAI, etc.); document required params.
- [ ] **Long-running**: Use State Store for progress and a get-status action; consider timeout and chunking.
- [ ] **Idempotency / concurrency**: Optimistic locking (e.g., version) where updates can conflict.

---

## Reference: Key Pattern Atlas Files

| Area | Path |
|------|------|
| Action types & utils | `src/dx-excshell-1/actions/types.ts`, `utils.ts` |
| Auth | `auth/validate-ims.ts`, `auth/access-control.ts` |
| CRUD (action template, state, errors) | `diagrams/read.ts`, `create.ts`, `update.ts`, `delete.ts`, `list.ts` |
| Long-running + State Store | `ingest/ingest-odps.ts`, `ingest/get-status.ts` |
| Neo4j | `lib/neo4j-client.ts` |
| Retrieval | `retrieval/orchestrator.ts`, `retrieval/index.ts` |
