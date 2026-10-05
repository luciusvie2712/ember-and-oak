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
