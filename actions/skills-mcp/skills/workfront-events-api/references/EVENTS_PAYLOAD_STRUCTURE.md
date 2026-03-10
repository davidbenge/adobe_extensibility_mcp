# Workfront Events API — Event Payload Structure

## v2 Payload Format

Workfront delivers a JSON payload via HTTP POST to your webhook URL:

```json
{
    "subscriptionId": "sub-uuid-here",
    "eventType": "UPDATE",
    "eventTime": {
        "nano": 123456789,
        "epochSecond": 1712000000
    },
    "newState": {
        "ID": "task-id-here",
        "objCode": "TASK",
        "name": "Updated Task Name",
        "status": "INP",
        "percentComplete": 50
    },
    "oldState": {
        "ID": "task-id-here",
        "objCode": "TASK",
        "name": "Original Task Name",
        "status": "NEW",
        "percentComplete": 0
    }
}
```

## State Patterns by Event Type

| eventType | newState | oldState |
|-----------|----------|----------|
| CREATE | Full new object | Empty `{}` |
| UPDATE | New field values | Previous field values |
| DELETE | Empty `{}` | Full deleted object |

## Key Fields

| Field | Description |
|-------|-------------|
| `subscriptionId` | Which subscription triggered this event |
| `eventType` | CREATE, UPDATE, or DELETE |
| `eventTime.epochSecond` | Unix timestamp (seconds) — use for ordering |
| `eventTime.nano` | Nanoseconds — for sub-second ordering |
| `newState` | State of the object AFTER the change |
| `oldState` | State of the object BEFORE the change |

## Detecting What Changed (UPDATE events)

```javascript
function getChangedFields(payload) {
    const { newState, oldState } = payload
    return Object.keys(newState).filter(key =>
        JSON.stringify(newState[key]) !== JSON.stringify(oldState[key])
    )
}
```

## Multi-Select Fields (v2 breaking change)

In v2 payloads, multi-select field values are **arrays**, not comma-separated strings:

```json
"DE:Tags": ["Tag1", "Tag2", "Tag3"]
```

## Ordering Concurrent Events

Use `eventTime.epochSecond` first, then `eventTime.nano` for tie-breaking:

```javascript
events.sort((a, b) => {
    const secDiff = a.eventTime.epochSecond - b.eventTime.epochSecond
    return secDiff !== 0 ? secDiff : a.eventTime.nano - b.eventTime.nano
})
```
