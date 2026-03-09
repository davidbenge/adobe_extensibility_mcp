# App Builder Frontend — Unified Shell (Experience Shell)

> **Purpose**: Reference for frontends that extend the unified shell (experience.adobe.com). For directory signatures (e.g. `dx-excshell-1`), see [application-points.md](application-points.md).

---

## Stack

- **React** with **Adobe React Spectrum** only — no other UI libraries.
- **Jamstack** frontend served via App Builder (static assets on CDN).
- **Dual TypeScript**: Frontend uses `tsconfig.web.json` (Browser, ESM, JSX); actions use `tsconfig.actions.json`. No DOM/Node crossover — see design-principles or archive `typescript-dual-runtime-patterns.md`.

---

## Structure (Unified/Experience Shell)

- **Source**: `src/dx-excshell-1/web-src/` (React app).
- **Static assets**: `src/dx-excshell-1/public/`.
- **Generator**: `@adobe/generator-app-excshell` scaffolds experience-shell SPAs.

---

## Preview & Deployment

- **Local**: `aio app run` — preview at `http://localhost:9080/`.
- **Experience Cloud**: `https://experience.adobe.com/?devMode=true#/apps/?localDevUrl=https://localhost:9080` (with local server running).
- **Deployed**: `https://<namespace>.adobeio-static.net/<appname>-<appversion>/index.html`.

---

## Rules

- Wrap app in `<Provider>` with theme; use Spectrum components only.
- Consume backend via HTTP (actions); no Node/`process` in web-src.
- No DOM APIs in actions; no Node-only modules in web-src (dual-runtime boundary).

---

## References

- [Front-end applications for App Builder](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/configuring-and-extending/app-builder/front-end-applications)
- [App Builder Architecture Overview](https://developer.adobe.com/app-builder/docs/guides/app_builder_guides/architecture_overview/architecture_overview/)
- docs/design-principles/frontend.md
