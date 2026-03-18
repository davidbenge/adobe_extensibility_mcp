# Adobe Extensibility MCP

An MCP (Model Context Protocol) server that gives AI coding assistants — Claude Code, and any other MCP-compatible agent — curated Adobe developer knowledge on demand. Instead of copy-pasting docs or hoping your AI already knows the patterns, point your agent at this server and it will pull the right guidance automatically as you build.

Deployed on Adobe I/O Runtime (serverless, no infrastructure to manage).

---

## What It Does

The server exposes three MCP tools:

| Tool | What it does |
|------|-------------|
| `list_skills` | Returns all available skill domains |
| `load_skill` | Loads a skill's core guidance for a given domain |
| `read_skill_resource` | Fetches a specific reference file (e.g. error handling patterns, action structure) |

When you're building an App Builder action or a Workfront extension, your AI agent calls these tools automatically and gets back precise, copy-paste-ready patterns — the same way a senior developer would hand you the right doc at the right moment.

---

## Available Skills

| Skill | When your agent uses it |
|-------|------------------------|
| `app-builder-actions` | Writing or reviewing App Builder backend actions on I/O Runtime |
| `app-builder-frontend` | React + Adobe React Spectrum UIs for App Builder extension points |
| `workfront-extension` | Registering and building Workfront product extensions (workfront-ui-1) |
| `workfront-tasks-api` | Calling the Workfront Tasks REST API (TASK objects — CRUD, bulk ops, queries) |
| `workfront-issues-api` | Calling the Workfront Issues/Requests REST API (OPTASK — assignments, status, queues) |
| `workfront-forms-api` | Working with Workfront custom forms — Category, Parameter, parameterValues on any object type |
| `workfront-projects-api` | Projects, Portfolios, Programs, and Milestones |
| `workfront-events-api` | Workfront Event Subscriptions (webhooks) — setup, payload handling, reliability |
| `workfront-documents-api` | Uploading, versioning, and organizing Workfront Documents |
| `workfront-approvals-api` | Workfront Approval Processes — decisions, routes, and status integration |

---

## Using It in Your Project

Add the server to your project's `.mcp.json` (or your global MCP config). A `.mcp.json.example` is included in this repo as a starting point — copy it to `.mcp.json` and add any other servers you need.

**Stage** (latest changes, may be updated frequently):
```json
{
  "mcpServers": {
    "adobe-extensibility-mcp": {
      "type": "streamable-http",
      "url": "https://27200-adobeextmcp-stage.adobeioruntime.net/api/v1/web/adobe-extensibility-mcp/skills-mcp"
    }
  }
}
```

**Production** (stable, recommended for day-to-day development):
```json
{
  "mcpServers": {
    "adobe-extensibility-mcp": {
      "type": "streamable-http",
      "url": "https://27200-adobeextmcp.adobeioruntime.net/api/v1/web/adobe-extensibility-mcp/skills-mcp"
    }
  }
}
```

That's it. Your agent now has access to all skill domains.

### Claude Code

Claude Code will automatically call `list_skills` and `load_skill` when you ask it to do something Adobe-related (build an action, wire up a Workfront extension, etc.). To make it lean on the MCP server consistently, add a line to your project's `CLAUDE.md`:

```markdown
Use the `adobe-extensibility-mcp` MCP server for all Adobe App Builder and Workfront development patterns.
```

Then just work normally — ask Claude to build something and it will pull the right skill content before writing code.

---

## How It Works

```
Your prompt → AI agent → list_skills / load_skill / read_skill_resource
                                  ↓
              Adobe I/O Runtime (serverless action)
                                  ↓
              Skill content returned to agent → code generation
```

Skills are structured as:
- A `SKILL.md` file with routing description, core concepts, and a quick-reference table
- `references/*.md` files with focused, copy-paste-ready patterns (one concern per file)

The agent's routing description tells it *when* to load each skill — so `app-builder-actions` fires on backend action work, not on frontend or API tasks.

---

## Running Your Own Instance

### Prerequisites

