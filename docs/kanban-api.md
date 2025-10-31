# Kanban API

## `GET /filings/kanban`

Returns the Kanban board columns and cards.

### Query Parameters

- `clientId` (string, optional): Filter by client ID.
- `vehicleId` (string, optional): Filter by vehicle ID.
- `assigneeId` (string, optional): Filter by assignee ID.
- `slaStatus` (string, optional): Filter by SLA status (`ON_TRACK`, `AT_RISK`, `OFF_TRACK`).
- `search` (string, optional): Search by filing type, client name, or vehicle name.

### Response Shape

```json
[
  {
    "stage": "Draft",
    "cards": [
      {
        "id": "...",
        "title": "...",
        "client": {
          "id": "...",
          "name": "..."
        },
        "vehicle": {
          "id": "...",
          "name": "..."
        },
        "dueDate": "...",
        "slaStatus": "On Track",
        "assignee": {
          "id": "...",
          "name": "..."
        },
        "documentCount": 0
      }
    ],
    "count": 1,
    "meta": {
      "total": 1,
      "overdue": 0,
      "sla": {
        "On Track": 1
      }
    }
  }
]
```

## `PATCH /filings/:id/stage`

Updates the stage of a filing.

### Request Body

```json
{
  "stage": "In Review",
  "assigneeId": "..." // optional
}
```

### Response Body

The updated filing object.
