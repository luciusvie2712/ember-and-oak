# Security Baseline

- Secrets: inject through local ignored files or platform/GitHub environments; rotate on exposure; never use `NEXT_PUBLIC_*` for secrets.
- CORS: API allowlist comes from `CORS_ORIGINS`; no wildcard with credentials.
- CSRF: current API has no cookie-authenticated mutation. When sessions arrive, use SameSite cookies plus origin verification and a CSRF token for unsafe methods.
- Cookies: `HttpOnly`, `Secure` outside local, `SameSite=Lax` or stricter, narrow path/domain, short-lived session identifier; no PII payload.
- Sessions/admin: server-side revocable sessions, role/permission checks at the API boundary, default deny, MFA-capable identity provider. Phase 5 does not implement auth.
- Rate limits: apply stricter per-IP and per-account limits to auth/reservation mutations when introduced; return 429 and instrument rejections. Edge limits complement, not replace, API limits.
- Input: shared Zod schemas are applied through the scaffolded Nest `ZodValidationPipe` as request DTOs are introduced; output is React-escaped or explicit serialized DTO data. There is no unvalidated mutation route in Phase 5.
- PII logging: never log request bodies, tokens, passwords, full email/phone, customer notes, SQL, or secrets. Prefer opaque IDs and event names.
- Mutation audit: future admin/domain mutations record actor ID, action, resource ID, request ID, time, and outcome—never before/after PII blobs.
- Headers: Helmet on API; nosniff, framing denial, referrer and permissions policies on web/admin. CSP will be tightened when approved analytics/media origins exist.
- Dependency/security updates: review automated advisories; high/critical runtime issues block release.
