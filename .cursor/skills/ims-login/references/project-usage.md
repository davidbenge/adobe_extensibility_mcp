# IMS Login — This Project’s Usage

Reference: Pattern Atlas (dx-excshell-1) IMS config, standalone bootstrap, and developer setup. Load when changing standalone login, env, or bootstrap.

---

## Bootstrap: Shell vs standalone

- **Unified Shell:** `bootstrapInExcShell()` in `web-src/src/index.tsx`. No IMS library load; auth from `runtime.on('ready', { imsOrg, imsToken, imsProfile })`.
- **Standalone:** `bootstrapRaw()`. Uses IMS config and either loads imslib from URL or uses custom authorize URL + fragment parsing. Entry in `index.tsx` chooses based on presence of exc-runtime/shell.

---

## Config and env

- **Module:** `src/dx-excshell-1/web-src/src/ims-config.ts`
- **Function:** `getImsConfig(): ImsConfig` — reads `process.env.IMS_PATTERN_ATLAS_*` at build time.
- **Fields:** `clientId`, `environment` (`'stg1' | 'prod'`), `libraryUrl`, `scopes`, `orgId`.
- **Defaults:** Never production; `stg1` and dev client when vars unset. Production must set env in CI/build.

---

## Standalone helpers (no imslib for redirect)

- **Module:** `src/dx-excshell-1/web-src/src/standalone-ims.ts`
- **loadScript(url):** Loads IMS script by URL; returns Promise. Used when bootstrap loads imslib from `config.libraryUrl`.
- **getAuthorizeUrl(config, redirectUri):** Builds IMS authorize URL for implicit flow (response_type=token). Uses `config.clientId`, `config.scopes`, `redirectUri`; base from `config.environment` (stg1 vs prod).
- **parseHashForToken():** Reads `window.location.hash`, returns `{ access_token, token_type?, expires_in?, state? }` or null.
- **profileFromToken(accessToken):** Decodes JWT payload (no verify), returns `{ userId?, sub? }` for display.

Bootstrap (e.g. in `index.tsx`) uses these when running in standalone mode: build redirect URI (e.g. current origin), call `getAuthorizeUrl`, and either redirect to it or load imslib and let it handle redirect. After return, parse hash with `parseHashForToken()` if not using imslib for fragment handling.

---

## Developer setup and redirect URI

- **Doc:** `docs/developer-setup/ims-standalone-setup.md`
- **Env:** `.env` and `.env.example`; `IMS_PATTERN_ATLAS_CLIENT_ID`, `IMS_PATTERN_ATLAS_ENVIRONMENT`, `IMS_PATTERN_ATLAS_SCOPES`, `IMS_PATTERN_ATLAS_ORG_ID`.
- **Redirect URI:** Must be in IMS client’s allowed list (IMSS or Adobe Developer Console). App sends origin for root path **without trailing slash** (e.g. `https://localhost:9080`). Add that exact string to allow list for local dev.
- **Troubleshooting:** Wrong redirect (e.g. sent to stage instead of localhost) → check allow list and that app sends the same URI it uses for redirect (see impl-log and standalone-setup).

---

## Dev JWT (local / Cursor)

When `AIO_ENVIRONMENT=development` and `PATTERN_ATLAS_DEV_JWT_SECRET` is set, backend actions can accept a dev JWT (no IMS call). Use `npm run mint-dev-jwt` to mint; pass as `Authorization: Bearer <token>`. Not for production.

---

## Where to touch

| Change | Files / docs |
|--------|------------------|
| Env vars / defaults | `ims-config.ts`, `.env.example`, `ims-standalone-setup.md` |
| Authorize URL / fragment | `standalone-ims.ts` |
| Bootstrap choice (Shell vs raw) | `index.tsx` |
| Allowed redirect URIs | IMSS / Developer Console; document in `ims-standalone-setup.md` |
