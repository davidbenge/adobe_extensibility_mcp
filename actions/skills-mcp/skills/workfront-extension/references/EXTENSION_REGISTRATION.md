# Workfront Extension — Registration

## Extension Point ID

Workfront product extensions use the **`workfront/ui/1`** extension point only.

There is **no** separate App Builder extension point for “document details.” Custom actions in the document details experience are registered on the same `workfront/ui/1` app through **`ExtensionRegistration`** (UIX guest `register()`), alongside `mainMenu`, `secondaryNav`, etc.

## Document details — `DOCUMENTS` in ExtensionRegistration

Add a **`DOCUMENTS`** block with **`getItems()`** inside the same `methods` object you pass to `register()` from `@adobe/uix-guest`. Workfront calls `getItems()` and surfaces each entry in the document details UI.

```javascript
await register({
  metadata,
  methods: {
    id: extensionId,
    DOCUMENTS: {
      getItems() {
        return [
          {
            id: 'documentExpress',
            label: 'Open In Express',
            icon: yourIcon, // e.g. base64 PNG or component your app uses
            url: '/index.html#/open_in_express',
          },
        ];
      },
    },
  },
});
```

Add a matching hash route and view under `web-src/` (same pattern as mainMenu items). For the overall registration iframe and routing shape, see **MAIN_MENU_EXTENSION.md**.

## ext.config.yaml

```yaml
# src/workfront-ui-1/ext.config.yaml
operations:
  view:
    - type: web
      impl: index.html
extensions:
  workfront/ui/1:
    $include: ext.config.yaml
```

## app.config.yaml (root)

```yaml
application:
  extensions:
    workfront/ui/1:
      $include: src/workfront-ui-1/ext.config.yaml
```

## Adobe Developer Console Setup

1. Create a new project in Adobe Developer Console
2. Add the **Workfront** product API
3. Select the `workfront/ui/1` extension point
4. Configure allowed domains for your extension

## Package Structure

```
src/workfront-ui-1/
├── ext.config.yaml        # Extension configuration
├── actions/               # Backend actions
│   └── index.js
└── web-src/               # React frontend
    ├── index.html
    └── src/
        ├── index.jsx      # Entry point
        └── App.jsx
```

## Required Dependencies

```json
{
  "@adobe/uix-guest": "^0.9.0",
  "@adobe/react-spectrum": "^3.0.0"
}
```

## Registration Checklist

- [ ] `ext.config.yaml` declares `workfront/ui/1`
- [ ] `app.config.yaml` includes the extension config
- [ ] App registered in Adobe Developer Console with correct extension point
- [ ] Allowed domains configured in Developer Console
- [ ] `@adobe/uix-guest` SDK included in dependencies
