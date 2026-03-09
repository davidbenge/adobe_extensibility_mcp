# App Builder Frontend — UI Kit Component Recipes

## Forms

```jsx
import { Form, TextField, Picker, Item, Checkbox, Button } from '@adobe/react-spectrum'

function MyForm({ onSubmit }) {
    const [name, setName] = useState('')
    const [status, setStatus] = useState('active')

    return (
        <Form onSubmit={onSubmit}>
            <TextField
                label="Name"
                value={name}
                onChange={setName}
                isRequired
                description="Enter a descriptive name"
            />
            <Picker
                label="Status"
                selectedKey={status}
                onSelectionChange={setStatus}
            >
                <Item key="active">Active</Item>
                <Item key="inactive">Inactive</Item>
            </Picker>
            <Button type="submit" variant="cta">Save</Button>
        </Form>
    )
}
```

## Navigation: Tabs

```jsx
import { Tabs, TabList, TabPanels, Item } from '@adobe/react-spectrum'

<Tabs>
    <TabList>
        <Item key="details">Details</Item>
        <Item key="settings">Settings</Item>
    </TabList>
    <TabPanels>
        <Item key="details"><DetailsPanel /></Item>
        <Item key="settings"><SettingsPanel /></Item>
    </TabPanels>
</Tabs>
```

## Dialogs (Overlays)

```jsx
import { DialogTrigger, Dialog, Heading, Content, ButtonGroup, Button } from '@adobe/react-spectrum'

<DialogTrigger>
    <Button variant="primary">Confirm Action</Button>
    {(close) => (
        <Dialog>
            <Heading>Delete Item</Heading>
            <Content>This action cannot be undone. Are you sure?</Content>
            <ButtonGroup>
                <Button variant="secondary" onPress={close}>Cancel</Button>
                <Button variant="negative" onPress={() => { doDelete(); close() }}>Delete</Button>
            </ButtonGroup>
        </Dialog>
    )}
</DialogTrigger>
```

## Loading States

```jsx
import { ProgressCircle } from '@adobe/react-spectrum'

{loading && <ProgressCircle aria-label="Loading data" isIndeterminate />}
```

## Empty States

```jsx
import { IllustratedMessage, Heading, Content } from '@adobe/react-spectrum'
import NotFound from '@spectrum-icons/illustrations/NotFound'

<IllustratedMessage>
    <NotFound />
    <Heading>No results found</Heading>
    <Content>Try adjusting your search or add new items.</Content>
</IllustratedMessage>
```

## Toast Notifications

```jsx
import { ToastContainer, useToast } from '@adobe/react-spectrum'

function MyComponent() {
    const toast = useToast()

    return (
        <>
            <Button onPress={() => toast.positive('Saved!', { timeout: 3000 })}>Save</Button>
            <Button onPress={() => toast.negative('Error occurred', { timeout: 5000 })}>Error</Button>
            <ToastContainer />
        </>
    )
}
```

## Data Lists

```jsx
import { ListView, Item, ActionButton, Text } from '@adobe/react-spectrum'
import Edit from '@spectrum-icons/workflow/Edit'

<ListView
    items={items}
    selectionMode="multiple"
    onSelectionChange={setSelection}
>
    {(item) => (
        <Item key={item.id} textValue={item.name}>
            <Text>{item.name}</Text>
            <ActionButton aria-label="Edit">
                <Edit />
            </ActionButton>
        </Item>
    )}
</ListView>
```

## Responsive Layout

```jsx
import { Flex } from '@adobe/react-spectrum'
import { useBreakpoint } from '@adobe/react-spectrum'

function ResponsiveLayout({ children }) {
    const breakpoint = useBreakpoint()
    return (
        <Flex
            direction={breakpoint === 'S' ? 'column' : 'row'}
            gap="size-200"
            wrap
        >
            {children}
        </Flex>
    )
}
```
