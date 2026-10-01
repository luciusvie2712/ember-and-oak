# Application and Shared Package Scaffold

- `@ember-and-oak/web`: Next.js App Router, port 3000, foundation marker only.
- `@ember-and-oak/admin`: Next.js App Router, port 3001, unauthenticated foundation marker only.
- `@ember-and-oak/api`: NestJS, port 4000, `GET /api` returns `{ "name": "ember-and-oak-api", "status": "ok" }`.
- `@ember-and-oak/ui`: design tokens plus Button, Link, Container, Stack, VisuallyHidden, Field, and MediaFrame primitives.
- `@ember-and-oak/config`: runtime constants and strict TypeScript bases.
- `@ember-and-oak/types`: generic API success/error/status contracts only.
- `@ember-and-oak/validation`: generic Zod email, phone, and request-ID schemas.

There is intentionally no Home composition, menu, gallery, story, reservation engine, admin reservation workflow, CMS, or final domain type.
