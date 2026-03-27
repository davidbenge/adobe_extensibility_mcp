# Workfront mainMenu Extension — Complete Pattern Guide

Derived from `workfront_extensibility_portal` — a fully working mainMenu extension.

## How It Works (Two Phases)

**Phase 1 — Registration (hidden iframe at `#/`)**
Workfront loads the extension in a hidden iframe at `index.html`. `ExtensionRegistration` calls `register()` which handshakes with Workfront over postMessage and advertises `mainMenu.getItems()`. Workfront calls that method and injects the returned items into its left-nav sidebar.

**Phase 2 — View (visible iframe navigated to menu item URL)**
When a user clicks a nav item, Workfront loads `index.html#/<route>` in a content iframe. React Router matches the hash route and renders the view component. The view calls `attach({ id: "<route-id>" })` to get the user's IMS token and Workfront hostname from `sharedContext`.

---

## File Structure

```
src/workfront-ui-1/
├── ext.config.yaml                   # Extension config (entry point + lifecycle hooks)
├── app-metadata.json                 # Generated — do not edit (created by pre-build hook)
├── actions/
│   ├── wfapi/index.js                # Generic WF REST API proxy action
│   └── pendingApprovalsWidget/index.js  # Example domain-specific action
└── web-src/src/components/
    ├── App.js                        # HashRouter — all routes live here
    ├── ExtensionRegistration.js      # ONE per app — registers all menu items
    ├── Constants.js                  # extensionId constant
    ├── icons.js                      # Base64 PNG icon exports
    ├── utils/
    │   ├── utils.js                  # actionWebInvoke() for calling Runtime actions
    │   └── authTokenManager.js       # JWT decode + IMS cookie helper (optional)
    └── mainMenu/
        └── myWorkView.js             # View component rendered when nav item is clicked
```

---

## ExtensionRegistration.js

There is exactly **one** `ExtensionRegistration.js` per app. It registers **all** mainMenu items.

```javascript
import { Text } from "@adobe/react-spectrum";
import { register } from "@adobe/uix-guest";
import { extensionId } from "./Constants";
import metadata from '../../../../app-metadata.json';
import { icon1, icon2 } from './icons';

function ExtensionRegistration() {
  const init = async () => {
    await register({
      metadata,
      methods: {
        id: extensionId,
        mainMenu: {
          getItems() {
            return [
              {
                id: 'my-work-view',          // must match route in App.js
                url: '/index.html#/my-work-view',
                label: 'My Work View',
                icon: icon1,                 // base64 PNG string
              },
              // add more items here for additional nav entries
            ];
          },
        },
      }
    });
  };
  init().catch(console.error);

  return <Text>IFrame for integration with Host (Workfront)...</Text>;
}

export default ExtensionRegistration;
```

**Icons** are base64 PNG strings exported from `icons.js`:
```javascript
const icon1 = `data:image/png;base64,iVBORw0KGgo...`;
module.exports = { icon1, icon2 };
```

---

## App.js — HashRouter Routing

`HashRouter` is required — the app runs as a static SPA inside an iframe, and hash routing avoids server-side 404s.

```javascript
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ExtensionRegistration from "./ExtensionRegistration";
import MyWorkView from "./mainMenu/myWorkView";

function App() {
  return (
    <Router>
      <ErrorBoundary onError={onError} FallbackComponent={fallbackComponent}>
        <Routes>
          <Route index element={<ExtensionRegistration />} />
          <Route exact path="index.html" element={<ExtensionRegistration />} />
          {/* Add one Route per mainMenu item */}
          <Route exact path="my-work-view" element={<MyWorkView />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}
```

---

## Adding a New mainMenu Item (Checklist)

1. Add entry to `ExtensionRegistration.js` → `mainMenu.getItems()` array (`id`, `url`, `label`, `icon`)
2. Add matching `<Route>` in `App.js` pointing to your new view component
3. Create the view component at `mainMenu/<your-view>.js`
4. Add entry to `extension-manifest.json` → `mainMenuItems` array

