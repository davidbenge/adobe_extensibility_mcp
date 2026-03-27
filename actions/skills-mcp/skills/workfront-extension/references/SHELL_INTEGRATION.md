# Workfront Extension — Shell Integration

## UIX Guest SDK

Extensions communicate with the Workfront host via the `@adobe/uix-guest` SDK:

```javascript
import { attach } from '@adobe/uix-guest'

// Attach to the host shell
const guestConnection = await attach({ id: 'my-workfront-extension' })
```

## Getting Auth Token

The host provides the IMS token — no standalone IMS flow needed:

```javascript
import { attach } from '@adobe/uix-guest'

async function bootstrap() {
    const connection = await attach({ id: 'my-workfront-extension' })

    // Get auth from host
    const imsToken = await connection.host.auth.getAccessToken()
    const imsOrg = await connection.host.auth.getImsOrg()

    return { imsToken, imsOrg }
}
```

## Using Token for API Calls

```javascript
async function callWorkfrontAPI(endpoint, token, orgId) {
    const response = await fetch(`https://your-domain.my.workfront.com/attask/api/v18.0/${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-Gw-Ims-Org-Id': orgId,
            'Content-Type': 'application/json'
        }
    })
    return response.json()
}
```

## Connection Lifecycle

```jsx
import { attach } from '@adobe/uix-guest'
import { useState, useEffect } from 'react'

function App() {
    const [connection, setConnection] = useState(null)
    const [token, setToken] = useState(null)

    useEffect(() => {
        attach({ id: 'my-workfront-extension' }).then(async conn => {
            setConnection(conn)
            const t = await conn.host.auth.getAccessToken()
            setToken(t)
        })
    }, [])

    if (!token) return <ProgressCircle aria-label="Connecting" isIndeterminate />
    return <MainView token={token} />
}
```

## Host Environment Detection

```javascript
// Check if running inside the shell vs standalone
const isInShell = window !== window.parent
```

## Local Dev Testing (extensionOverride)

To test a locally running extension in Workfront without deploying:

1. Run `aio app run` — note the local URL (e.g. `https://localhost:9080`)
2. Open Workfront in your browser and go to the page you want to test
3. Open **DevTools → Application → Local Storage** (for `workfront.com` or `workfront.adobe.com`)
4. Add a new entry:
   - **Key**: `extensionOverride`
   - **Value**: `https://localhost:9080` (your local dev server URL)
5. Reload the page — Workfront will load your local extension instead of the published one

> The forms widget local testing flag is slightly different: set `extensionoverride=TRUE` in localStorage to make the widget picker show locally active apps.

## Chrome 142+ Local Network Access Fix

Chrome 142 introduced Local Network Access Restrictions that block localhost connections from extension iframes. If your local extension fails to load:

1. Open Chrome and navigate to `chrome://flags`
2. Search for **Local Network Access Checks**
3. Set the flag to **Disabled**
4. Click **Relaunch**

This is required for local dev (`aio app run`) on Chrome 142 and later.
