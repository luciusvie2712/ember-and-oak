# EMBER & OAK — EPIC MAP

Status: **DRAFT**

## EPIC-01 — Brand Experience

### Objective
Tạo trải nghiệm fine-dining cao cấp, editorial, nhất quán trên toàn public website.

### Scope
- Global visual shell.
- Typography hierarchy.
- Editorial section composition.
- Photography treatment.
- Motion foundation.
- Cross-page brand consistency.

### Success condition
Public website không có cảm giác SaaS/card-template và giữ đúng Food + Story + Experience.

### Primary dependencies
- Phase 3 UX.
- Phase 4 design system.
- Phase 5 frontend foundation.

---

## EPIC-02 — Navigation & Global Shell

### Objective
Cho phép người dùng di chuyển giữa các route chính và luôn truy cập được reservation CTA.

### Scope
- Header.
- Desktop navigation.
- Mobile navigation.
- Sticky behavior.
- Footer.
- Global Reserve CTA.

### Dependencies
- EPIC-01.
- Route freeze từ Phase 0.

---

## EPIC-03 — Home

### Objective
Biến Home thành brand surface và conversion surface chính.

### Scope
- Hero.
- Philosophy.
- Signature Menu preview.
- Atmosphere.
- Chef Story.
- Dining Experiences.
- Reservation CTA.
- Location summary.

### Dependencies
- EPIC-01.
- EPIC-02.
- EPIC-04 Menu data.
- EPIC-08 Reservation CTA target.

---

## EPIC-04 — Menu

### Objective
Hiển thị seasonal menu theo editorial presentation.

### Scope
- Menu categories.
- Dish list.
- Pricing.
- Description.
- Availability.
- Seasonal state.
- Signature menu preview integration.

### Dependencies
- Content model Phase 2.
- Admin Menu EPIC-11.
- Image pipeline EPIC-14.

---

## EPIC-05 — Our Story

### Objective
Truyền tải brand origin, chef, sourcing và philosophy theo storytelling.

### Dependencies
- Content model.
- CMS/Admin Content.

---

## EPIC-06 — Gallery

### Objective
Tạo visual storytelling gallery bằng masonry/asymmetric layout.

### Dependencies
- Image pipeline.
- Admin Content.
- Asset inventory.

---

## EPIC-07 — Private Dining

### Objective
Chuyển nhu cầu event/private dining thành enquiry có thể vận hành.

### Scope
- Private Room.
- Chef's Table.
- Full Buyout.
- Enquiry form.
- Submission workflow.

### Dependencies
- Business rules.
- Backend form persistence/delivery.
- Admin private-event workflow nếu trong MVP.

---

## EPIC-08 — Reservations

### Objective
Cho phép guest đặt bàn end-to-end an toàn và giảm friction.

### Scope
- Reservation search.
- Availability.
- Slot selection.
- Guest form.
- Reservation creation.
- Server-side revalidation.
- Confirmation.
- State machine integration.
- Concurrency protection.

### Dependencies
- Phase 0 reservation decisions.
- Phase 2 data model.
- EPIC-10 backend/domain.
- EPIC-12 admin operations.

---

## EPIC-09 — Contact & Location

### Objective
Cho người dùng truy cập nhanh location, opening hours, contact và directions.

### Dependencies
- Production contact data confirmation.
- CMS/Admin Content.

---

## EPIC-10 — Reservation Domain & Backend

### Objective
Cung cấp reservation domain model, availability engine và API có tính nhất quán.

### Scope
- Reservation entity.
- Customer entity.
- Opening hours.
- Special closure.
- Table/capacity model.
- Availability service.
- Transactions/idempotency.
- Reservation API.

### Dependencies
- DEC-0011/12/13/14/19.
- Phase 5 technical foundation.

---

## EPIC-11 — Admin Menu & Content

### Objective
Cho staff thay đổi menu/content vận hành mà không cần deploy code.

### Scope
- Menu CRUD.
- Dish availability.
- Seasonal state.
- Home banner.
- Restaurant story.
- Chef profile.
- Gallery.
- Opening hours.
- Contact info.

### Dependencies
- Phase 2 content model.
- Admin authentication.

---

## EPIC-12 — Admin Reservations

### Objective
Cho host/manager xử lý reservation hàng ngày.

### Scope
- Auth.
- Reservation list.
- Filters.
- Reservation detail.
- State transitions.
- Cancellation.
- Optional manual table assignment.

### Dependencies
- EPIC-10.
- Business rules.
- Admin auth/security.

---

## EPIC-13 — SEO

### Objective
Đảm bảo public pages crawlable, indexable và có metadata/structured data phù hợp.

### Dependencies
- Route/content stable.
- Production contact/location data.

---

## EPIC-14 — Performance & Media

### Objective
Giữ trải nghiệm editorial giàu hình ảnh nhưng vẫn performant.

### Scope
- AVIF/WebP.
- Responsive images.
- Lazy loading.
- Hero preload.
- CDN strategy.
- Font optimization.
- Code splitting.

---

## EPIC-15 — Accessibility

### Objective
Đảm bảo core journey dùng được bằng keyboard/screen reader và motion không gây cản trở.

### Scope
- Semantic structure.
- Form labels/errors.
- Focus states.
- Reduced motion.
- Alt text.
- Touch target.
- Keyboard reservation flow.

---

## EPIC-16 — Observability & Operations

### Objective
Cho team phát hiện và xử lý sự cố production.

### Scope
- Logging.
- Error tracking.
- Health checks.
- Reservation failure monitoring.
- Backup.
- Operational runbook.

---

# Epic dependency overview

```text
EPIC-01 Brand
   ├── EPIC-02 Navigation
   ├── EPIC-03 Home
   ├── EPIC-05 Story
   └── EPIC-06 Gallery

EPIC-10 Reservation Backend
   ├── EPIC-08 Reservations
   └── EPIC-12 Admin Reservations

EPIC-11 Admin Menu/Content
   ├── EPIC-04 Menu
   ├── EPIC-05 Story
   ├── EPIC-06 Gallery
   └── EPIC-09 Contact

EPIC-14 Performance
EPIC-15 Accessibility
EPIC-16 Observability
   └── cross-cutting across public/admin/reservation
```