- [Adobe I/O CLI](https://developer.adobe.com/app-builder/docs/getting_started/): `npm install -g @adobe/aio-cli`
- An Adobe Developer Console project with App Builder enabled
- Node.js 20+

### Setup

```bash
git clone https://github.com/your-org/adobe-extensibility-mcp
cd adobe-extensibility-mcp
npm install
aio login
aio app use   # select your org/project/workspace
```

### Deploy

```bash
npm run deploy
aio app get-url   # prints your action URL
```

Update the `url` in your `.mcp.json` with the URL from `get-url`.

### Local Development

```bash
npm run dev   # starts local dev server via aio app run
npm test      # runs the full test suite
```

---

## Adding a New Skill

Skills live in `actions/skills-mcp/skills/<skill-name>/`. To add one:

1. Create `SKILL.md` with the required frontmatter:

```yaml
---
name: my-skill
description: >
  When to use this skill. Include trigger phrases so the agent routes correctly.
  Do not use when X, Y, or Z.
metadata:
  author: your-name
  version: "1.0"
---
```

2. Add `references/*.md` files — one concern per file, `SCREAMING_SNAKE_CASE.md` naming, ≤200 lines

3. Regenerate the registry and run tests:

```bash
node scripts/generate-registry.js
npm test
```

4. Deploy:

```bash
npm run deploy
```

---

## Development Workflow

### Branching

| Branch | Purpose |
|--------|---------|
| `stage` | Default branch — all PRs target here |
| `main` | Production — only promoted from `stage` via PR |

### Making Changes

```bash
git checkout stage
git checkout -b my-feature
# make changes
npm test                                      # unit tests must pass
E2E_URL=<your-action-url> npm run test:e2e:report  # run e2e against your deployed env
git add test-results/e2e-report.md
git commit -m "test: update e2e test results"
# open PR targeting stage
```

### CI Checks

**PRs → `stage`**

| Check | What it does |
|-------|-------------|
| `Unit Tests` | Runs jest, commits `test-results/unit-report.md` to the branch |
| `E2E Results Present` | Fails if `test-results/e2e-report.md` is not committed |

**PRs → `main`** (promoting stage to prod)

| Check | What it does |
|-------|-------------|
| `E2E Tests (Stage)` | Runs live e2e tests against the stage endpoint — stage must be green before prod merge |

### Deploy Pipeline

```
PR → stage   →   merge   →   deploy to stage   →   e2e post-deploy verification
PR → main    →   merge   →   deploy to prod    →   e2e post-deploy verification
```

### Test Commands

```bash
npm test                                           # unit tests
npm run test:e2e                                   # e2e against stage (default)
E2E_URL=<url> npm run test:e2e                     # e2e against any endpoint
npm run test:e2e:report                            # e2e + generate committed report
npm run test:all:report                            # unit + e2e reports (pre-PR)
```

---

## Contributing

Sharing is caring — and Adobe's extensibility ecosystem is big enough that no one person has all the patterns.

If you've figured out the right way to do something in App Builder, Workfront, AEM, or any other Adobe product extension surface, consider contributing a skill or improving an existing reference file.

**Ways to contribute:**

- **New skill domain** — a new product or extension surface (e.g. AEM Content Fragments, Experience Platform extensions)
- **New reference file** — a focused pattern doc for an existing skill (e.g. rate limiting, pagination, webhook handling)
- **Corrections** — if a pattern is outdated or wrong, fix it; bad AI guidance is worse than no guidance
- **Better routing descriptions** — if the agent is loading the wrong skill for your use case, the `description` in `SKILL.md` is why; improve it

**To contribute:**

1. Fork the repo
2. Add or update skill content following the structure above
3. Run `npm test` — all tests must pass
4. Open a PR with a short description of what the skill covers and when an agent should use it

No contribution is too small. A single well-written reference file can save hours of debugging for every developer whose AI pulls it.

---

## Related: Agentic Dev Team Framework

This MCP server is designed to work alongside the **[Cursor Agentic Dev Team](https://github.com/davidbenge/cursor_ext_agentic_dev-team)** framework — a production-grade multi-persona AI workflow for Cursor that brings structure to the full SDLC.

Together they form a complete end-to-end agentic development experience:

| Layer | Repo | What it provides |
|-------|------|-----------------|
| **Knowledge** | This repo (`adobe-extensibility-mcp`) | Domain-specific Adobe patterns served on demand via MCP — the right code guidance at the right moment |
| **Process** | [`cursor_ext_agentic_dev-team`](https://github.com/davidbenge/cursor_ext_agentic_dev-team) | Named AI personas, slash-command pipelines, and structured workflows that orchestrate planning, implementation, review, and logging |

**How they work together:** The agentic dev team framework wires up named personas (Architect, Dev Lead, Security Expert, etc.) that collaborate through structured `/plan`, `/dev`, and `/epic` command pipelines. Each domain specialist persona is configured to pull from this MCP server — so when the App Builder developer persona starts implementing a Runtime action, it automatically loads the `app-builder-actions` skill with the correct patterns before writing a line of code.

The result: AI agents that follow a real team's workflow *and* have the right technical knowledge to execute it correctly.

---

## License

MIT
