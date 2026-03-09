# Adobe Developer Skills MCP — Implementation Planning Document

## Purpose

This document captures all architectural decisions, technical choices, and implementation details
agreed upon during the planning session. It is intended to be imported directly into a Claude Code
session to drive the implementation phase without re-litigating decisions already made.

---

## 1. What We Are Building

A **remote MCP server** deployed on Adobe I/O Runtime (App Builder) that serves a curated library
of Adobe developer skills to any MCP-compatible coding agent (Claude Code, Cursor, VS Code Copilot,
etc.). The server implements the Agent Skills progressive disclosure pattern — exposing skill
metadata at discovery time and loading full content only on demand.

### Problem Being Solved

Adobe App Builder developers currently have no persistent, shared source of institutional knowledge
accessible to their AI coding agents. Every developer either re-prompts the same context manually,
relies on an agent's stale training data about Adobe APIs, or pastes documentation into chat
sessions. This MCP packages that knowledge once, serves it to any agent, and keeps it centrally
maintained by the architecture team.

### Scope of Skills (Initial Set)

| Skill Name | Domain |
|---|---|
| `app-builder-actions` | Action structure, manifest, I/O Runtime patterns |
| `app-builder-frontend` | React Spectrum, Adobe UI Kit, SPA-to-action wiring |
| `workfront-extension` | WF shell integration, extension registration, navigation |
| `workfront-tasks-api` | Task CRUD, field mapping, bulk ops, custom forms |
| `workfront-issues-api` | Issue object, transitions, assignments, queries |
| `workfront-forms-api` | Custom form parameters, parameter values, form structure |

Each skill has exactly **four reference files** in `references/` and no executable scripts.

---

## 2. Architecture Decisions

### 2.1 Hosting: Adobe I/O Runtime Web Action

**Decision:** Single App Builder web action, no auth, public web endpoint.

**Rationale:**
- Skills content is non-sensitive institutional knowledge, not customer data
- Removing auth eliminates IMS token complexity for developer tooling use case
- Single action keeps the deployment surface minimal
- I/O Runtime's container reuse model aligns perfectly with module-scope caching strategy

**Config:**
```yaml
# app.config.yaml
application:
  actions:
    skills-mcp:
      function: src/actions/skills-mcp/index.js
      web: 'yes'
      annotations:
        require-adobe-auth: false
      runtime: nodejs:20
```

**Endpoint shape:**
```
https://<namespace>.adobeioruntime.net/api/v1/web/<project>/skills-mcp
```

### 2.2 MCP Transport: Streamable HTTP, Stateless Mode

**Decision:** `StreamableHTTPServerTransport` with `sessionIdGenerator: undefined`.

**Rationale:**
- Streamable HTTP is the current MCP spec (2025-03-26), replacing deprecated HTTP+SSE
- Stateless mode is mandatory for I/O Runtime — containers are ephemeral per invocation,
  there is no persistent process to hold session state
- Single `/mcp` equivalent endpoint (the web action URL itself) handles both POST and GET
- No SSE streaming needed — all three tools are simple request/response, not long-running

**The critical line:**
```javascript
const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: undefined  // stateless — required for serverless
})
```

**Wire protocol:** Every MCP interaction is a self-contained HTTP POST carrying a JSON-RPC 2.0
envelope. The sequence per agent session is:
1. `POST` → `initialize` → server returns capabilities, no `Mcp-Session-Id` issued
2. `POST` → `notifications/initialized` → `202 Accepted`, no body
3. `POST` → `tools/list` → returns tool schemas for all three tools
4. `POST` → `tools/call` `list_skills` → catalog JSON
5. `POST` → `tools/call` `load_skill` → full SKILL.md body
6. `POST` → `tools/call` `read_skill_resource` → single reference file content

### 2.3 Skills Content Strategy: Build-Time Bundled

**Decision:** Skills content is embedded at build time via a generated `registry.json` artifact.
No runtime storage libraries (aio-lib-state, aio-lib-files, aio-lib-db) are used for content
serving.

