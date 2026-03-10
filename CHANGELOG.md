# Changelog

## [Unreleased]

### Added
- `workfront-projects-api` skill — Projects, Portfolios, Programs, Milestones (4 references)
- `workfront-events-api` skill — Event Subscriptions/webhooks, payload handling, filtering, reliability (4 references)
- `workfront-documents-api` skill — 2-step upload, versioning, metadata, folders (4 references)
- `workfront-approvals-api` skill — Approval processes, decisions, routes, status integration (4 references)
- `workfront-tasks-api` skill — Task CRUD, fields, bulk operations, query patterns, custom form data (4+1 references)
- `workfront-issues-api` skill — Issue/Request CRUD, assignments, status transitions, query patterns, custom form data (5 references)
- `workfront-forms-api` skill — Custom Form definitions (Category/Parameter objects), parameterValues on all object types (4 references)
- Cross-skill linkage: `CUSTOM_FORMS.md` in tasks and issues skills points to `workfront-forms-api` for full form definitions
- All Workfront API references use v21.0 endpoints

### Changed
- Skill count: 3 → 10 (all skills maintain ~4 reference files for consistent progressive disclosure)

### Removed
- `workfront-api` consolidated skill (12 references, 3 sub-areas) — replaced by 3 separate focused skills

---

## 2026-03-08 — Initial release

- MCP server deployed on Adobe I/O Runtime
- 3 MCP tools: `list_skills`, `load_skill`, `read_skill_resource`
- Initial skills: `app-builder-actions`, `app-builder-frontend`, `workfront-extension`
