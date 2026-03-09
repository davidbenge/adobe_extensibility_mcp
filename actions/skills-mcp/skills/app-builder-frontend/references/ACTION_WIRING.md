# App Builder Frontend — Calling Backend Actions

## Pattern: HTTP Action Call

Frontend calls backend actions via their I/O Runtime URL:

```javascript
// utils/actions.js
export async function callAction(actionName, method = 'POST', body = null, token = null) {
    const actionUrl = `${process.env.REACT_APP_ACTIONS_BASE_URL}/${actionName}`

    const headers = {
        'Content-Type': 'application/json',
        'x-gw-ims-org-id': process.env.REACT_APP_IMS_ORG_ID
    }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const options = {
        method,
        headers
    }
    if (body) {
        options.body = JSON.stringify(body)
    }

    const response = await fetch(actionUrl, options)

    if (!response.ok) {
        const err = await response.json().catch(() => ({ error: response.statusText }))
        throw new Error(err.error || `HTTP ${response.status}`)
    }

    return response.json()
}
```

## In a React Component

```jsx
import { useEffect, useState } from 'react'
import { ProgressCircle } from '@adobe/react-spectrum'

function MyComponent({ token }) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        callAction('my-action', 'GET', null, token)
            .then(setData)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [token])

    if (loading) return <ProgressCircle aria-label="Loading" isIndeterminate />
    if (error) return <p>Error: {error}</p>
    return <div>{JSON.stringify(data)}</div>
}
```

## Environment Config

In `.env` (local) and via App Builder deployment config:
```
REACT_APP_ACTIONS_BASE_URL=https://<namespace>.adobeioruntime.net/api/v1/web/<package>
REACT_APP_IMS_ORG_ID=<org-id>
```

## Unified Shell: Getting Token

When running inside unified shell (experience.adobe.com), get token from shell runtime:

```javascript
import { attach } from '@adobe/uix-guest'

const guestConnection = await attach({ id: 'my-app-id' })
const token = await guestConnection.host.auth.getAccessToken()
const orgId = await guestConnection.host.auth.getImsOrg()
```

## Error Handling in UI

Always handle fetch errors gracefully:

```jsx
try {
    const result = await callAction('my-action', 'POST', payload, token)
    // success
} catch (error) {
    // Display error to user with IllustratedMessage or toast
    toast.negative(error.message, { timeout: 5000 })
}
```
