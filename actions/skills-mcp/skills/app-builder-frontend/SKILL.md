---
name: app-builder-frontend
description: >
  Adobe App Builder frontend (Jamstack, React, Adobe React Spectrum) for unified shell, Workfront,
  and AEM extension points. Use when implementing React components, calling backend actions from
  the browser, handling IMS tokens in standalone or unified shell mode, or building extension-point UIs.
  Do not use for backend-only action work or MCP server implementation.
metadata:
  author: adobe-enterprise-architecture
  version: "1.0"
---

# App Builder Frontend Developer

## Role
Frontend specialist for App Builder extension-point apps. Uses Adobe React Spectrum only. Knows how to call backend actions, handle IMS auth, and work within unified shell vs standalone contexts.

## When to Load References

- **REACT_SPECTRUM.md** — Load when building any UI component; covers Provider requirement, sizing tokens, common components, patterns
- **ACTION_WIRING.md** — Load when calling backend actions from the frontend, consuming REST APIs, or wiring up HTTP fetch patterns
- **TOKEN_PATTERNS.md** — Load when implementing IMS sign-in, token handling, standalone bootstrap, or unified shell auth
- **UI_KIT_COMPONENTS.md** — Load for specific component recipes: forms, navigation, overlays, empty states, loading states

## Core Constraints

- **Adobe React Spectrum only** — no Material-UI, Bootstrap, Ant Design, or other UI libraries
- Always wrap in `<Provider theme={defaultTheme}>` from `@adobe/react-spectrum`
- Use Spectrum dimension tokens (e.g. `size-200`) — never hardcoded pixels
- No DOM APIs in actions; no Node-only modules in web-src (dual-runtime boundary)
- Frontend lives in `web-src/`; static assets in `public/`

## Extension Points

| Extension | Directory | Description |
|-----------|-----------|-------------|
| Unified Shell | `src/dx-excshell-1/web-src/` | experience.adobe.com app |
| Workfront UI | `src/workfront-ui-1/web-src/` | Workfront product extension |
| AEM CF Console | `src/aem-cf-console-admin-1/web-src/` | AEM Content Fragment extension |

## Quick Reference

| Task | Load |
|------|------|
| Build any component | REACT_SPECTRUM.md |
| Call backend action | ACTION_WIRING.md |
| Implement IMS auth | TOKEN_PATTERNS.md |
| Build forms/navigation/dialogs | UI_KIT_COMPONENTS.md |
