# Workfront Extension — Navigation

## Left Panel Registration

Register a left panel item in the Workfront nav:

```javascript
import { attach } from '@adobe/uix-guest'

const connection = await attach({ id: 'my-workfront-extension' })

// Register a left panel navigation item
await connection.host.leftNav.register({
    id: 'my-panel',
    label: 'My Panel',
    icon: 'icon-name',  // Spectrum workflow icon name
    onClick: () => {
        // Navigate to a route in your extension
        connection.host.leftNav.navigate({ panelId: 'my-panel' })
    }
})
```

## Route-Based Navigation (Within Extension)

Use React Router (or simple state) for internal routing:

```jsx
import { useState } from 'react'

function App({ connection }) {
    const [view, setView] = useState('home')

    return view === 'home'
        ? <HomeView onNavigate={setView} />
        : <DetailView id={view} onBack={() => setView('home')} />
}
```

## Syncing URL with Host

When the host navigates (e.g. user clicks back), listen for navigation events:

```javascript
connection.host.router.listen(({ route }) => {
    // Handle route change from host
    setCurrentRoute(route)
})
```

## Panel Rendering

Extensions render in an iframe. Keep navigation shallow (2-3 levels max) and use breadcrumbs for deep navigation:

```jsx
import { Breadcrumbs, Item } from '@adobe/react-spectrum'

<Breadcrumbs onAction={setView}>
    <Item key="home">Home</Item>
    <Item key="projects">Projects</Item>
    <Item key={currentProject.id}>{currentProject.name}</Item>
</Breadcrumbs>
```