**Rationale:**
- Skills change on a development cadence (Git commits), not a runtime cadence
- Content is read-only from the action's perspective
- All three Adobe storage libs add 5-20ms network round-trips per call to serve content
  that has not changed since last deploy — wrong trade for this use case
- Module-scope caching in Node.js means warm containers serve all content from process memory
  at effectively zero cost
- `registry.json` is generated at `aio app build` time, not runtime

**Performance stack (warm container):**
- `list_skills`: ~0ms — catalog array already in module scope
- `load_skill`: ~0ms — skill body in module scope via registry.json
- `read_skill_resource`: ~0ms — reference files in module-scope Map

**Future migration path:** If the team reaches a point where updating skills without a
redeploy is operationally necessary, `aio-lib-db` (MongoDB-compatible document store,
currently pre-GA) is the correct migration target. The document schema maps directly to
the current skill object shape. No architectural change needed — swap the registry.json
import for a db.collection('skills').findOne() call.

### 2.4 MCP Tool Surface: Three Tools Only

**Decision:** Expose exactly three tools matching the Agent Skills progressive disclosure
contract. No additional tools.

| Tool | Input | Returns | When Agent Calls It |
|---|---|---|---|
| `list_skills` | none | `[{name, description}]` array | Once per session, discovery |
| `load_skill` | `skill_name: string` | Full SKILL.md body markdown | When user intent matches skill description |
| `read_skill_resource` | `skill_name: string`, `resource_path: string` | Raw file content | When SKILL.md body explicitly directs agent to a reference file |

**Why not MCP Resources primitive instead of Tools?**
The MCP Resources primitive is for static URIs the client can subscribe to. Tools are the
right primitive here because the agent needs to make decisions about *which* skill and
*which* resource to fetch based on context — that's tool-calling behavior, not resource
subscription behavior.

---

## 3. Project Structure

```
adobe-developer-skills-mcp/
├── app.config.yaml
├── package.json
├── .env                              ← not committed
├── scripts/
│   └── generate-registry.js          ← build-time script, not deployed
└── src/
    └── actions/
        └── skills-mcp/
            ├── index.js              ← MCP server, single web action
            ├── registry.json         ← generated by generate-registry.js
            └── skills/
                ├── app-builder-actions/
                │   ├── SKILL.md
                │   └── references/
                │       ├── ACTION_STRUCTURE.md
                │       ├── MANIFEST_PATTERNS.md
                │       ├── ERROR_HANDLING.md
                │       └── IO_EVENTS.md
                ├── app-builder-frontend/
                │   ├── SKILL.md
                │   └── references/
                │       ├── REACT_SPECTRUM.md
                │       ├── ACTION_WIRING.md
                │       ├── TOKEN_PATTERNS.md
                │       └── UI_KIT_COMPONENTS.md
                ├── workfront-extension/
                │   ├── SKILL.md
                │   └── references/
                │       ├── EXTENSION_REGISTRATION.md
                │       ├── SHELL_INTEGRATION.md
                │       ├── NAVIGATION.md
                │       └── COMMUNICATION.md
                ├── workfront-tasks-api/
                │   ├── SKILL.md
                │   └── references/
                │       ├── TASK_FIELDS.md
                │       ├── BULK_OPERATIONS.md
                │       ├── CUSTOM_FORMS.md
                │       └── QUERY_PATTERNS.md
                ├── workfront-issues-api/
                │   ├── SKILL.md
                │   └── references/
                │       ├── ISSUE_FIELDS.md
                │       ├── STATUS_TRANSITIONS.md
                │       ├── ASSIGNMENTS.md
                │       └── QUERY_PATTERNS.md
                └── workfront-forms-api/
                    ├── SKILL.md
                    └── references/
                        ├── PARAMETER_FIELDS.md
                        ├── PARAMETER_VALUES.md
                        ├── FORM_STRUCTURE.md
                        └── CATEGORY_OBJECT.md
```

