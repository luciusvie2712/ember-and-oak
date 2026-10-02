# Phase 7 Content Architecture Decision

Status: **LOCKED FOR PHASE 7 IMPLEMENTATION**  
Decision: **DEC-0025**  
Date: **2026-10-02**

## Context

Phase 7 must deliver editor-managed Menu, Our Story, and Gallery content without
requiring an application code change or deployment for routine updates. The
Phase 2 CMS schema is a contract, not a vendor selection. The repository already
locks Next.js applications, a NestJS API, and PostgreSQL as its technical
foundation.

The implementation must also preserve these boundaries:

- public React components do not query PostgreSQL or a CMS SDK;
- shared contracts do not expose persistence rows;
- draft and archived content never enters the public read model;
- media metadata is canonical and reusable;
- a publish action has an explicit cache invalidation path;
- DEC-0008 remains unresolved, so currency is validated and formatted from data
  and configuration rather than hard-coded as restaurant truth.

## Decision

Phase 7 will implement a first-party, headless content service on the existing
platform instead of selecting an external CMS framework.

```text
Public browser / crawler
        ↓ server-rendered route
apps/web content repository
        ↓ HTTP public content API
apps/api content service
        ↓ published revision only
PostgreSQL

Editor
        ↓
apps/admin minimal Phase 7 content editor
        ↓ HTTP admin content API
draft revision → validate → publish
        ↓
publish event / outbox → cache revalidation
```

This is an implementation decision, not a claim that the Phase 2 source selected
a CMS vendor.

## Gate 7.0 answers

### Persistence

- PostgreSQL is the source of truth for canonical content entities, relations,
  ordering, lifecycle state, media metadata, and revision pointers.
- Routine edits create draft revisions. Publishing atomically advances the
  entity's `publishedRevisionId`; the previous published revision remains public
  until the new draft has passed validation and is published.
- Public queries read only the published revision of active entities. A row being
  edited does not accidentally expose a draft or make the current published
  version disappear.
- Hard deletion is not part of the normal editor workflow. Referenced content is
  archived, and referential-integrity checks prevent unsafe archive/delete
  operations.

### Public read path

- `apps/web` server routes call typed modules under `src/lib/content`.
- Those modules implement a repository interface and call versioned public HTTP
  endpoints exposed by `apps/api`.
- The API maps persistence records to canonical contracts, validates the response
  at the boundary, and never returns `DRAFT` or `ARCHIVED` revisions from public
  endpoints.
- Menu, Story, Gallery, and the retrofitted Home remain server-rendered and
  indexable. Client components may enhance navigation but are not the content
  source.

The initial public endpoint family is:

```text
GET /api/v1/content/menu/:slug
GET /api/v1/content/story/:slug
GET /api/v1/content/gallery
GET /api/v1/content/home/:slug
```

### Editor update path

- `apps/admin` receives only the minimal Phase 7 screens needed to edit Menu,
  Story, Chef, Gallery, and Media records and to publish validated drafts.
- It calls versioned admin endpoints in `apps/api`; it never accesses PostgreSQL
  directly.
- Admin authorization is required before staging accepts editor writes. The
  staging identity/access mechanism must be wired before checkpoint 7.4 is
  considered complete. Public or anonymous write endpoints are prohibited.
- Full reservation operations, generalized role management, audit UI, and the
  broader backoffice remain Phase 11 scope.

### Draft and publish

```text
create/update draft revision
        ↓
canonical Zod validation + relation guardrails
        ↓
transaction: promote revision + record publish event
        ↓
public API serves new published revision
        ↓
revalidation worker delivers affected tags/paths
```

- Lifecycle values are `DRAFT`, `PUBLISHED`, and `ARCHIVED`.
- `publishState`, `isAvailable`, `seasonalStatus`, and category `isActive` remain
  separate concepts.
- A failed validation or relation guardrail leaves the current published revision
  unchanged.
- Publish events use an outbox/retry path so a temporary web revalidation failure
  does not lose the invalidation request.

