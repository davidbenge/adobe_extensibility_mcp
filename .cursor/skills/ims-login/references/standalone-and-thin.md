# Standalone and Thin IMS

Reference: standalone token, thin library, CSRF/nonce, and custom authorize URL. Load when implementing thin-only flows, standalone dev token, or app-built authorize URL.

---

## Standalone token (full library)

For dev/test without going through SUSI:

```javascript
window.adobeid = {
  client_id: '...',
  scope: 'AdobeID,openid',
  standalone: {
    token: 'your_access_token',
    expirems: 1234567890  // expiration in ms
  },
  onReady: (appState) => { /* ... */ }
};
```

Library uses this token at init and does not call /check/token for token acquisition. Still need valid client_id/scope.

---

## IJT (Implicit Jump Token)

Flow: app has an IJT; use it to get a new access token via REST (no redirect).

1. Read ijt from URL or other source.
2. Set `adobeid.ijt = 'ijtValue'` (or equivalent on config passed to constructor).
3. Call `adobeIMS.initialize()`. Library will exchange IJT for token; if profile is needed, it fetches it. No redirect.

---

## Thin library: CSRF

- Thin does **not** manage nonce internally for redirect. App must:
  1. Generate nonce (recommended 16 alphanumeric chars).
  2. Pass as second argument: `signIn(ext, nonce, context, grantType)`.
  3. On return redirect, call `fragmentValues()` then `getNonce()` and verify nonce matches before trusting token.

---

## Thin: fragmentValues and getNonce

- `fragmentValues()`: Parses `window.location.hash` into an object (e.g. `access_token`, `expires_in`, `state`, ...). Returns `IDictionary | null`.
- `getNonce()`: Reads `state` from fragment (often JSON), returns `state.nonce` or null. Use to verify CSRF after redirect.

---

## Custom authorize URL (no imslib for redirect)

When the app does **not** use imslib for redirect (e.g. Pattern Atlas):

1. **Config:** Use env-driven config (e.g. `getImsConfig()`): `clientId`, `environment`, `scopes`. Resolve authorize base URL from environment (e.g. stg1 vs prod).
2. **Build URL:** e.g. `getAuthorizeUrl(config, redirectUri)` with `client_id`, `scope`, `redirect_uri`, `response_type: 'token'` (implicit). Optional: state (e.g. nonce + app context).
3. **Redirect:** Set `window.location.href = authorizeUrl`. User signs in; IMS redirects back to `redirect_uri` with token in **hash**.
4. **Parse:** On load, read hash (e.g. `parseHashForToken()` or `fragmentValues()` if thin is used only for parsing). Extract `access_token`, `expires_in`, `state`. Verify nonce if using state.
5. **Store / callback:** Store token (and optional profile from token or separate call); call app’s onReady/token callback.

**Redirect URI:** Must match IMS client’s allowed list exactly (e.g. `https://localhost:9080` with no trailing slash if that’s what the app sends). Wrong URI causes IMS to redirect elsewhere (e.g. stage URL).

---

## When to use which

- **Full imslib:** Need token refresh, profile, organizations, reauth, modal, or minimal custom code. Use CDN or npm; set `window.adobeid`; call `initialize()` and `signIn()`.
- **Thin imslib:** Only need redirect to sign-in and sign-out plus fragment parsing. App handles storage and callbacks; pass nonce for CSRF.
- **Custom URL + fragment parse:** No imslib; app builds authorize URL from config, redirects, parses hash. Fits when imslib is heavy or redirect_uri behavior must be fully controlled (e.g. always current origin).
