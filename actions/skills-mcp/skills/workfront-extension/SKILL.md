---
name: workfront-extension
description: >
  Adobe Workfront product extension development using App Builder (workfront-ui-1 extension point).
  Use when building Workfront extensions: mainMenu left-nav portal views, secondaryNav tabs on Task/Project/Documents/Issue/Portfolio/Program pages,
  reading sharedContext (IMS token, object ID, user, hostname), registering extension points,
  or communicating between your extension iframe and the Workfront host via the UIX guest SDK.
  Always pair with the app-builder-frontend skill for UI component, React Spectrum, token handling, and action-wiring work —
  all Workfront extensions are App Builder apps with a React frontend.
  Do not use for Workfront REST API calls (use workfront-tasks-api, workfront-issues-api, or workfront-forms-api instead).
metadata:
  author: adobe-enterprise-architecture
  version: "1.0"
  extensionPoints:
    - workfront/ui/1
    - workfront/doc-details/1
---

# Workfront Extension Developer

## Role
Extension specialist for Workfront product extensions built on App Builder (workfront-ui-1 extension point).

## Constitution & Impl-Log

> Skip any file below that does not exist in this project — not all projects use all layers.

### Design Principles (read-only, if `docs/design-principles/` exists)
- `docs/design-principles/architecture.md` — approved patterns, banned patterns; read before any structural decision
- `docs/design-principles/frontend.md` — UI framework, component rules, state management, accessibility; read before writing implementation code (load if file exists)

### Impl-Log (if `docs/impl-log/` exists)
**Before implementing:**
- Read `docs/impl-log/frontend/index.md` — current component inventory, routes, state patterns in use (required before writing new code)
- Scan `docs/impl-log/frontend/log.md` header lines — prior decisions relevant to this task

**At task completion:**
- Update `docs/impl-log/frontend/index.md` in-place to reflect new current state
- Append an entry to `docs/impl-log/frontend/log.md`

## Related Skills

- **app-builder-frontend** — Always load alongside this skill. All Workfront extensions are App Builder apps with a React/Spectrum frontend. Use it for component building, IMS token handling, calling backend actions, and any UI work inside `web-src/`.

## When to Load References

- **MAIN_MENU_EXTENSION.md** — Load when building a mainMenu extension (custom left-nav portal views). Covers register() + getItems(), HashRouter routing, two-phase iframe pattern, calling backend actions from widgets. Derived from a fully working reference project.
- **SECONDARY_NAV_EXTENSION.md** — Load when building secondaryNav extensions (custom tabs on Task, Project, Documents, Issue, Portfolio, or Program detail pages). Covers combined registration, all supported object types, local dev conflict avoidance, and the attach() view pattern.
- **SHARED_CONTEXT.md** — Load when reading context data from Workfront (IMS token, object ID/type, hostname, user info). Includes the full ShowValues debug component, token usage for API calls, and the AuthTokenManager JWT utility.
- **FORMS_WIDGET.md** — Load when building a widget embedded in a Workfront custom form field (widgets extension point). Covers registration, dimension config, sharedContext access, and how admins wire it up.
- **EXTENSION_REGISTRATION.md** — Load when registering the extension in Adobe Developer Console or configuring ext.config.yaml
- **SHELL_INTEGRATION.md** — Load when attaching to the Workfront unified shell, using the UIX guest SDK, setting up local dev testing (extensionOverride), or debugging Chrome 142 local network issues
- **NAVIGATION.md** — Load when implementing panel/route navigation within the extension
- **COMMUNICATION.md** — Load when sending messages between the extension iframe and the Workfront host

## Architecture

Workfront extensions:
- Run as iframes injected by the Workfront shell
- Communicate via the UIX (UI Extensibility) messaging protocol
- Auth token is provided by the host (no standalone IMS flow needed)
- Frontend lives at `src/workfront-ui-1/web-src/`
- Actions live at `src/workfront-ui-1/actions/`
- Extension manifest at `src/workfront-ui-1/ext.config.yaml`

## Quick Reference

| Task | Load |
|------|------|
| Build a mainMenu extension (left-nav portal) | MAIN_MENU_EXTENSION.md |
| Build a secondaryNav tab (Task/Project/Docs/etc.) | SECONDARY_NAV_EXTENSION.md |
| Embed a custom widget in a Workfront custom form | FORMS_WIDGET.md |
| Read IMS token, object ID, user, hostname | SHARED_CONTEXT.md |
| Debug what Workfront is passing to your extension | SHARED_CONTEXT.md (ShowValues component) |
| Register extension point / configure ext.config.yaml | EXTENSION_REGISTRATION.md |
| Attach to host / UIX guest SDK basics | SHELL_INTEGRATION.md |
| Test locally with extensionOverride / fix Chrome 142 | SHELL_INTEGRATION.md |
| Panel/route navigation within extension | NAVIGATION.md |
| Message host app | COMMUNICATION.md |
| Build any UI component | app-builder-frontend skill → REACT_SPECTRUM.md |
| Call backend actions | app-builder-frontend skill → ACTION_WIRING.md |
| Handle IMS auth / token exchange | app-builder-frontend skill → TOKEN_PATTERNS.md |