---

## 4. Implementation Details

### 4.1 Build Script: `scripts/generate-registry.js`

Runs at build time (not deployed). Walks the skills directory, parses SKILL.md frontmatter,
inlines skill bodies, lists reference file paths, and writes `registry.json`.

```javascript
// scripts/generate-registry.js
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import crypto from 'crypto'

const SKILLS_DIR = './src/actions/skills-mcp/skills'
const OUTPUT = './src/actions/skills-mcp/registry.json'

const registry = []

for (const folder of fs.readdirSync(SKILLS_DIR)) {
  const skillPath = path.join(SKILLS_DIR, folder)
  if (!fs.statSync(skillPath).isDirectory()) continue

  const skillMdPath = path.join(skillPath, 'SKILL.md')
  if (!fs.existsSync(skillMdPath)) continue

  const raw = fs.readFileSync(skillMdPath, 'utf8')
  const { data: frontmatter, content: body } = matter(raw)

  if (!frontmatter.name || !frontmatter.description) {
    console.warn(`Skipping ${folder}: missing name or description in frontmatter`)
    continue
  }

  const refsDir = path.join(skillPath, 'references')
  const references = fs.existsSync(refsDir)
    ? fs.readdirSync(refsDir)
        .filter(f => f.endsWith('.md'))
        .map(f => `references/${f}`)
    : []

  registry.push({
    name: frontmatter.name,
    description: frontmatter.description,
    body,
    folder,       // relative folder name for path resolution at runtime
    references    // available paths for read_skill_resource validation
  })
}

// deployId enables cache invalidation if aio-lib-state is added later
const deployId = crypto.createHash('md5')
  .update(JSON.stringify(registry))
  .digest('hex')
  .slice(0, 8)

fs.writeFileSync(OUTPUT, JSON.stringify({ deployId, skills: registry }, null, 2))
console.log(`Registry built: ${registry.length} skills, deployId: ${deployId}`)
```

**Wire into build in `package.json`:**
```json
{
  "scripts": {
    "prebuild": "node scripts/generate-registry.js",
    "build": "aio app build",
    "deploy": "npm run prebuild && aio app deploy"
  }
}
```

### 4.2 Action Entry Point: `src/actions/skills-mcp/index.js`

