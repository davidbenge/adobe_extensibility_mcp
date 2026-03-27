# Workfront Extension — Forms Widget

## Overview

The `widgets` extension point lets you embed custom components directly inside Workfront custom forms as form fields. Unlike mainMenu or secondaryNav, widgets appear inline within a form — not as navigation items.

Use case example: a time-tracking widget, metadata tagger, or content preview panel embedded in a project/task form.

## Registration in ExtensionRegistration.js

Add a `widgets` block inside the `methods` object alongside any `mainMenu` or `secondaryNav` blocks:

```javascript
// src/workfront-ui-1/web-src/src/components/ExtensionRegistration.js
import { register } from '@adobe/uix-guest'

function ExtensionRegistration() {
  useEffect(() => {
    const init = async () => {
      const guestConnection = await register({
        id: extensionId,
        methods: {
          widgets: {
            getItems() {
              return [
                {
                  id: 'my-widget',
                  url: '/index.html#/my-widget',
                  label: 'My Custom Widget',
                  dimensions: {
                    height: 450,
                    width: 300,
                    maxHeight: 600,
                    maxWidth: 400,
                  },
                },
                {
                  id: 'simple-widget',
                  url: '/index.html#/simple-widget',
                  label: 'Simple Widget',
                  // dimensions omitted — uses default sizing
                },
              ]
            },
          },
        },
      })
    }
    init()
  }, [])
  return <></>
}
```

## Widget Configuration Properties

### Required

| Property | Type   | Description |
|----------|--------|-------------|
| `id`     | string | Unique identifier. Must be unique across all widgets in the extension. |
| `url`    | string | Route path to the widget component (e.g. `/index.html#/my-widget`). |
| `label`  | string | Display name shown in the custom form field selection UI. |

### Optional

| Property     | Type   | Description |
|--------------|--------|-------------|
| `dimensions` | object | Controls widget size. All sub-properties are optional. |
| `dimensions.height`    | number | Initial height in pixels |
| `dimensions.width`     | number | Initial width in pixels |
| `dimensions.maxHeight` | number | Maximum height in pixels |
| `dimensions.maxWidth`  | number | Maximum width in pixels |

### Dimension patterns

```javascript
// Fixed size
dimensions: { height: 300, width: 250 }

// Flexible height, constrained width
dimensions: { width: 300, maxHeight: 500 }

// Height constraint only
dimensions: { height: 400, maxWidth: 350 }

// No dimensions — uses default sizing
// (omit the dimensions key entirely)
```

## Add Route in App.js

Each widget `url` must map to a route in `App.js`:

```jsx
// src/workfront-ui-1/web-src/src/App.js
import MyWidget from './components/MyWidget'

<Route path="/my-widget" element={<MyWidget />} />
```

## Context Data in Widgets

Widgets receive the same sharedContext as other extension points via the guest connection:

```javascript
import { attach } from '@adobe/uix-guest'

const conn = await attach({ id: extensionId })
const context = conn?.sharedContext

const auth      = context?.get('auth')       // { imsToken, imsOrg }
const objCode   = context?.get('objCode')    // 'TASK', 'PROJECT', 'ISSUE', etc.
const objID     = context?.get('objID')      // Object ID (or array if bulk editing)
const hostname  = context?.get('hostname')   // Workfront instance hostname
const user      = context?.get('user')       // { ID, email }
const isLoginAs = context?.get('isLoginAs')  // boolean
const isInBulkEditing = context?.get('isInBulkEditing') // boolean
```

> **Bulk editing**: When `isInBulkEditing` is true, `objID` may contain multiple values. Guard against this in your widget if your logic is per-object.

## How Admins Add a Widget to a Custom Form

1. In Workfront, open **Setup → Custom Forms** and edit or create a form.
2. From the field type list, select **UI Extensions**.
3. Choose the widget from the list (populated from active apps in the IMS org, or from local dev when using `extensionoverride=TRUE` in localStorage).
4. Configure any field-level settings and save the form.
5. Add the custom form to the desired object type (Task, Project, etc.).

## Local Testing

Set `extensionOverride` in the browser's localStorage to point to your local dev server:

```
Key:   extensionOverride
Value: https://localhost:9080
```

Then reload Workfront. Your locally running extension (including widgets) will be served instead of the published version. See SHELL_INTEGRATION.md for full local testing setup.
