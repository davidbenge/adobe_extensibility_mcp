# Workfront Extension — Host Communication

## Sending Messages to Host

```javascript
import { attach } from '@adobe/uix-guest'

const connection = await attach({ id: 'my-workfront-extension' })

// Request the host to open a Workfront object
await connection.host.modal.open({
    title: 'Project Details',
    content: { type: 'project', id: projectId }
})
```

## Receiving Events from Host

```javascript
// Listen for context changes (e.g. user navigates in Workfront)
connection.host.on('contextChange', (context) => {
    const { projectId, taskId } = context
    // Update extension state based on host context
    setCurrentContext({ projectId, taskId })
})
```

## Extension-to-Host Shared State

```javascript
// Extensions can read host context (current project, user, etc.)
const context = await connection.host.getContext()
const { currentUser, currentProject } = context
```

## Broadcast Events to Other Extensions

```javascript
// Send a message to other extensions on the same page
connection.broadcast('my-extension:itemSelected', { id: selectedId })

// Listen for broadcasts from other extensions
connection.on('other-extension:actionCompleted', (payload) => {
    refresh()
})
```

## Communication Checklist

- Use `attach()` before any host API calls
- Handle async gracefully — host API calls can fail
- Do not use `window.postMessage` directly — use the UIX SDK
- Test in both standalone mode (no host) and within Workfront shell
- Avoid polling the host; use event listeners instead
