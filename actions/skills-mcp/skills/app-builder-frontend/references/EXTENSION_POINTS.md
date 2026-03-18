# Adobe App Builder — Extension Points

All Adobe extensibility extension points, their App Builder mount paths (`xp`), the resulting `src/` directory, and the skills to load when working in each.

## Directory Rule

`xp` value → replace `/` with `-` → prepend `src/` → e.g. `workfront/ui/1` → `src/workfront-ui-1/`

## Extension Point Catalog

| xp | Title | src/ Directory | Skills to Load |
|----|-------|----------------|----------------|
| `dx/excshell/1` | Firefly Experience Cloud Shell Extension | `src/dx-excshell-1/` | `app-builder-frontend`, `app-builder-actions` |
| `dx/asset-compute/worker/1` | Asset Compute Worker | `src/dx-asset-compute-worker-1/` | `app-builder-actions` (no frontend) |
| `aem/cf-console-admin/1` | AEM Content Fragment Console Extension | `src/aem-cf-console-admin-1/` | `app-builder-frontend`, `app-builder-actions` |
| `commerce/backend-ui/1` | Adobe Commerce UI extensions for admin panel | `src/commerce-backend-ui-1/` | `app-builder-frontend`, `app-builder-actions` |
| `aem/cf-editor/1` | AEM Content Editor Extension | `src/aem-cf-editor-1/` | `app-builder-frontend`, `app-builder-actions` |
| `universal-editor/ui/1` | Universal Editor Extension | `src/universal-editor-ui-1/` | `app-builder-frontend`, `app-builder-actions` |
| `workfront/doc-details/1` | Workfront Document Details | `src/workfront-doc-details-1/` | `workfront-extension`, `app-builder-frontend`, `app-builder-actions` |
| `workfront/ui/1` | Workfront UI | `src/workfront-ui-1/` | `workfront-extension`, `app-builder-frontend`, `app-builder-actions` |
| `aem/experience-success-studio/1` | AEM Experience Success Studio | `src/aem-experience-success-studio-1/` | `app-builder-frontend`, `app-builder-actions` |
| `aem/assets/details/1` | Experience Manager Assets Details View Extension | `src/aem-assets-details-1/` | `app-builder-frontend`, `app-builder-actions` |
| `aem/assets/browse/1` | Experience Manager Assets View Browse Extension | `src/aem-assets-browse-1/` | `app-builder-frontend`, `app-builder-actions` |
| `aem/assets/collections/1` | Experience Manager Assets View Collections Extension | `src/aem-assets-collections-1/` | `app-builder-frontend`, `app-builder-actions` |
| `dx_genstudio/genstudiopem/1` | GenStudio for Performance Marketing Extensions | `src/dx_genstudio-genstudiopem-1/` | `app-builder-frontend`, `app-builder-actions` |
| `dx_genstudio/translation/1` | GenStudio Translation Extensions | `src/dx_genstudio-translation-1/` | `app-builder-frontend`, `app-builder-actions` |
| `aem/contenthub/assets/details/1` | Content Hub Asset Details Extension | `src/aem-contenthub-assets-details-1/` | `app-builder-frontend`, `app-builder-actions` |
| `aem/launchpad/1` | AEM Launchpad Extension | `src/aem-launchpad-1/` | `app-builder-frontend`, `app-builder-actions` |
| `aem/cf-model-editor/1` | AEM Content Fragment Model Editor Extension | `src/aem-cf-model-editor-1/` | `app-builder-frontend`, `app-builder-actions` |
| `commerce/configuration/1` | Adobe Commerce configuration for admin panel | `src/commerce-configuration-1/` | `app-builder-frontend`, `app-builder-actions` |
| `commerce/extensibility/1` | Adobe Commerce extensibility for app management | `src/commerce-extensibility-1/` | `app-builder-frontend`, `app-builder-actions` |

## Dedicated Skills by Product

Skills that go beyond the generic frontend/actions pair and carry product-specific knowledge:

| Product | xp values covered | Skill |
|---------|-------------------|-------|
| Workfront | `workfront/ui/1`, `workfront/doc-details/1` | `workfront-extension` |

All other extension points have no dedicated product skill yet — `app-builder-frontend` + `app-builder-actions` cover their full implementation surface.

## How to Use This Table

1. Identify the `src/` subdirectory in the project (e.g. `src/aem-cf-console-admin-1/`).
2. Find the matching row to confirm the `xp` and title.
3. Load the skills listed in "Skills to Load" for that row.
4. If the "Dedicated Skills" table lists a product skill for this xp, load it alongside the base skills.

## When a New Dedicated Skill Is Added

Update the Dedicated Skills table above and add the `extensionPoints` field to the new skill's `SKILL.md` frontmatter:

```yaml
metadata:
  author: adobe-enterprise-architecture
  version: "1.0"
  extensionPoints:
    - aem/cf-console-admin/1
```
