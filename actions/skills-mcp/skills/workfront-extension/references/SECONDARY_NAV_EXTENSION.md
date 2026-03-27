# Workfront secondaryNav Extension — Complete Pattern Guide

Derived from `workfront_extensibility_demo` — a fully working secondaryNav extension.

## What secondaryNav Does

`secondaryNav` adds **custom tabs** to the right-hand panel of a Workfront object page (Task, Project, Documents, Issue, Portfolio, Program). When a user opens a Task and clicks your custom tab, Workfront loads your extension's URL in an embedded iframe alongside native tabs.

---

## Supported Object Types

| `secondaryNav` key | Appears on | Workfront `objCode` in sharedContext |
|---|---|---|
| `TASK` | Task detail page | `TASK` |
| `PROJECT` | Project detail page | `PROJ` |
| `DOCUMENTS` | Documents tab of any object | `DOCU` |
| `ISSUE` | Issue detail page | `OPTASK` |
| `PORTFOLIO` | Portfolio detail page | `PORT` |
| `PROGRAM` | Program detail page | `PRGM` |

Working examples exist for `TASK`, `PROJECT`, and `DOCUMENTS`. `ISSUE`, `PORTFOLIO`, `PROGRAM` follow the same pattern.

---

## ExtensionRegistration.js — Combined mainMenu + secondaryNav

One `register()` call declares **all** extension points. `mainMenu` and `secondaryNav` are sibling keys inside `methods`.

```javascript
import { Text } from "@adobe/react-spectrum";
import { register } from "@adobe/uix-guest";
import { extensionId, cfFormIcon } from "./Constants";
import metadata from '../../../../app-metadata.json';

function ExtensionRegistration({ isLocal }) {
  const init = async () => {
    await register({
      metadata,
      methods: {
        id: extensionId,

        // ── mainMenu items (left-nav portal views) ──────────────────────
        mainMenu: {
          getItems() {
            return [
              {
                id: isLocal ? 'myView_LDEV' : 'myView',
                label: isLocal ? 'My View LDEV' : 'My View',
                icon: cfFormIcon,
                url: '/index.html#/my-view',
              },
            ];
          },
        },

        // ── secondaryNav items (tabs on object detail pages) ────────────
        secondaryNav: {
          TASK: {
            getItems() {
              return [
                {
                  id: isLocal ? 'taskTab1_LDEV' : 'taskTab1',
                  label: isLocal ? 'My Task Tab LDEV' : 'My Task Tab',
                  icon: cfFormIcon,
                  url: '/index.html#/task-view',
                },
              ];
            },
          },
          PROJECT: {
            getItems() {
              return [
                {
                  id: isLocal ? 'projectTab1_LDEV' : 'projectTab1',
                  label: isLocal ? 'Project Details LDEV' : 'Project Details',
                  icon: cfFormIcon,
                  url: '/index.html#/project-view',
                },
              ];
            },
          },
          DOCUMENTS: {
            getItems() {
              return [
                {
                  id: isLocal ? 'docTab1_LDEV' : 'docTab1',
                  label: isLocal ? 'Open In Express LDEV' : 'Open In Express',
                  icon: cfFormIcon,
                  url: '/index.html#/document-view',
                },
              ];
            },
          },
          // ISSUE, PORTFOLIO, PROGRAM follow the same pattern
        },
      },
    });
  };
  init().catch(console.error);

  return <Text>Extension Registration</Text>;
}

export default ExtensionRegistration;
```

---

## App.js — Add Routes for Each secondaryNav View

```javascript
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import ExtensionRegistration from "./ExtensionRegistration";
import TaskView from "./secondaryNav/TaskView";
import ProjectView from "./secondaryNav/ProjectView";
import DocumentView from "./secondaryNav/DocumentView";

function App() {
  const isLocal = window.location.href.includes("localhost");

  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <Router>
        <Routes>
          <Route index element={<ExtensionRegistration isLocal={isLocal} />} />
          <Route path="index.html" element={<ExtensionRegistration isLocal={isLocal} />} />
          {/* one route per secondaryNav item */}
          <Route path="task-view" element={<TaskView />} />
          <Route path="project-view" element={<ProjectView />} />
          <Route path="document-view" element={<DocumentView />} />
        </Routes>
      </Router>
    </Provider>
  );
}
```

---

## View Component — Accessing Object Context

When a secondaryNav tab is loaded, Workfront populates `sharedContext` with the **current object's data**. Use `attach({ id: extensionId })` to connect and read it.

```javascript
import { attach } from "@adobe/uix-guest";
import { extensionId } from "./Constants";
import { useState, useEffect } from "react";

function TaskView() {
  const [conn, setConn] = useState(null);
  const [authToken, setAuthToken] = useState("");
  const [objID, setObjID] = useState("");
  const [hostname, setHostname] = useState("");

  // Phase 1: attach to get connection
  useEffect(() => {
    attach({ id: extensionId }).then(setConn).catch(console.error);
  }, []);

  // Phase 2: extract context once connected
  useEffect(() => {
    if (!conn) return;
    const auth     = conn.sharedContext.get("auth");
    const objCode  = conn.sharedContext.get("objCode");   // 'TASK'
    const objID    = conn.sharedContext.get("objID");     // Workfront UUID
    const hostname = conn.sharedContext.get("hostname");  // '<workfront_host>'
    const user     = conn.sharedContext.get("user");      // { ID, email }

    setAuthToken(auth.imsToken);
    setObjID(objID);
    setHostname(hostname);

    console.log(`Loaded ${objCode} id=${objID} for user ${user.email}`);
  }, [conn]);

  // Phase 3: use token + context to fetch data or call actions
  useEffect(() => {
    if (!authToken || !objID) return;
    // call a backend Runtime action or Workfront API here
  }, [authToken, objID]);

  return <div>Task View for object {objID}</div>;
}
```

**Key rule:** For secondaryNav, `attach({ id: extensionId })` uses the **same `extensionId` constant** used in `register()`. This matches the extension-level connection, not a view-level id.

---

## Local Dev Conflict Avoidance

If you run `aio app run` (localhost) while a deployed version is also active on the same Workfront instance, both will try to register the same IDs. Suffix local IDs with `_LDEV`:

```javascript
const isLocal = window.location.href.includes("localhost");

// In register() getItems():
id: isLocal ? 'taskTab1_LDEV' : 'taskTab1',
label: isLocal ? 'My Task Tab LDEV' : 'My Task Tab',
```

Pass `isLocal` as a prop from `App.js` down to `ExtensionRegistration`.

---

## Adding New Object Types (Checklist)

1. Add the object type key to `secondaryNav` in `ExtensionRegistration.js` with its `getItems()` array
2. Add a `<Route>` in `App.js` pointing to the new view component
3. Create the view component — use `attach({ id: extensionId })` + `sharedContext`
4. Add the item to `extension-manifest.json` → `secondaryNavItems` array (same `{ label, id }` shape)

Supported keys: `TASK`, `PROJECT`, `DOCUMENTS`, `ISSUE`, `PORTFOLIO`, `PROGRAM`

---

## extension-manifest.json

```json
{
  "name": "my-wf-extension",
  "id": "my-wf-ext",
  "version": "0.0.1",
  "mainMenuItems": [
    { "label": "My View", "id": "myView" }
  ],
  "secondaryNavItems": [
    { "label": "My Task Tab", "id": "taskTab1" },
    { "label": "Project Details", "id": "projectTab1" },
    { "label": "Open In Express", "id": "docTab1" }
  ]
}
```
