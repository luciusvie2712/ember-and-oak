# EMBER & OAK — CMS SCHEMA DRAFT

Status: **PROPOSED**

This document defines what restaurant staff should be able to manage. It does not select a CMS vendor/framework.

---

# 1. CMS principles

1. Staff should not need developer access for normal content operations.
2. Reservation domain rules must not be editable as arbitrary content.
3. Reusable content should have one canonical source.
4. Public content should support draft/publish.
5. Operational data changes must be auditable where they affect bookings.
6. CMS must not expose secrets or infrastructure configuration.

---

# 2. Collections

## 2.1. Site Settings

### Editable

- Brand display name.
- Default SEO title.
- Default SEO description.
- Default social image.
- Primary location reference.
- Primary contact reference.

### Restricted / not CMS content

- Environment variables.
- API keys.
- Database config.
- Reservation concurrency behavior.

---

## 2.2. Home Page

### Fields

```text
Hero
- eyebrow?
- heading*
- description*
- primaryMedia*
- secondaryMedia?

Philosophy
- label*
- heading*
- body*
- media?

Featured Dishes
- dish references[]
- display order

Atmosphere
- heading*
- body?
- media*

Reservation CTA
- heading*
- body?
```

### Validation

- Hero heading required.
- Primary hero media required.
- Featured dishes must reference published dishes.
- Maximum featured dish count should be defined in design phase.

---

## 2.3. Menus

### Menu

- Name.
- Slug.
- Description.
- Season label.
- Validity dates optional.
- Primary flag.
- Publish state.
- SEO.

### Category

- Menu.
- Name.
- Slug.
- Description.
- Order.
- Active state.

### Dish

- Category.
- Name.
- Slug.
- Description.
- Price amount.
- Currency.
- Image.
- Availability.
- Seasonal status.
- Featured flag.
- Order.
- Publish state.

### Guardrails

- Price amount cannot be negative.
- Currency must use configured allowed currency.
- A dish cannot appear publicly if its category/menu is not public.
- Reordering should not require editing every row manually if admin UI supports drag/drop later.

---

## 2.4. Chef Profile

- Name.
- Title.
- Short bio.
- Full bio.
- Philosophy.
- Quote.
- Portrait.
- Supporting media.
- Signature.
- Publish state.

---

## 2.5. Our Story

Editable sections:

- Intro.
- Origin.
- Founders.
- Philosophy.
- Sourcing.
- Sustainability.
- Restaurant Design.
- Chef reference.
- Section media.
- SEO.

### Guardrail

Content editor can hide optional sections but should not reorder critical narrative arbitrarily unless design supports reorder.

---

## 2.6. Gallery

### Category

- Name.
- Slug.
- Order.
- Active.

### Item

- Category.
- Media.
- Alt text.
- Caption.
- Order.
- Publish state.

### Guardrail

- Informative image requires alt text.
- Unpublished gallery item cannot appear in Home/Story through normal references.

---

## 2.7. Private Dining

### Page content

- Hero heading.
- Description.
- Hero media.
- Intro.
- Enquiry heading/body.
- SEO.

### Experience

- Name.
- Slug.
- Description.
- Capacity label.
- Optional numeric min/max.
- Media.
- Order.
- Publish state.

### Source-derived baseline

```text
Private Room: 12–20
Chef's Table: 6–8
Full Restaurant Buyout: up to 80
```

---

## 2.8. Restaurant Location

Editable:

- Display name.
- Address.
- City/region/country.
- Timezone.
- Coordinates.
- Directions URL.

### Permission recommendation

Operational editors may edit display/contact fields.

Timezone changes should require manager/admin permission because they affect reservation interpretation.

---

## 2.9. Opening Hours

Editable per location/day:

- Day.
- Open.
- Close.
- Closed.

### Validation

- Open < close for same-day service.
- Closed day must not require time.
- All times interpreted in restaurant-local timezone.

---

## 2.10. Special Closures

Recommended MVP operational collection.

Fields:

- Date.
- Full day.
- Optional start/end.
- Reason.
- Public message.
- Publish/active state.

### Important

A closure that affects availability must be consumed by reservation domain; CMS edit alone is not enough unless integration exists.

---

## 2.11. Contact Information

- Public email.
- Public phone.
- Instagram URL.
- Facebook URL.

Must be canonical and reused across Header/Footer/Contact/confirmation content.

---

## 2.12. Policies

Collections/types:

- Dress Code.
- Reservation Policy.
- Cancellation Policy.
- Privacy.
- Terms.

### Rule

`OPEN` policies stay `DRAFT`.

---

# 3. Roles — conceptual

Final auth/authorization belongs later technical phase.

Recommended conceptual permissions:

## ADMIN

- Full content control.
- Operational content.
- Publish.
- Configuration-level content.

## MANAGER

- Menu.
- Opening hours.
- Special closure.
- Contact.
- Private dining content.
- Publish content.

## CONTENT_EDITOR

- Editorial pages.
- Gallery.
- Menu copy/media.
- Cannot change operational timezone or security settings.

Role design is **PROPOSED**, not Phase 0-confirmed.

---

# 4. Publish workflow

Recommended:

```text
DRAFT
  ↓
PUBLISHED
  ↓
ARCHIVED
```

Optional future:

```text
DRAFT
  ↓
REVIEW
  ↓
PUBLISHED
```

Review workflow is not required for MVP unless team size justifies it.

---

# 5. Preview behavior

Recommended CMS capability:

- Preview Home.
- Preview Menu.
- Preview Story.
- Preview Gallery.
- Preview Private Dining.

Preview should not expose draft content to public crawlers.

---

# 6. Media validation

On upload/reference:

- Supported image mime.
- Known dimensions.
- File-size guardrail.
- Alt/caption fields.
- Focal point.
- Copyright/source fields where operationally needed.

---

# 7. Referential integrity

CMS should prevent or warn when:

- Deactivating category with active dishes.
- Archiving dish featured on Home.
- Deleting media still referenced.
- Archiving Chef used by Story.
- Removing location used by Site Settings.

---

# 8. Content audit fields

Recommended system fields:

```text
createdAt
createdBy
updatedAt
updatedBy
publishedAt?
publishedBy?
```

Actual implementation depends on CMS/platform.

---

# 9. Content cache invalidation boundary

CMS changes may require cache invalidation/revalidation.

Phase 2 requirement:

Every public collection should have a clear invalidation target.

Example:

```text
Dish update
→ Menu page
→ Home Signature Menu if featured
→ SEO/menu structured data if generated
```

---

# 10. CMS schema freeze criteria

Schema can move to implementation when:

- Field names accepted.
- Relations stable.
- Required/optional states accepted.
- Operational fields separated from transactional reservation data.
- Phase 0 business decisions no longer require destructive schema redesign.
