# App Builder Application Points — Directory Signatures

> **Purpose**: Single source of truth for which directory paths belong to which App Builder extension type. Loaded by both App Builder Actions Developer and App Builder Frontend Developer skills. Paths are **universal** to all App Builder apps of that type.

---

## Overview

An App Builder app can extend **many application points**. Each application point has a **different directory signature** under `src/`. The directory name defines the project type (e.g. unified shell vs other extension points).

---

## Mapping: Application Point → Directory Signature

- **Actions extension pattern** live under `src/**/actions/`.
- **Frontend extension pattern** live under `src/**/web-src/`.
- **Standalone app action pattern** `src\actions`.
- **Standalone app web pattern** `src\web-src`.
- **app builder app manifests** `app.config.yaml`,
- **app builder app extension manifest** `src/**/ext.config.yaml`.


| Application point                                           | Directory signature           | Actions                               | Frontend (web-src, public)                                                  | Reference material                    |
| ----------------------------------------------------------- | ----------------------------- | ------------------------------------- | --------------------------------------------------------------------------- |---------------------------------------|
| **Unified shell / Experience shell** (experience.adobe.com) | `src/dx-excshell-1/`          | `src/dx-excshell-1/actions/`          | `src/dx-excshell-1/web-src/`, `src/dx-excshell-1/public/`                   | See `.cursor/skills/app-builder-frontend-developer/references/unified-shell.md` |
| **Workfront Product Extension**                             | `src/workfront-ui-1/`         | `src/workfront-ui-1/actions`          | `src/workfront-ui-1/web-src`, `src/workfront-ui-1/public/`                  | n/a |
| **Adobe AEM Content Fragment Extension**                    | `src/aem-cf-console-admin-1/` | `src/aem-cf-console-admin-1/actions/` | `src/aem-cf-console-admin-1/web-src/`, `src/aem-cf-console-admin-1/public/` | n/a |


---

When adding or documenting other extension points (e.g. other App Builder templates), add a row to the table above with that application point's directory signature.

## For This Repo (Pattern Atlas Publishing)

Pattern Atlas extends the **unified/experience shell**. Therefore:

- **Actions** live under `src/dx-excshell-1/actions/`.
- **Frontend** lives under `src/dx-excshell-1/web-src/` and `src/dx-excshell-1/public/`.

---

## Key Commands

- aio app dev = Local development
- aio app deploy = Deploy to production
- aio app logs = View runtime logs

when launching an application which has more than one extension point defined in the project you must issues the run and dev commands with the -e flag and specify the extension point. IG `aio app run -e dx-excshell-1`
`aio app deploy` remains the same when using multipule extension points

**Project Structure:**

```
my-ai-app/
├── src/
│   ├── dx-excshell-1/         # Unified Shell (if being extended)
│   │   ├── actions/           # Backend actions
│   │   └── web-src/           # Frontend UI
|   |   └── ext.config.yaml    # Extension configuration
│   ├── workfront-ui-1/        # Workfront (if being extended)
│   └── ...                    # Other extension points
├── app.config.yaml            # App configuration
├── package.json
└── .env                       # Local secrets
```

## References

- [Adobe App Builder Architecture](https://developer.adobe.com/app-builder/docs/guides/app_builder_guides/architecture_overview/architecture_overview/)
- docs/design-principles/architecture.md — module boundaries for this project
