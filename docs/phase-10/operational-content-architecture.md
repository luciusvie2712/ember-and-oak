# Phase 10 Operational Content Architecture

## Decisions

- PostgreSQL enquiry persistence is authoritative. A successful database commit is not reversed by a future notification-provider failure. No email provider or recipient is assumed until the business chooses one.
- Event type and budget are bounded free text, not invented enums or monetary amounts. The enquiry guest upper bound is a technical abuse guardrail, not a private-dining capacity rule.
- The operations content document owns confirmed location, contact, and publishable policies. It does not copy opening hours or special closures.
- `opening_hours` and `special_closures` remain the booking engine's authority. The public operations API projects the same records and strips internal closure reasons.
- Contact values and unresolved policies cannot publish until the relevant decisions are confirmed. The web can still render an intentional unpublished/empty state.
- Full admin authentication, reservation management, private-event CRM, and customer history are Phase 11 work.

## Data boundaries

Private Dining editorial content uses the existing draft/publish media pipeline. Operational editorial content uses the same pipeline but only for non-transactional, business-approved data. Private-event enquiries are transactional records, never CMS content or analytics payloads. Public create responses return only an opaque receipt, not guest details.

## Publication and staging

The local seed may include clearly marked editorial fixtures. It must not publish unverified production contact data or open policies. Staging verification must capture a deployed revision, sanitized API/UI and database evidence, duplicate-submit behavior, closure consistency, and a PII-log review before Phase 10 closes.

The Private Dining fixture is published for local/automated presentation tests and uses the source-backed capacity labels. No operations document is seeded. Until the business confirms `DEC-0038` and publishes an operations document with slug `primary`, `GET /api/v1/operations` returns 404 and the web shows an explicit unpublished-contact state. Home location and Footer omit contact details rather than substitute fixture data.
