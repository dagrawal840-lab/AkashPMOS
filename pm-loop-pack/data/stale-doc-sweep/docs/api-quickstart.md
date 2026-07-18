# API Quickstart

Last updated: 2026-05-30 · Owner: Sam Whitaker (Platform)

## Auth
Create an API key under Settings > API. Send it as `Authorization: Bearer <key>`.

## Common calls
- `GET /v2/tickets?status=open` — list open tickets
- `POST /v2/tickets/{id}/merge` — merge tickets (max 20 per call)
- `GET /v2/reports/scheduled` — list scheduled email exports

## Rate limits
600 requests/min per workspace. 429s include a `Retry-After` header.
