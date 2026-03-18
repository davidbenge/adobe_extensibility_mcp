---
name: app-builder-frontend
description: >
  Adobe App Builder frontend (Jamstack, React, Adobe React Spectrum) for all Adobe extension points:
  Unified Shell (dx/excshell/1), Workfront (workfront/ui/1, workfront/doc-details/1),
  AEM (cf-console-admin, cf-editor, assets/details, assets/browse, assets/collections, cf-model-editor,
  experience-success-studio, contenthub, launchpad), Commerce (backend-ui, configuration, extensibility),
  Universal Editor (universal-editor/ui/1), and GenStudio (genstudiopem, translation).
  Use when implementing React components, calling backend actions from the browser, handling IMS tokens
  in standalone or unified shell mode, or building any extension-point UI.
  Load EXTENSION_POINTS.md when starting a new extension or identifying the extension type in an existing project.
  Do not use for backend-only action work or MCP server implementation.
metadata:
  author: adobe-enterprise-architecture
  version: "1.0"
---

# App Builder Frontend Developer

## Role
Frontend specialist for App Builder extension-point apps. Uses Adobe React Spectrum only. Knows how to call backend actions, handle IMS auth, and work within unified shell vs standalone contexts.

## When to Load References

- **EXTENSION_POINTS.md** — Load when starting a new extension or identifying the extension type in an existing project; maps every Adobe xp to its src/ directory and the skills to load
- **REACT_SPECTRUM.md** — Load when building any UI component; covers Provider requirement, sizing tokens, common components, patterns
- **REACT_SPECTRUM_UI_PATTERNS.md** — Load when building or reviewing screens and components; comprehensive pattern library with layout, form, list, navigation, overlay, and empty-state recipes
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

| xp | Title | Directory |
|----|-------|-----------|
| `dx/excshell/1` | Firefly Experience Cloud Shell Extension | `src/dx-excshell-1/web-src/` |
| `dx/asset-compute/worker/1` | Asset Compute Worker | `src/dx-asset-compute-worker-1/` (actions only) |
| `aem/cf-console-admin/1` | AEM Content Fragment Console Extension | `src/aem-cf-console-admin-1/web-src/` |
| `commerce/backend-ui/1` | Adobe Commerce UI extensions for admin panel | `src/commerce-backend-ui-1/web-src/` |
| `aem/cf-editor/1` | AEM Content Editor Extension | `src/aem-cf-editor-1/web-src/` |
| `universal-editor/ui/1` | Universal Editor Extension | `src/universal-editor-ui-1/web-src/` |
| `workfront/doc-details/1` | Workfront Document Details | `src/workfront-doc-details-1/web-src/` |
| `workfront/ui/1` | Workfront UI | `src/workfront-ui-1/web-src/` |
| `aem/experience-success-studio/1` | AEM Experience Success Studio | `src/aem-experience-success-studio-1/web-src/` |
| `aem/assets/details/1` | Experience Manager Assets Details View Extension | `src/aem-assets-details-1/web-src/` |
| `aem/assets/browse/1` | Experience Manager Assets View Browse Extension | `src/aem-assets-browse-1/web-src/` |
| `aem/assets/collections/1` | Experience Manager Assets View Collections Extension | `src/aem-assets-collections-1/web-src/` |
| `dx_genstudio/genstudiopem/1` | GenStudio for Performance Marketing Extensions | `src/dx_genstudio-genstudiopem-1/web-src/` |
| `dx_genstudio/translation/1` | GenStudio Translation Extensions | `src/dx_genstudio-translation-1/web-src/` |
| `aem/contenthub/assets/details/1` | Content Hub Asset Details Extension | `src/aem-contenthub-assets-details-1/web-src/` |
| `aem/launchpad/1` | AEM Launchpad Extension | `src/aem-launchpad-1/web-src/` |
| `aem/cf-model-editor/1` | AEM Content Fragment Model Editor Extension | `src/aem-cf-model-editor-1/web-src/` |
| `commerce/configuration/1` | Adobe Commerce configuration for admin panel | `src/commerce-configuration-1/web-src/` |
| `commerce/extensibility/1` | Adobe Commerce extensibility for app management | `src/commerce-extensibility-1/web-src/` |

See `EXTENSION_POINTS.md` for the full routing table including which skills to load per extension point.

## Quick Reference

| Task | Load |
|------|------|
| Identify extension type / start new extension | EXTENSION_POINTS.md |
| Build any component | REACT_SPECTRUM.md |
| Build screens or complex components | REACT_SPECTRUM_UI_PATTERNS.md |
| Call backend action | ACTION_WIRING.md |
| Implement IMS auth | TOKEN_PATTERNS.md |
| Build forms/navigation/dialogs | UI_KIT_COMPONENTS.md |
