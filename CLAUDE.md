# adobe-extensibility-mcp

## Project Summary

A skills-serving MCP server deployed on Adobe I/O Runtime. Serves curated Adobe developer knowledge via 3 MCP tools to any MCP-compatible coding agent (Claude Code, etc.).

## Commands

```bash
npm test                          # pretest generates registry, then runs jest
npm run build                     # prebuild generates registry, then webpack
npm run dev                       # aio app run (local dev server)
npm run deploy                    # build + aio app deploy
node scripts/generate-registry.js  # regenerate registry.json manually
npm run lint                      # eslint actions/
```

## Architecture

- **Single action**: `actions/skills-mcp/index.js` — no frontend, no database, no auth
- **MCP tools**: `list_skills`, `load_skill`, `read_skill_resource`
- **Skill content**: `actions/skills-mcp/skills/[domain]/SKILL.md` + `references/*.md`
- **Build pipeline**: `scripts/generate-registry.js` → `actions/skills-mcp/registry.json`
- **Runtime**: nodejs:20, Adobe I/O Runtime (Apache OpenWhisk)

## Request Flow

```
HTTP POST → main(params) → handleMcpRequest() → buildMcpServer() → StreamableHTTPServerTransport
```

## How to Add a Skill

1. Create `actions/skills-mcp/skills/<skill-name>/SKILL.md` with required frontmatter:
   ```yaml
   ---
   name: skill-name   # must match folder name
   description: >
     Routing description with trigger phrases.
   metadata:
     author: adobe-enterprise-architecture
     version: "1.0"
   ---
   ```
2. Create `actions/skills-mcp/skills/<skill-name>/references/*.md` reference files
3. Run `node scripts/generate-registry.js` to verify (should report N+1 skills, no errors)
4. Run `npm test` — all tests must pass
5. Update `docs/design-principles/vision.md` skill domains table

## Testing Pattern

Tests call `main(params)` directly (no HTTP server needed):

```javascript
const { main } = require('./actions/skills-mcp/index.js')
const result = await main({ __ow_method: 'post', __ow_body: JSON.stringify(request), LOG_LEVEL: 'info' })
```

## Key Files

| File | Purpose |
|------|---------|
| `actions/skills-mcp/index.js` | MCP server entry point |
| `actions/skills-mcp/registry.js` | Loads registry.json, builds catalog + resourceCache |
| `actions/skills-mcp/registry.json` | Generated — do not edit |
| `actions/skills-mcp/skills/` | Skill markdown files |
| `scripts/generate-registry.js` | Build script |
| `app.config.yaml` | I/O Runtime deployment config |
| `test/skills-mcp.test.js` | Test suite |

## Design Principles

See `docs/design-principles/` for architecture, backend, testing, security, and skills content guidelines.

## Documentation Standards

### Skill Content (`actions/skills-mcp/skills/**`)
- `SKILL.md` frontmatter must include `name` (matches folder name exactly) and `description`
- `description` must be routing-optimized: include trigger phrases, when to use, when NOT to use
- SKILL.md body must contain: Role, When to Load References, Core Concepts, Quick Reference table
- Reference files: one concern per file, SCREAMING_SNAKE_CASE.md naming, ≤200 lines, copy-paste-ready content

### Design Principles (`docs/design-principles/**`)
- These files are non-negotiable reference — do not edit directly
- Proposed changes must be raised with the Architect; conflicts resolved before any code changes

### Implementation Log (`docs/impl-log/**`)
- `index.md` files track current system state — update in-place, never append history entries
- `log.md` files are append-only history — never rewrite or delete past entries
- `docs/stories/` files may be committed (use when not tracking work in Jira)

## Multi-Persona Workflow Rules

1. Never modify another persona's section; append only; disagreements → Debate Log
2. `docs/stories/` files are ephemeral; never commit
3. impl-log index files updated in-place; never append
4. `docs/design-principles/` is non-negotiable; conflicts → Architect
5. Tier 1 security finding blocks all progression
6. Tier 2 security finding requires human disposition
7. Large artifacts (>50 lines) extracted to files, linked from task-plan

## Scripts Conventions

Applies to: `scripts/**/*`

- All project scripts belong under `scripts/`.
- Scripts are **CommonJS** (`.js`, `require`/`module.exports`). No TypeScript in scripts/.
- One script per concern; document purpose, env vars, and usage in a header comment.
- Current scripts:
  - `scripts/generate-registry.js` — Walks `actions/skills-mcp/skills/`, parses SKILL.md frontmatter, writes `actions/skills-mcp/registry.json`. Run via `npm run prebuild` or `npm run pretest`.
- When adding a new script, place it directly under `scripts/` (no subdirectories needed for simple projects).
- Do not add scripts at repo root or under `actions/`.