```javascript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'
import registryData from './registry.json' assert { type: 'json' }

const { deployId, skills: registry } = registryData

// ── Module-scope cache — built once per container, zero cost on warm invocations ──

// Catalog: name + description only, for list_skills response
const catalog = registry.map(s => ({ name: s.name, description: s.description }))

// Resource cache: all reference file contents keyed by "skillName::path"
const SKILLS_DIR = path.join(__dirname, 'skills')
const resourceCache = new Map()

for (const skill of registry) {
  const refsDir = path.join(SKILLS_DIR, skill.folder, 'references')
  if (!fs.existsSync(refsDir)) continue
  for (const file of fs.readdirSync(refsDir)) {
    if (!file.endsWith('.md')) continue
    const key = `${skill.name}::references/${file}`
    resourceCache.set(key, fs.readFileSync(path.join(refsDir, file), 'utf8'))
  }
}

// ── MCP server factory — new instance per request (stateless requirement) ──

function buildMcpServer() {
  const server = new McpServer({
    name: 'adobe-developer-skills',
    version: '1.0.0'
  })

  // TOOL 1: list_skills
  server.tool(
    'list_skills',
    'List all available Adobe developer skills with names and descriptions. ' +
    'Call this once at session start to discover available skills.',
    {},
    async () => ({
      content: [{
        type: 'text',
        text: JSON.stringify(catalog, null, 2)
      }]
    })
  )

  // TOOL 2: load_skill
  server.tool(
    'load_skill',
    'Load the full instructions for a named skill. Call this when the user request ' +
    'matches a skill domain. Returns the complete SKILL.md body with instructions, ' +
    'patterns, and pointers to reference files.',
    {
      skill_name: z.string().describe('The name field from list_skills')
    },
    async ({ skill_name }) => {
      const skill = registry.find(s => s.name === skill_name)
      if (!skill) {
        return {
          content: [{ type: 'text', text: `Skill not found: ${skill_name}` }],
          isError: true
        }
      }
      return {
        content: [{ type: 'text', text: skill.body }]
      }
    }
  )

  // TOOL 3: read_skill_resource
  server.tool(
    'read_skill_resource',
    'Read a specific reference file from a skill. Only call this when the skill ' +
    'instructions explicitly direct you to a reference file. Returns raw file content.',
    {
      skill_name: z.string().describe('The skill name'),
      resource_path: z.string().describe(
        'Relative path within the skill folder, e.g. references/TASK_FIELDS.md'
      )
    },
    async ({ skill_name, resource_path }) => {
      const key = `${skill_name}::${resource_path}`
      const content = resourceCache.get(key)
      if (!content) {
        const skill = registry.find(s => s.name === skill_name)
        if (!skill) {
          return {
            content: [{ type: 'text', text: `Skill not found: ${skill_name}` }],
            isError: true
          }
        }
        const available = skill.references.join(', ')
        return {
          content: [{
            type: 'text',
            text: `Resource not found: ${resource_path}. Available: ${available}`
          }],
          isError: true
        }
      }
      return {
        content: [{ type: 'text', text: content }]
      }
    }
  )

  return server
}

// ── I/O Runtime web action handler ──

export async function main(params) {
  const server = buildMcpServer()

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined  // stateless — mandatory for I/O Runtime
  })

  await server.connect(transport)

  // I/O Runtime passes raw HTTP request via __ow_* params
  const body = params.__ow_body
    ? Buffer.from(params.__ow_body, 'base64').toString('utf8')
    : '{}'

  const response = await transport.handleRequest({
    method: params.__ow_method?.toUpperCase() ?? 'POST',
    headers: params.__ow_headers ?? {},
    body
  })

  return {
    statusCode: response.status ?? 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: response.body
  }
}
```

### 4.3 SKILL.md Format

Every skill follows this structure. The frontmatter drives discovery; the body drives activation.
Reference file pointers in the body must be explicit and conditional — the agent only loads
what it needs.

```markdown
---
name: skill-name-kebab-case
description: >
  One to three sentences. What domain this covers. When to use it.
  Include key trigger terms: object types, API names, operation types.
  Use when [specific scenario]. Do not use when [anti-pattern].
metadata:
  author: adobe-enterprise-architecture
  version: "1.0"
---

# Skill Title

## Quick Start
The most common pattern, immediately usable without loading any reference files.
Keep this section self-contained.

## [Topic Area]
Explanation of core patterns. If a reference file adds depth here, say:
"For complete field listings see `references/FIELD_REFERENCE.md` — load this
when you need specific field names or are mapping from an external system."

## Key Constraints
- Constraint 1 (the things agents get wrong without guidance)
- Constraint 2
- Constraint 3
```

**Frontmatter rules:**
- `name`: kebab-case, matches folder name exactly
- `description`: written for the agent router, not humans. Include trigger phrases
  that match how developers actually ask questions.
- Keep body under 500 lines / 5000 tokens
- Every reference file pointer must include *when* to load it, not just that it exists

### 4.4 Dependencies

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.17.4",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "gray-matter": "^4.0.3"
  }
}
```

Note: `gray-matter` is devDependency only — used by `generate-registry.js` at build time,
not bundled into the deployed action.

---

## 5. Progressive Disclosure: How It Works in Practice

The three-stage pattern and what enters agent context at each stage:

```
Stage 1 — Discovery (~50 tokens per skill, injected at session start)
  Agent receives: [{ name: "app-builder-actions", description: "..." }, ...]
  Cost: Zero after first warm container invocation (module-scope catalog array)

