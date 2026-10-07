# Admin authentication architecture

Phase 11 replaces Basic Auth and the interactive content API key with a database-backed opaque
session. Passwords use Node `scrypt` with a random 16-byte salt. A successful login creates a
random 32-byte base64url token; only its SHA-256 digest is persisted.

The Admin server stores the raw token in the HTTP-only, SameSite=Lax `eo_admin_session` cookie.
Secure cookies are mandatory outside local development. The token is never exposed through React
state or local storage. Protected renders call `/v1/admin/auth/me`, and the API authorizes every
mutation again.

`ADMIN_COOKIE_SECURE=false` exists only for local HTTP and the Playwright HTTP server. Staging and
production set it to `true` (or omit the override under production HTTPS).

Default TTL is 8 hours. Five failures in a 15-minute window lock the account for 15 minutes.
Unknown accounts execute a fake scrypt verification. Logs contain only an event and reason
category—never passwords, tokens, authorization headers or guest PII. Production accounts are
created only through `admin:bootstrap`; migrations contain no credentials.

`ADMIN_CONTENT_API_KEY` remains an explicitly legacy, server-to-server automation fallback so older
integration and publishing jobs can migrate safely. The Admin web application never reads or sends
it; all interactive content access uses the database session and ADMIN/CONTENT_EDITOR role checks.