---

## View Component — Getting IMS Token and Hostname

Each view uses `attach()` with the **same id as the route** to get shared context from Workfront.

```javascript
import { attach } from "@adobe/uix-guest";
import { useState, useEffect } from "react";
import actionWebInvoke from "../utils/utils";
import allActions from "../../../config.json";

const MyWorkView = () => {
  const [accessToken, setAccessToken] = useState('');
  const [hostname, setHostname] = useState('');

  useEffect(() => {
    const doAttach = async () => {
      const conn = await attach({ id: "my-work-view" }); // id must match getItems() id
      const auth = conn?.sharedContext?.get("auth");
      if (auth?.imsToken) setAccessToken(auth.imsToken);
      const host = conn?.sharedContext?.get("hostname");
      if (host) setHostname(host);
    };
    doAttach().catch(console.error);
  }, []);

  useEffect(() => {
    if (!accessToken || !hostname) return;
    // safe to call backend actions now
    fetchData(accessToken, hostname);
  }, [accessToken, hostname]);
};
```

---

## Calling a Backend Runtime Action from a Widget

`actionWebInvoke` (from `utils/utils.js`) wraps `fetch()` for I/O Runtime:

```javascript
const actionUrl = allActions['wep/pendingApprovalsWidget']; // key from config.json
const headers   = { 'Authorization': `Bearer ${accessToken}` };
const params    = { hostname };

const response  = await actionWebInvoke(actionUrl, headers, params); // POST by default
const data      = await response.json();
```

For write operations (approve/reject), use the generic `wfapi` action:
```javascript
const res = await actionWebInvoke(allActions['wep/wfapi'], headers, {
  requestObj: {
    hostname,
    method: 'put',
    objCode: 'OPTASK',
    ID: objId,
    parameters: { action: 'approveApproval' }
  }
});
```

To open a Workfront object in the host app:
```javascript
window.open(`https://${hostname}/project/${objId}`, "_blank");
```

---

## Widget Pattern — Static Mock vs Live Data

Most widgets use **static mock data** for rapid prototyping. Only one widget (PendingApprovalsWidget) calls a live backend action. Mix freely — mock everything first, then swap in live calls widget by widget.

```
widgets/
├── CampaignTimelineWidget/  ← static mock data, plain CSS grid
├── PendingApprovalsWidget/  ← live via attach() + actionWebInvoke
├── LiveCampaignsWidget/     ← static mock
└── MediaInsightsWidget/     ← static mock
```

---

## Config Files

**`extension-manifest.json`** — declares the extension identity:
```json
{
  "name": "portal example",
  "id": "portal-example",
  "description": "a main menu portal demo experience",
  "version": "0.0.1",
  "mainMenuItems": [
    { "label": "My Work View", "id": "my-work-view" }
  ]
}
```

**`ext.config.yaml`** — registers lifecycle hooks that auto-generate `app-metadata.json`:
```yaml
operations:
  view:
    - type: web
      impl: index.html
web: web-src
hooks:
  pre-app-run: node node_modules/@adobe/uix-guest/scripts/generate-metadata.js
  pre-app-build: node node_modules/@adobe/uix-guest/scripts/generate-metadata.js
```

**`app.config.yaml`** — maps Runtime actions:
```yaml
extensions:
  workfront/ui/1:
    $include: src/workfront-ui-1/ext.config.yaml
    runtimeManifest:
      packages:
        wep:
          actions:
            wfapi:
              function: src/workfront-ui-1/actions/wfapi/index.js
              web: 'yes'
              runtime: nodejs:22
              annotations:
                require-adobe-auth: false
                final: true
```

---

## Key Dependencies

```json
{
  "@adobe/uix-guest": "^0.10.0",
  "@adobe/react-spectrum": "^3.43.0",
  "@adobe/aio-sdk": "^6",
  "react-router-dom": "^6.3.0",
  "react-error-boundary": "^4.1.2",
  "jwt-decode": "^4.0.0",
  "axios": "^1.11.0"
}
```