Stage 2 — Activation (~2000-5000 tokens, on intent match)
  Agent calls: load_skill({ skill_name: "workfront-tasks-api" })
  Agent receives: Full SKILL.md body
  Cost: Zero (module-scope registry body field)

Stage 3 — Execution (variable, only when SKILL.md directs it)
  Agent calls: read_skill_resource({
    skill_name: "workfront-tasks-api",
    resource_path: "references/TASK_FIELDS.md"
  })
  Agent receives: Raw markdown content of that file
  Cost: Zero (module-scope resourceCache Map lookup)
```

The other three reference files for that skill never enter context unless the
SKILL.md body explicitly directs the agent to them AND the agent determines they
are needed for the current task. A question about task status transitions loads
`TASK_FIELDS.md`; it does not load `BULK_OPERATIONS.md` or `CUSTOM_FORMS.md`.

---

## 6. Client Configuration

### Claude Desktop / Claude Code

```json
{
  "mcpServers": {
    "adobe-developer-skills": {
      "url": "https://<namespace>.adobeioruntime.net/api/v1/web/<project>/skills-mcp",
      "type": "streamable-http"
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json` in the project root or global Cursor settings:

```json
{
  "mcpServers": {
    "adobe-developer-skills": {
      "url": "https://<namespace>.adobeioruntime.net/api/v1/web/<project>/skills-mcp",
      "type": "streamable-http"
    }
  }
}
```

No `mcp-remote` wrapper needed. The web action is a public endpoint with no auth,
and `type: streamable-http` connects directly.

---

## 7. Deployment

```bash
# Install deps
npm install

# Generate registry (also runs automatically via prebuild)
node scripts/generate-registry.js

# Deploy to App Builder workspace
aio app use <workspace-config.json>
aio app deploy

# Verify endpoint responds
curl -X POST \
  https://<namespace>.adobeioruntime.net/api/v1/web/<project>/skills-mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","clientInfo":{"name":"test","version":"1.0"},"capabilities":{}}}'
```

Expected initialize response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-03-26",
    "serverInfo": { "name": "adobe-developer-skills", "version": "1.0.0" },
    "capabilities": { "tools": { "listChanged": false } }
  }
}
```

Note: No `Mcp-Session-Id` in response headers confirms stateless mode is active.

---

## 8. Decisions Deferred / Future Considerations

### Dynamic Skills (Future)
If the team needs to update skills without a redeploy, migrate content to `aio-lib-db`
(MongoDB-compatible document store). Currently pre-GA. The document schema maps directly
to the current skill object shape in `registry.json`. Migration is a targeted change to
the content-fetching layer with no changes to the MCP tool interface or client config.

### Cross-Container Caching (If Needed)
If cold start frequency becomes measurable (high-traffic scenario with many new containers
spinning up), add `aio-lib-state` as a secondary cache layer between the module scope and
disk. The `deployId` field in `registry.json` is already present to serve as a cache
invalidation key. This optimization is likely unnecessary for internal team tooling traffic.

### Additional Skills
Adding a new skill is: create folder + SKILL.md + four reference files, run
`npm run deploy`. No code changes required. The registry generator picks up new folders
automatically.

### Auth
If the team ever needs to restrict access, add an `X-API-Key` header check at the top of
`main()` against a param stored in the action's default params (encrypted at rest by
I/O Runtime). This does not require changing the MCP transport configuration.

---

## 9. Key References

- Adobe App Builder MCP generator template: https://github.com/adobe/generator-app-remote-mcp-server-generic
- MCP TypeScript SDK: https://github.com/modelcontextprotocol/typescript-sdk
- Agent Skills spec: https://agentskills.io/specification
- Anthropic skills repo (examples): https://github.com/anthropics/skills
- MCP Streamable HTTP spec: https://modelcontextprotocol.io/specification/2025-03-26/basic/transports
- App Builder storage options: https://developer.adobe.com/app-builder/docs/guides/app_builder_guides/storage/
- aio-lib-db (pre-GA): https://developer.adobe.com/app-builder/docs/guides/app_builder_guides/storage/database
