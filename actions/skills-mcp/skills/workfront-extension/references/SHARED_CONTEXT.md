# Workfront Extension — sharedContext Reference

Derived from `workfront_extensibility_demo` `ShowValues.js` — the canonical example of reading all available context data from Workfront via the UIX guest SDK.

---

## What is sharedContext?

When Workfront loads your extension's view iframe, it passes contextual data through the UIX messaging channel. Your view component reads this via `conn.sharedContext.get(key)` after calling `attach()`.

`sharedContext` is available **only in view components** (secondaryNav tabs and mainMenu views), not in `ExtensionRegistration`.

---

## All Available sharedContext Properties

| Key | Type | Description |
|---|---|---|
| `auth` | `{ imsToken: string }` | IMS Bearer token for the current user |
| `objCode` | `string` | Workfront object type code of the current page |
| `objID` | `string` | UUID of the current Workfront object |
| `hostname` | `string` | Workfront hostname (e.g. `<workfront_host>`) |
| `user` | `{ ID: string, email: string }` | Current logged-in user |
| `host` | `object` | Additional host context (structure may vary) |

### `objCode` Values by Object Type

| Object | `objCode` |
|---|---|
| Project | `PROJ` |
| Task | `TASK` |
| Issue / Request | `OPTASK` |
| Document | `DOCU` |
| Portfolio | `PORT` |
| Program | `PRGM` |
| Approval | `APPROVAL` |

---

## Complete attach() + sharedContext Pattern

```javascript
import { attach } from "@adobe/uix-guest";
import { extensionId } from "./Constants";
import { useState, useEffect } from "react";

function MyView() {
  const [conn, setConn] = useState(null);
  const [authToken, setAuthToken] = useState("");
  const [objCode, setObjCode] = useState("");
  const [objID, setObjID] = useState("");
  const [hostname, setHostname] = useState("");
  const [user, setUser] = useState(null);

  // Step 1: attach to establish the host tunnel
  useEffect(() => {
    attach({ id: extensionId })
      .then(setConn)
      .catch(console.error);
  }, []);

  // Step 2: read all context properties once connected
  useEffect(() => {
    if (!conn) return;

    const auth     = conn.sharedContext.get("auth");
    const objCode  = conn.sharedContext.get("objCode");
    const objID    = conn.sharedContext.get("objID");
    const hostname = conn.sharedContext.get("hostname");
    const user     = conn.sharedContext.get("user");

    setAuthToken(auth.imsToken);
    setObjCode(objCode);
    setObjID(objID);
    setHostname(hostname);
    setUser(user);
  }, [conn]);

  // Step 3: act on context — call APIs, fetch data, etc.
  useEffect(() => {
    if (!authToken || !hostname) return;
    // safe to make API calls now
  }, [authToken, hostname]);
}
```

---

## ShowValues Debug Component

`ShowValues.js` is a ready-made diagnostic component that reads every sharedContext property and renders them in a table with copy-to-clipboard. Drop it behind any secondaryNav route to inspect what Workfront is passing:

```javascript
import { attach } from "@adobe/uix-guest";
import { extensionId } from "./Constants";
import { TableView, TableHeader, TableBody, Column, Row, Cell, Button } from "@adobe/react-spectrum";
import CopyIcon from '@spectrum-icons/workflow/Copy';
import { useState, useEffect } from "react";

function ShowValues() {
  const [contextProperties, setContextProperties] = useState([]);
  const [conn, setConn] = useState(null);
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    attach({ id: extensionId }).then(setConn).catch(console.error);
  }, []);

  useEffect(() => {
    if (!conn) return;
    const auth     = conn.sharedContext.get("auth");
    const objCode  = conn.sharedContext.get("objCode");
    const objID    = conn.sharedContext.get("objID");
    const hostname = conn.sharedContext.get("hostname");
    const user     = conn.sharedContext.get("user");

    setAuthToken(auth.imsToken);
    setContextProperties([
      { name: "objCode",     value: objCode,      id: 1 },
      { name: "objID",       value: objID,        id: 2 },
      { name: "hostname",    value: hostname,     id: 3 },
      { name: "user.ID",     value: user.ID,      id: 4 },
      { name: "user.email",  value: user.email,   id: 5 },
    ]);
  }, [conn]);

  useEffect(() => {
    if (!authToken) return;
    setContextProperties(prev => [
      ...prev,
      { name: "authToken", value: authToken, id: 6 },
    ]);
  }, [authToken]);

  const copy = (val) => navigator.clipboard.writeText(val);

  return (
    <TableView selectionMode="none" aria-label="Context values">
      <TableHeader>
        <Column maxWidth={200}>Property</Column>
        <Column>Value</Column>
        <Column maxWidth={80}>&nbsp;</Column>
      </TableHeader>
      <TableBody items={contextProperties}>
        {(item) => (
          <Row>
            <Cell>{item.name}</Cell>
            <Cell>{item.value}</Cell>
            <Cell>
              <Button variant="primary" onPress={() => copy(item.value)} aria-label="Copy">
                <CopyIcon />
              </Button>
            </Cell>
          </Row>
        )}
      </TableBody>
    </TableView>
  );
}

export default ShowValues;
```

Wire it to a secondaryNav route in `App.js` and `ExtensionRegistration.js` for instant debugging of any object page.

---

## Using IMS Token for API Calls

The `auth.imsToken` is a valid Bearer token for both the Workfront REST API and AEM GraphQL. Pass it in the Authorization header:

```javascript
// Workfront REST API
const response = await fetch(
  `https://${hostname}/attask/api/v20.0/TASK/${objID}?fields=name,status`,
  { headers: { Authorization: `Bearer ${authToken}` } }
);

// AEM GraphQL (after optional token exchange for different scope)
const response = await fetch(
  `${AEM_HOST}/graphql/execute.json/my-project/my-query`,
  { headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" } }
);
```

---

## AuthTokenManager — Optional JWT Utility

Use `authTokenManager` (from `utils/authTokenManager.js`) to decode the IMS token and optionally exchange it for one with a different scope/clientId (e.g., for AEM asset selector access):

```javascript
import authTokenManager from '../utils/authTokenManager';

// After getting auth.imsToken:
authTokenManager.initialize(imsToken);

// Inspect decoded fields
const { client_id, scope, user_id } = authTokenManager.getDecodedTokenData();

// Exchange for different scope (e.g., AEM access)
const newToken = await authTokenManager.exchangeToken({
  newClientId: 'aem-assets-frontend-1',
  newScope: 'AdobeID,openid,read_organizations,additional_info.roles'
});
```

---

## Opening Workfront Objects from Your Extension

Use `hostname` + `objCode` to deep-link into the Workfront host app:

```javascript
// Object type map
const objTypeMap = { PROJ: 'project', TASK: 'task', OPTASK: 'issue', DOCU: 'document' };

// Open in a new tab
window.open(`https://${hostname}/${objTypeMap[objCode]}/${objID}`, "_blank");
```
