# Vision

## Problem

Adobe enterprise developers work across App Builder, Workfront APIs, and IMS patterns — but this institutional knowledge is scattered, unstructured, and unavailable to AI coding agents at the point of need.

Without a shared, machine-readable knowledge source, every agent session starts from scratch. Developers must re-prompt context into every session, and agents make mistakes that institutional knowledge would prevent.

## Solution

`adobe-extensibility-mcp` is a remote MCP server that serves curated Adobe developer skill domains on demand. It implements the **Agent Skills progressive disclosure pattern**:

1. Agent calls `list_skills` to discover available domains
2. Agent calls `load_skill` to load a skill's when-to-load guidance
3. Agent calls `read_skill_resource` to load specific reference files when needed

This delivers relevant knowledge at the right moment — without bloating context with irrelevant content.

## Success Metrics

- 6 skill domains served correctly
- All 3 MCP tools return valid responses
- Agents using this server make fewer App Builder, Workfront, and IMS pattern mistakes
- Knowledge can be updated by editing markdown files and redeploying — no code changes required

## What This Is NOT

- **Not a frontend application** — no React, no UI
- **Not a database-backed system** — no Neo4j, no SQL, no state store for skill data
- **Not an authenticated endpoint** — public endpoint, no IMS, no API key required (the skills are not sensitive)
- **Not a general-purpose MCP server** — only 3 tools, scoped to Adobe developer knowledge

## Skill Domains

| Skill | Description |
|-------|-------------|
| `app-builder-actions` | Adobe I/O Runtime action patterns, error handling, State Store |
| `app-builder-frontend` | React Spectrum, IMS token patterns, action wiring |
| `workfront-extension` | Workfront product extension registration and shell integration |
| `workfront-tasks-api` | Workfront Tasks REST API patterns |
| `workfront-issues-api` | Workfront Issues/Requests REST API patterns |
| `workfront-forms-api` | Workfront Custom Forms (Category/Parameter) API |
