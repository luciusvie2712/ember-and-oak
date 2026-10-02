# Phase 7 Delivery Checkpoints

Status: **IMPLEMENTATION COMPLETE — STAGING PROOF PENDING**
Architecture preflight: **PASSED 2026-10-02**

Phase 7 is managed as one preflight gate (`7.0`) followed by ten delivery
checkpoints (`7.1`–`7.10`). A later checkpoint may not be called complete merely
because its page renders; its stated behavior and verification must pass.

| Checkpoint | Scope                                                              | Status            | Exit evidence                                                            |
| ---------- | ------------------------------------------------------------------ | ----------------- | ------------------------------------------------------------------------ |
| 7.0        | Preflight and content architecture decision                        | Complete          | `content-architecture-decision.md`; DEC-0025                             |
| 7.1        | Canonical content contracts, Zod validation, repository interfaces | Complete          | Contract/validation tests and no UI dependency on persistence shapes     |
| 7.2        | Shared image/media pipeline                                        | Complete          | Responsive component tests; stable dimensions; loading/alt/rights rules  |
| 7.3        | Server-rendered Menu UI                                            | Complete          | Route/component tests; data-driven anchors; centralized price formatting |
| 7.4        | Menu production data and minimal editor flow                       | Complete locally  | Authenticated draft/publish/archive integration test                     |
| 7.5        | Our Story and canonical Chef integration                           | Complete          | Narrative route tests; optional-section behavior; shared Chef record     |
| 7.6        | Responsive Gallery                                                 | Complete          | Published-only responsive grid with lazy, dimensioned media              |
| 7.7        | Publish outbox, cache tags, and signed revalidation                | Complete locally  | Transactional outbox, HMAC endpoint, bounded cache fallback              |
| 7.8        | Retrofit Home to canonical content                                 | Complete          | Home shares API-hydrated Dish/Chef records                               |
| 7.9        | Content, responsive, accessibility QA                              | Complete locally  | Unit/integration/browser keyboard and responsive assertions              |
| 7.10       | Final gate and staging proof                                       | Ready for staging | Local `pnpm check` and 12 Playwright scenarios pass                      |

## Sequencing rule

Implementation order is intentionally dependency-first:

```text
contracts/repository
        ↓
media pipeline
        ↓
Menu UI → Menu editor/data
        ↓
Story → Gallery
        ↓
publish/revalidation hardening
        ↓
Home canonical retrofit
        ↓
QA → staging gate
```

Fixtures are permitted only as development/test adapter inputs before checkpoint
7.4. They are not an acceptable production adapter and must not be imported
directly by page components.

## Checkpoint evidence

### 7.1 — completed 2026-10-02

- Canonical Menu, MenuCategory, Dish, ChefProfile, StoryPage, GalleryCategory,
  GalleryItem, and MediaAsset types live under `packages/types/src/content`.
- Matching Zod schemas and aggregate relation checks live under
  `packages/validation/src/content`.
- Public aggregate schemas reject draft/archived or inactive records before they
  cross the public repository boundary.
- Currency is an uppercase ISO-style code carried with a non-negative numeric
  amount; no restaurant currency is hard-coded as business truth.
- Informative media requires alt text, dimensions must match aspect ratio, and
  optional CMS text accepts `null` but normalizes it out of the canonical shape.
- `apps/web/src/lib/content` exposes repository interfaces instead of a database
  or CMS SDK.
- Targeted types, validation, and web lint/typecheck passed; validation tests:
  7 passed.

### 7.2–7.9 — completed locally 2026-10-03

- Shared `ResponsiveImage` and `EditorialMedia` components provide dimensions,
  `sizes`, AVIF/WebP negotiation, focal positioning, eager/preload controls, and
  lazy loading by default.
- `/menu`, `/our-story`, and `/gallery` render on the server through the typed
  HTTP content repository. Category navigation, explicit display ordering,
  optional Story sections, unavailable/seasonal dish states, and reservation
  paths are implemented.
- PostgreSQL stores validated draft and published revisions. Authenticated admin
  endpoints and the minimal editor support save, publish, and archive; archived
  documents are excluded from public reads.
- Menu, Story, and Gallery integration tests perform real editor-style changes,
  prove draft privacy, publish without an application rebuild, and verify the
  changed public response. The Menu lifecycle also proves archived content is
  no longer public.
- Publish/archive writes create an outbox row in the same transaction. Delivery
  uses an HMAC-signed request to the web revalidation endpoint, retries pending
  events every 30 seconds, and retains a five-minute cache safety TTL.
- Home resolves featured dishes from the primary canonical Menu and resolves its
  Chef through the same canonical ChefProfile used by Story.
- Playwright covers all three routes, canonical Home reuse, image dimensions and
  lazy loading, menu anchors, keyboard navigation, and protected editor access.

### 7.10 — local gate passed 2026-10-03

- `pnpm check`: passed (format, lint, typecheck, unit tests, production builds,
  migrations/seeding, and integration tests).
- `pnpm test:e2e`: 12 passed.
- Web and admin E2E builds use isolated `.next-e2e` directories and ports, so
  the test gate does not interrupt an existing development server.
- Phase 7 is intentionally not marked `CLOSED` until the same editor publish and
  signed revalidation flow is exercised against deployed staging services with
  staging identity, database, object-storage/CDN, and secrets configured.

## Global close conditions

Phase 7 remains open until all of the following are demonstrated in staging:

- an authorized editor can change and publish in-scope dynamic content;
- routine Menu changes require neither a source edit nor an application rebuild;
- public reads never expose draft or archived revisions;
- Gallery media is responsive, lazy below the fold, and does not cause serious
  layout shift;
- Home, Menu, and Story reuse canonical Dish and Chef records;
- cache invalidation reaches every affected route;
- quality, integration, end-to-end, responsive, and accessibility gates pass.

## Explicitly deferred

- reservation backend: Phase 8;
- reservation frontend: Phase 9;
- private dining workflow and operational Contact: Phase 10;
- full admin backoffice: Phase 11;
- full SEO/performance pass: Phase 12.
