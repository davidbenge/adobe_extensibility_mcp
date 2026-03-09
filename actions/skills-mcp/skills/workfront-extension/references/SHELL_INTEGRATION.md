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
