# App Builder Frontend — Adobe React Spectrum

Adobe React Spectrum is the **only** allowed UI library. Never use Material-UI, Bootstrap, Ant Design, etc.

## Required: Provider Wrapper

All Spectrum components must be wrapped in a `<Provider>`:

```jsx
import { Provider, defaultTheme } from '@adobe/react-spectrum'

function App() {
    return (
        <Provider theme={defaultTheme}>
            {/* All your components */}
        </Provider>
    )
}
```

## Sizing System

Use Spectrum dimension tokens — NEVER hardcoded pixels:

```jsx
// Correct
<View padding="size-200">
<Flex gap="size-150">

// Wrong — never do this
<div style={{ padding: '16px' }}>
```

Common tokens: `size-50`=4px, `size-100`=8px, `size-150`=12px, `size-200`=16px, `size-300`=24px, `size-400`=32px

## Core Layout

```jsx
import { Flex, Grid, View, Divider } from '@adobe/react-spectrum'

// Flexbox
<Flex direction="column" gap="size-200" alignItems="center">
    <View padding="size-200" backgroundColor="gray-100" borderRadius="medium">
        {/* content */}
    </View>
</Flex>

// Grid
<Grid columns={['1fr', '2fr']} gap="size-200">
    {/* grid items */}
</Grid>
```

## Common Components

```jsx
import { Button, TextField, Picker, Item, Checkbox, ActionButton } from '@adobe/react-spectrum'

// Buttons
<Button variant="cta">Primary</Button>
<Button variant="primary">Secondary</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="negative">Delete</Button>

// Text input (always label; use controlled)
const [val, setVal] = useState('')
<TextField label="Name" value={val} onChange={setVal} isRequired />

// Select
<Picker label="Status" onSelectionChange={setStatus}>
    <Item key="active">Active</Item>
    <Item key="inactive">Inactive</Item>
</Picker>
```

## Icons

```jsx
import Add from '@spectrum-icons/workflow/Add'
import Delete from '@spectrum-icons/workflow/Delete'

<Button variant="cta">
    <Add />
    <Text>Add Item</Text>
</Button>
```

## State Management

Use controlled components:

```jsx
const [value, setValue] = useState('')
<TextField label="Name" value={value} onChange={setValue} />
```

## Performance

- Use `memo()` for expensive renders
- Use `useCallback()` for handlers in lists
- `<ListView>` or `<TableView>` for large data sets (virtualized)

## Resources

- Docs: https://react-spectrum.adobe.com/react-spectrum/
- Icons: https://react-spectrum.adobe.com/react-spectrum/workflow-icons.html
