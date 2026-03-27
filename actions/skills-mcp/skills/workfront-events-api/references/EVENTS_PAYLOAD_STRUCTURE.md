# Workfront Events API — Event Payload Structure

## v2 Payload Format

Workfront delivers a JSON payload via HTTP POST to your webhook URL:

```json
[
    {
        "newState": {
            "ID": "69a0c87800054a686195f5ef9ba27440",
            "accessorIDs": [
                "683608100c84910fae582ddb6ce71173"
            ],
            "aemNativeFolderTreesRefID": null,
            "alignmentScoreCardID": null,
            "approvalProcessID": "68963aaf0003436625deffac7998fc29",
            "attachedRateCardID": null,
            "budget": 0,
            "categoryID": null,
            "companyID": null,
            "convertedOpTaskID": null,
            "convertedOpTaskOriginatorID": null,
            "currency": null,
            "currentApprovalStepID": null,
            "customerID": "63091f4a059594007be96c8c001ad934",
            "deliverableScoreCardID": null,
            "description": null,
            "enteredByID": "683608100c84910fae582ddb6ce71173",
            "entryDate": "2026-02-26T22:26:00.934Z",
            "extRefID": null,
            "financeLastUpdateDate": null,
            "groupID": "63091f560595b3b79cfc61628bf759b6",
            "lastCalcDate": "2026-03-20T06:47:29.738Z",
            "lastConditionNoteID": null,
            "lastNoteID": null,
            "lastUpdateDate": "2026-03-19T22:22:07.714Z",
            "lastUpdatedByID": "683608100c84910fae582ddb6ce71173",
            "milestonePathID": null,
            "name": "PMI PSD Creation Brief",
            "objCode": "PROJ",
            "ownerID": "683608100c84910fae582ddb6ce71173",
            "plannedCompletionDate": "2026-02-27T00:00:00.000Z",
            "plannedStartDate": "2026-02-26T14:00:00.000Z",
            "popAccountID": null,
            "portfolioID": null,
            "preserveBilling": false,
            "priority": 2,
            "privateRateCardID": null,
            "programID": null,
            "queueDefID": "69a0c87800054a6d109e2c41c22cbff9",
            "referenceNumber": 47500,
            "rejectionIssueID": null,
            "resourcePoolID": null,
            "rootGroupID": "63091f560595b3b79cfc61628bf759b6",
            "scheduleID": "63091f560595b3d2c48e0da49d18fdf2",
            "sponsorID": null,
            "status": "CUR",
            "submittedByID": null,
            "teamID": "69a0c87800054a69ff131b665e25d243",
            "templateID": null
        },
        "oldState": {
            "ID": "69a0c87800054a686195f5ef9ba27440",
            "accessorIDs": [
                "683608100c84910fae582ddb6ce71173"
            ],
            "aemNativeFolderTreesRefID": null,
            "alignmentScoreCardID": null,
            "approvalProcessID": "68963aaf0003436625deffac7998fc29",
            "attachedRateCardID": null,
            "budget": 0,
            "categoryID": null,
            "companyID": null,
            "convertedOpTaskID": null,
            "convertedOpTaskOriginatorID": null,
            "currency": null,
            "currentApprovalStepID": null,
            "customerID": "63091f4a059594007be96c8c001ad934",
            "deliverableScoreCardID": null,
            "description": null,
            "enteredByID": "683608100c84910fae582ddb6ce71173",
            "entryDate": "2026-02-26T22:26:00.934Z",
            "extRefID": null,
            "financeLastUpdateDate": null,
            "groupID": "63091f560595b3b79cfc61628bf759b6",
            "lastCalcDate": "2026-03-19T21:53:39.487Z",
            "lastConditionNoteID": null,
            "lastNoteID": null,
            "lastUpdateDate": "2026-03-19T22:22:07.714Z",
            "lastUpdatedByID": "683608100c84910fae582ddb6ce71173",
            "milestonePathID": null,
            "name": "PMI PSD Creation Brief",
            "objCode": "PROJ",
            "ownerID": "683608100c84910fae582ddb6ce71173",
            "plannedCompletionDate": "2026-02-27T00:00:00.000Z",
            "plannedStartDate": "2026-02-26T14:00:00.000Z",
            "popAccountID": null,
            "portfolioID": null,
            "preserveBilling": false,
            "priority": 2,
            "privateRateCardID": null,
            "programID": null,
            "queueDefID": "69a0c87800054a6d109e2c41c22cbff9",
            "referenceNumber": 47500,
            "rejectionIssueID": null,
            "resourcePoolID": null,
            "rootGroupID": "63091f560595b3b79cfc61628bf759b6",
            "scheduleID": "63091f560595b3d2c48e0da49d18fdf2",
            "sponsorID": null,
            "status": "CUR",
            "submittedByID": null,
            "teamID": "69a0c87800054a69ff131b665e25d243",
            "templateID": null
        },
        "eventTime": {
            "epochSecond": 1773989249,
            "nano": 847713947
        },
        "subscriptionId": "8e954a1ce7ca4bd7b751b1e6d451bff3",
        "eventType": "UPDATE",
        "customerId": "63091f4a059594007be96c8c001ad934",
        "userId": null,
        "subscriptionVersion": "v2",
        "eventVersion": "v2"
    }
]
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
