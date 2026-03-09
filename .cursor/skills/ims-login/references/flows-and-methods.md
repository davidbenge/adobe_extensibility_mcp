# IMS Flows and Methods

Reference: imslib2.js initialization, sign-in, and API. Load when implementing or debugging init/sign-in/sign-out or token/profile handling.

---

## Initialization flow

1. App sets `window.adobeid` (or passes config into constructor if using npm).
2. Script loads (CDN) or app calls `new AdobeIMS(adobeIdData)` / `new AdobeIMSThin(adobeIdData)` then `initialize()`.
3. **No relevant fragment/query:** Library calls `/check/token` (session cookie). If response has token/profile, they are stored and auto-refresh is set; then `onReady(appState)`.
4. **Fragment or query has IMS data (e.g. token, code):** Library treats as redirect from IMS flow, processes it (e.g. exchange code for token, store token), then `onReady(appState)`.
5. Full library: `onAccessToken` / `onReauthAccessToken` and optionally `onProfile` fire as appropriate; then `onReady`. Thin: app uses `fragmentValues()` after redirect and implements storage/callbacks.

**Version:** `adobeIMS.version` (e.g. `v2-...`) to detect imslib v2.

---

## Sign-in flow (full library)

1. User triggers sign-in (e.g. button). App calls `adobeIMS.signIn(externalParameters?, contextToBePassedOnRedirect?, grantType?)`.
2. Library generates CSRF nonce, builds authorize URL (state includes nonce + context), redirects to IMS authorize.
3. User signs in at SUSI; IMS redirects back to `redirect_uri` with token (and state) in fragment (implicit) or code (auth code flow).
4. Page reloads; library runs `initialize()` again, reads fragment/query, exchanges code if needed, stores token, fires `onAccessToken` and `onReady`.
5. Token is in storage; `getAccessToken()` returns it. Auto-refresh runs before expiry.

**Modal mode:** Set `adobeid.modalMode` true (and optionally `modalSettings`). Sign-in opens in popup; token is sent to opener; popup closes.

---

## Sign-in flow (thin library)

1. App calls `adobeIMSThin.signIn(externalParameters?, nonce?, contextToBePassedOnRedirect?, grantType?)`. For CSRF, app should pass nonce (e.g. 16-char alphanumeric); use `getNonce()` after redirect to verify.
2. Library redirects to IMS; user signs in; IMS redirects back with fragment.
3. App calls `adobeIMSThin.fragmentValues()` to get fragment as object (e.g. `access_token`, `state`). App parses token, verifies nonce from `state`, stores token, updates UI.

---

## Main methods (full — IAdobeIMS)

| Method | Purpose |
|--------|--------|
| `initialize()` | Run init (fragment/check token, then onReady). |
| `signIn(ext?, context?, grantType?)` | Redirect to IMS sign-in. |
| `signOut(ext?)` | Clear storage and redirect to sign-out. |
| `getAccessToken()` | `ITokenInformation \| null` (token, expire, sid, token_type, etc.). |
| `getReauthAccessToken()` | Reauth token if used. |
| `getProfile()` | `Promise<profile>`. |
| `getOrganizations()` | `Promise<INormalizedOrganizations>`; requires `read_organizations` scope. |
| `refreshToken(ext?)` | Refresh access token. |
| `reAuthenticate(params?, reauth?, context?, grantType?)` | Reauth flow (check/force). |
| `signUp(params?, context?)` | Redirect to sign-up. |
| `signInWithSocialProvider(providerName, ext?, context?, grantType?)` | Social sign-in. |
| `validateToken()` | `Promise<boolean>`. |
| `isSignedInUser()` | boolean. |
| `setStandAloneToken(standaloneToken)` | Set token for standalone init. |
| `avatarUrl(userId)` | User avatar URL. |
| `enableLogging()` / `disableLogging()` | Toggle console logs. |

---

## Thin (IAdobeIMSThin)

| Method | Purpose |
|--------|--------|
| `initialize()` | Triggers `onReady` only (no token handling). |
| `signIn(ext?, nonce?, context?, grantType?)` | Redirect to IMS sign-in. |
| `signOut(ext?)` | Clear and redirect to sign-out. |
| `fragmentValues()` | Parse current URL fragment to object (e.g. access_token, state). |
| `getNonce()` | Read nonce from fragment state. |

Thin also has `getAuthorizationUrl`, `getSocialProviderAuthorizationUrl`, `getReauthenticateAuthorizationUrl`, `getSignUpAuthorizationUrl` for building URLs without redirecting.

---

## Token and callbacks (full)

- **ITokenInformation:** `token`, `expire` (Date), `sid`, `token_type?`, plus optional reauth/impersonation/guest fields.
- **onAccessToken(tokenInfo):** Fired when token is available (init or after redirect).
- **onReauthAccessToken(tokenInfo):** Fired for reauth token.
- **onAccessTokenHasExpired():** Fired when token is expired (library may auto-refresh).
- **onError(type, message, exception?):** Types include Http, CSRF, etc. Rate limit message may include `retryAfter`.
- **onReady(appState):** Always last in init; safe to call `getAccessToken()`, `getProfile()` here.

---

## Storage and behavior

- Default storage: **session storage**. Use `useLocalStorage: true` for local (may require ASSET approval).
- Debouncing: API responses cached ~1s.
- Organizations: Cached in session storage, ~15 min TTL; cleared on sign-out.
- Custom HTTP errors: network (0), 429, 5xx leave session/storage unchanged; `onError` is called.
