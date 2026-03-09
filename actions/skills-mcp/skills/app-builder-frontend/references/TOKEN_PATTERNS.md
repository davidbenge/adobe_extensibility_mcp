# App Builder Frontend — IMS Token Patterns

## Overview

Two bootstrap paths:
1. **Unified Shell** — token provided by shell at runtime (no IMS library load)
2. **Standalone** — app loads imslib or builds authorize URL itself

## Unified Shell Bootstrap

```javascript
// index.jsx — shell context detection
import { attach } from '@adobe/uix-guest'

async function bootstrapInExcShell() {
    const connection = await attach({ id: 'my-app' })
    // Token is provided by the shell
    const imsToken = await connection.host.auth.getAccessToken()
    const imsOrg = await connection.host.auth.getImsOrg()
    const profile = await connection.host.auth.getProfile()

    renderApp({ imsToken, imsOrg, profile })
}
```

## Standalone Bootstrap (imslib CDN)

```javascript
// Set before loading script
window.adobeid = {
    client_id: process.env.IMS_CLIENT_ID,
    scope: 'AdobeID,openid',
    environment: process.env.IMS_ENVIRONMENT || 'stg1',  // never default to prod
    onAccessToken: (tokenInfo) => {
        // tokenInfo.token is the access token
        renderApp({ imsToken: tokenInfo.token })
    },
    onReady: (appState) => {
        // Called after init; safe to call getAccessToken() here
    },
    onError: (type, msg) => {
        console.error('IMS error:', type, msg)
    }
}

// Load imslib script dynamically
function loadImsScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = url
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
    })
}
```

## Custom Authorize URL (no imslib for redirect)

```javascript
// Build authorize URL and redirect
function getAuthorizeUrl(config, redirectUri) {
    const base = config.environment === 'prod'
        ? 'https://ims-na1.adobelogin.com'
        : 'https://ims-na1-stg1.adobelogin.com'

    const params = new URLSearchParams({
        client_id: config.clientId,
        scope: config.scopes,
        redirect_uri: redirectUri,
        response_type: 'token'
    })
    return `${base}/ims/authorize?${params}`
}

// Parse hash fragment after redirect
function parseHashForToken() {
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const token = params.get('access_token')
    const expiresIn = params.get('expires_in')
    return token ? { token, expiresIn: parseInt(expiresIn, 10) } : null
}
```

## IMS Config (env-driven)

```javascript
// ims-config.js — always env-driven, never hardcoded
function getImsConfig() {
    return {
        clientId: process.env.IMS_CLIENT_ID || 'dev-client-id',
        environment: process.env.IMS_ENVIRONMENT || 'stg1',  // never default prod
        scopes: process.env.IMS_SCOPES || 'AdobeID,openid',
        orgId: process.env.IMS_ORG_ID
    }
}
```

## Key Rules

- Never default to production IMS environment; always default `stg1` for dev
- `useLocalStorage: true` requires ASSET approval (default is session storage)
- Redirect URI must exactly match the IMS client's allowed list (no trailing slash)
- For thin library: app must manage CSRF nonce (generate + verify on return)
- Token auto-refresh is only in full imslib; thin library app must handle expiry

## imslib Methods (full library)

| Method | Use |
|--------|-----|
| `adobeIMS.signIn()` | Redirect to SUSI sign-in |
| `adobeIMS.signOut()` | Clear token, redirect to sign-out |
| `adobeIMS.getAccessToken()` | Returns `{ token, expire, sid }` or null |
| `adobeIMS.getProfile()` | Returns Promise\<profile\> |
| `adobeIMS.isSignedInUser()` | boolean |
| `adobeIMS.validateToken()` | Promise\<boolean\> |
