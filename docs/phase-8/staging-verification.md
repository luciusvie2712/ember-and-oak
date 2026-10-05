# Phase 8 Staging Verification

Status: **PENDING**

## Preconditions

- Deploy an API build containing migration `002_phase_8_reservation`.
- Configure the real staging `DATABASE_URL` and existing API secrets.
- Insert a clearly labelled staging-only capacity fixture; do not describe it as production capacity.
- Confirm opening hours and timezone `Asia/Ho_Chi_Minh`.

## Evidence checklist

- [ ] Migration exists in `schema_migrations` and all Phase 8 tables/indexes exist.
- [ ] Availability response has the correct date, timezone, and latest service-end-safe slot.
- [ ] A valid create request returns `201`, `CONFIRMED`, and an `EO-` reservation code.
- [ ] Repeating the same key/body returns the same logical reservation.
- [ ] Reusing the key with a changed body returns `409 IDEMPOTENCY_CONFLICT`.
- [x] GET availability and POST reservation with 9 guests both return `400 PARTY_TOO_LARGE`.
- [ ] An expired idempotency row is removed by the deployed maintenance service (confirm the cleanup run in the staging database).
- [ ] A partial closure's persisted `reason` is retrievable through the repository/canonical model.
- [ ] Two capacity-competing requests cannot commit covers above service capacity.
- [ ] Failed creation leaves no orphan customer, reservation, or successful idempotency record.
- [ ] Render/application logs contain no full guest email, phone, special request, secrets, SQL, or stack trace.
- [ ] Test records and staging-only capacity fixtures are removed or retained according to the staging data policy.

## Suggested PowerShell smoke check

```powershell
$Api = "https://YOUR-STAGING-API"
$Date = "YYYY-MM-DD"
$Key = [guid]::NewGuid().ToString()

Invoke-RestMethod "$Api/api/v1/reservations/availability?date=$Date&guests=2"

$Body = @{
  date = $Date
  startTime = "19:00"
  guestCount = 2
  guest = @{
    name = "Phase Eight Staging Test"
    email = "phase8-test@example.invalid"
    phone = "+84900000000"
  }
  specialRequest = "Phase 8 staging verification"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod "$Api/api/v1/reservations" -Method Post `
  -Headers @{ "Idempotency-Key" = $Key } `
  -ContentType "application/json" -Body $Body
```

Repeat the POST with the same `$Key` and `$Body`, then run the documented competing-request proof and inspect the database/logs. Record timestamps, sanitized response summaries, and deployment revision before declaring Phase 8 closed.

## Observed staging evidence (2026-10-05)

- [GitHub Actions run 37282739220](https://github.com/luciusvie2712/ember-and-oak/actions/runs/37282739220) for `main` revision `272a0a1292a6070aacb07127bde5ab59707fe322`: quality and staging jobs passed. The staging job triggered all three deploy hooks and received HTTP 200 from the API `/api`, admin `/`, and web `/`. Its smoke script checks reachability only; it does not prove the reservation workflow or database state.
- Against `https://ember-and-oak-api-staging-kxw3.onrender.com`, GET `/api/v1/reservations/availability?date=2026-10-13&guests=9` returned HTTP 400 with `PARTY_TOO_LARGE`.
- POST `/api/v1/reservations` with 9 guests and an `example.invalid` test identity returned HTTP 400 with `PARTY_TOO_LARGE`.
- GET availability for 2 guests on 2026-10-13 returned HTTP 200 with `timezone: Asia/Ho_Chi_Minh`, `status: NO_AVAILABILITY`, and no slots. No capacity fixture or valid create was exercised.
- Migration/schema, expired-row maintenance in the deployed database, valid create/replay/conflict, concurrency, rollback, and PII/log checks remain unverified on staging. Staging database and provider-log access are required; Phase 8 is **not closed**.
