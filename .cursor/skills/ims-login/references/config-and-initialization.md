# IMS Config and Initialization

Reference: imslib2.js and project usage. Load this when configuring `window.adobeid`, env-driven config, or library initialization.

---

## Global config (imslib)

IMSLib reads config from `window.adobeid` (or constructor). Set **before** loading the script when using CDN.

**Required (full and thin):**
- `client_id`: IMS client ID (public).
- `scope`: Space-separated OAuth scopes (e.g. `AdobeID,openid`, plus `read_organizations` if using Organizations API).
- `onReady`: `(appState?) => void` — called when library is initialized.

**Common optional:**
- `redirect_uri`: string or `() => string`. Defaults to `window.location.href` at sign-in time if unset. Use a function to always use current origin.
- `locale`: e.g. `en_US`.
- `environment`: `'stg1'` | `'prod'`. Default prod. Use `stg1` for dev/stage.
- `useLocalStorage`: boolean. Default false (session storage).
- `logsEnabled`: boolean. Or call `adobeIMS.enableLogging()` / `disableLogging()` at runtime.

**Full library only (IAdobeIdData):**
- `onAccessToken`, `onReauthAccessToken`, `onAccessTokenHasExpired`, `onError`, `onProfile`.
- `autoValidateToken`: if true, cached token is validated via /validate_token on init.
- `ignoreUrlToken`: if true, library does not process tokens in URL fragment on init.
- `standalone`: `{ token, expirems }` for init with existing token (dev/test).
- `modalMode`, `modalSettings` for SUSI in popup.

**Thin:** Only needs `client_id`, `scope`, `onReady`, plus optional `redirect_uri`, `environment`, `locale`, `logsEnabled`. No token callbacks (app uses `fragmentValues()` after redirect).

**Note:** IMSLib copies the config at init; changes to `window.adobeid` after the script runs are ignored.

---

## CDN vs npm

**CDN (no build):**
- Full: `https://auth.services.adobe.com/imslib/imslib.min.js` (prod), `https://auth-stg1.services.adobe.com/imslib/imslib.min.js` (stg1).
- Thin: `.../imslib-thin.min.js`; polyfill variants: `imslib-polyfill.min.js`, `imslib-thin-polyfill.min.js`.
- When loaded from CDN, the library auto-calls `adobeIMS.initialize()` after load if `window.adobeid` is set.

**npm (build):**
```text
npm install @identity/imslib --save
```
Requires `@identity` registry in `~/.npmrc`. Then:
```javascript
import { AdobeIMS, AdobeIMSThin } from '@identity/imslib';
const adobeIms = new AdobeIMS(adobeIdData);  // or new AdobeIMSThin(adobeIdData)
adobeIms.initialize();
```

---

## Project env-driven config (no imslib)

When the app does **not** use imslib and builds the authorize URL itself (e.g. Pattern Atlas standalone):

- **Source:** `getImsConfig()` in `src/dx-excshell-1/web-src/src/ims-config.ts`.
- **Env vars:** `IMS_PATTERN_ATLAS_CLIENT_ID`, `IMS_PATTERN_ATLAS_ENVIRONMENT`, `IMS_PATTERN_ATLAS_SCOPES`, `IMS_PATTERN_ATLAS_ORG_ID`.
- **Defaults:** Never default to production; use `stg1` and a dev client ID when vars are unset.
- **Contract:** `ImsConfig`: `clientId`, `environment`, `libraryUrl`, `scopes`, `orgId`. Used by `standalone-ims.ts` for `getAuthorizeUrl` and by bootstrap to choose library URL when loading imslib.

---

## Window keys (imslib)

- `window.adobeid`: config object.
- `window.adobeIMS`: singleton instance after init (full or thin).
- `window.adobeImsFactory`: `{ createIMSLib }` for creating additional instances (e.g. multiple clients).

---

## 3rd party / multi-instance

Libraries that need the IMS instance can:
1. Subscribe to `onImsLibInstance` **before** any AdobeIMSLib instance is created.
2. Or later: dispatch `getImsLibInstance`; existing instances respond via `onImsLibInstance`. Filter by `imsInstance.adobeId.client_id` to avoid mixing clients.