### Media storage and delivery

- `MediaAsset` metadata and references live in PostgreSQL.
- Original binaries live in S3-compatible object storage. Local development may
  use a compatible local service; staging/production select credentials and
  endpoints through environment configuration.
- Public asset URLs use a configured CDN/image-delivery origin. The storage
  bucket is not treated as the presentation URL.
- Upload processing records MIME type, byte size, width, height, aspect ratio,
  focal point, rights/source data, and alt/decorative intent before an asset may
  be published.
- Responsive derivatives are delivered through the image service/CDN. UI uses
  one shared media boundary with explicit dimensions, `sizes`, loading priority,
  and focal positioning.

This keeps the data model and application code vendor-neutral while still making
the operational storage/delivery contract explicit.

### Cache and revalidation

- Public repository reads use bounded caching and entity-aware cache tags; no
  public content read uses an infinite cache without invalidation.
- `apps/api` records affected content keys in the same transaction as publish.
- A signed server-to-server revalidation request tells `apps/web` which tags and
  paths changed. Requests are idempotent and authenticated by environment-held
  secrets.
- Failed delivery is retried from the publish outbox. Time-based revalidation is
  a safety net, not the primary publish mechanism.

Initial invalidation map:

| Published entity                  | Content tags                                      | Public paths                  |
| --------------------------------- | ------------------------------------------------- | ----------------------------- |
| `Dish` / `MenuCategory` / `Menu`  | `menu`, relevant entity IDs; `home` when featured | `/menu`, `/` when featured    |
| `StoryPage`                       | `story` and story ID                              | `/our-story`                  |
| `ChefProfile`                     | `chef`, `story`, `home`                           | `/our-story`, `/`             |
| `GalleryItem` / `GalleryCategory` | `gallery` and relevant entity IDs                 | `/gallery`                    |
| `MediaAsset`                      | media ID plus tags for every referencing owner    | every referencing public path |

## Minimal Phase 7 editor versus Phase 11

Phase 7 deliberately advances only the content-management slice required by its
exit criteria:

- CRUD for in-scope canonical content;
- draft validation and publish/archive actions;
- media metadata/reference editing and publication guardrails (binary ingestion
  remains an environment-specific object-storage operation);
- enough authorization to prevent anonymous writes;
- publish status and actionable validation feedback.

Phase 11 still owns the full backoffice: generalized users/roles, reservation
operations, richer audit/history UX, bulk workflows, and other operational
modules.

## Alternatives considered

### External headless CMS now

Rejected for this checkpoint because no vendor is selected by source and no
external CMS dependency, deployment, authentication, or data adapter currently
exists. The repository boundary allows a future adapter without changing page
components.

### TypeScript/JSON fixtures as production persistence

Rejected because an editor update would require a source change and deployment,
which fails the Phase 7 exit criteria.

### Direct database or CMS SDK access from pages

Rejected because it couples rendering to persistence shape, duplicates filtering
rules, and makes draft safety and future migration harder to enforce.

### Wait for the full Phase 11 admin

Rejected because Phase 7 cannot close without a real editor update path. Only the
smallest necessary content-management capability is advanced.

## Consequences

- Checkpoint 7.1 must define canonical contracts and raw-to-canonical validation
  before API or UI work.
- API persistence schemas are implementation details and may not be imported by
  `apps/web` or `apps/admin`.
- A production/staging media provider and admin identity integration still need
  environment-specific values; their interfaces are fixed here, not their vendor
  credentials.
- DEC-0008 remains open. Allowed currencies are configuration, and every stored
  price carries an ISO currency code.
- Phase 7 cannot be marked closed until the publish-without-rebuild staging test
  passes for Menu, Story, and Gallery.

## Gate 7.0

- [x] Persistence selected.
- [x] Public read path selected.
- [x] Editor update path selected.
- [x] Draft/publish behavior selected.
- [x] Media storage and delivery contract selected.
- [x] Cache/revalidation behavior selected.
