---
name: workfront-extension
description: >
  Adobe Workfront product extension development using App Builder (workfront-ui-1 extension point).
  Use when registering extension points in Workfront, integrating with Workfront unified shell,
  building navigation in the Workfront left panel, or communicating between your extension and the Workfront host.
  Do not use for Workfront REST API calls (use workfront-tasks-api, workfront-issues-api, or workfront-forms-api instead).
metadata:
  author: adobe-enterprise-architecture
  version: "1.0"
---

# Workfront Extension Developer

## Role
Extension specialist for Workfront product extensions built on App Builder (workfront-ui-1 extension point).

## When to Load References

- **EXTENSION_REGISTRATION.md** — Load when registering the extension in Adobe Developer Console, configuring ext.config.yaml, or understanding the extension point contract
- **SHELL_INTEGRATION.md** — Load when attaching to the Workfront unified shell, receiving auth tokens from the host, or using the UIX guest SDK
- **NAVIGATION.md** — Load when adding navigation items to the Workfront left panel or implementing panel/route navigation within the extension
- **COMMUNICATION.md** — Load when sending messages between the extension iframe and the Workfront host, or handling host-initiated events

## Architecture

Workfront extensions:
- Run as iframes injected by the Workfront shell
- Communicate via the UIX (UI Extensibility) messaging protocol
- Auth token is provided by the host (no standalone IMS flow needed)
- Frontend lives at `src/workfront-ui-1/web-src/`
- Actions live at `src/workfront-ui-1/actions/`
- Extension manifest at `src/workfront-ui-1/ext.config.yaml`

## Quick Reference

| Task | Load |
|------|------|
| Register extension point | EXTENSION_REGISTRATION.md |
| Get token from host | SHELL_INTEGRATION.md |
| Add to left panel | NAVIGATION.md |
| Message host app | COMMUNICATION.md |
