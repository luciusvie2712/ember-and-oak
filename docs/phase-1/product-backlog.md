# EMBER & OAK — PRODUCT BACKLOG

Status: **DRAFT READY FOR REFINEMENT**

> Ticket IDs là stable identifiers cho Phase 1. Estimate để trống cho team refinement.

---

# EPIC-01 — Brand Experience

## EO-001 — Implement design token contract
**Priority:** P0  
**Status:** BLOCKED_BY_DESIGN  
**User story:** As an engineer, I want canonical design tokens so that visual rules are consistent across public/admin surfaces.

**Acceptance criteria**
- Typography, color, spacing, container, radius and motion tokens có single source.
- Không hard-code arbitrary visual values trong feature component khi token tồn tại.
- Token naming không phụ thuộc một page cụ thể.
- Public site có thể override theme-level values mà không sửa từng component.

**Dependencies:** Phase 4 design system.

---

## EO-002 — Implement editorial layout primitives
**Priority:** P0  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- Có primitives cho full-width media, asymmetric content, section container, editorial split.
- Không ép mọi content vào card component.
- Responsive behavior được định nghĩa cho mobile.

**Dependencies:** EO-001.

---

## EO-003 — Implement motion foundation
**Priority:** P1  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- Support reveal/translate/clip/image transitions.
- Tôn trọng `prefers-reduced-motion`.
- Không block interaction khi animation chạy.
- Có shared duration/easing tokens.

**Dependencies:** EO-001.

---

# EPIC-02 — Navigation & Global Shell

## EO-010 — Global app shell
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**User story:** As a visitor, I want consistent page structure so that navigation and brand experience remain stable.

**Acceptance criteria**
- Root layout render header, page content, footer.
- Route transitions không phá scroll/focus behavior.
- Global error boundary/fallback có chỗ tích hợp.

**Dependencies:** Phase 5.

---

## EO-011 — Desktop navigation
**Priority:** P0  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- Links: Home, Menu, Our Story, Private Dining, Contact.
- Reserve CTA visible.
- Active state accessible.
- Sticky behavior theo approved UX.

**Dependencies:** EO-010.

---

## EO-012 — Mobile navigation
**Priority:** P0  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- Mobile navigation mở/đóng bằng keyboard/touch.
- Focus management đúng.
- Body scroll lock không gây layout bug.
- Reserve CTA vẫn accessible.

**Dependencies:** EO-010.

---

## EO-013 — Sticky header transition
**Priority:** P1  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- Initial transparent state trên hero.
- Scroll state dùng dark background, light blur, subtle border.
- Không gây layout jump.

**Dependencies:** EO-011.

---

## EO-014 — Global footer
**Priority:** P0  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- Route links.
- Address/contact.
- Social placeholders chỉ publish khi có URL thật.
- Copyright/privacy/terms links theo release decision.

---

## EO-015 — Mobile sticky Reserve CTA
**Priority:** P0  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- Hiển thị trên mobile ở các public page phù hợp.
- Không che content/form controls.
- Safe-area aware.
- Link đến reservation flow.

---

# EPIC-03 — Home

## EO-020 — Home hero
**Priority:** P0  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- Large editorial heading.
- Description.
- `View Menu`.
- `Reserve a Table`.
- Portrait signature image.
- Desktop/mobile layout riêng.
- Critical hero asset preload strategy defined.

**Dependencies:** EO-001, EO-002.

---

## EO-021 — Philosophy section
**Priority:** P0  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- Editorial text/image composition.
- Supports source content on seasonal ingredients, sourcing, fire cooking.
- Responsive image treatment.

---

## EO-022 — Signature Menu preview
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Render featured dishes từ Menu data contract.
- Không dùng card grid.
- Dish row gồm index/name/description/price.
- Hover/focus có image transition trên devices phù hợp.
- Touch device không phụ thuộc hover.

**Dependencies:** EO-100/101 menu API/content.

---

## EO-023 — Atmosphere section
**Priority:** P1  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- Full-width media.
- Overlay content readable.
- Mobile không autoplay video nặng.
- Reduced-motion/fallback image supported.

---

## EO-024 — Chef Story section
**Priority:** P1  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Render chef profile from content model.
- Image/story/quote layout.
- Missing signature asset không phá layout.

---

## EO-025 — Dining Experiences section
**Priority:** P1  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- Tasting Menu.
- Wine Pairing.
- Private Dining.
- Editorial image treatment, không small-card grid.

---

## EO-026 — Home reservation CTA section
**Priority:** P0  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- CTA rõ.
- Route/query state dẫn vào reservation flow đúng.
- Keyboard accessible.

---

## EO-027 — Home location summary
**Priority:** P0  
**Status:** BLOCKED_BY_DECISION

**Acceptance criteria**
- Opening hours.
- Address.
- Contact summary.
- Link directions/contact.
- Data lấy từ operational content source.

**Dependencies:** DEC-0022.

---

# EPIC-04 — Menu

## EO-030 — Menu page shell
**Priority:** P0  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- Indexable page.
- Editorial category/dish presentation.
- Không client-only render toàn bộ menu nếu làm mất crawlability.

---

## EO-031 — Menu category navigation
**Priority:** P0  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- Navigate/focus category sections.
- URL/hash behavior không phá back/forward.
- Mobile usable.

---

## EO-032 — Dish list
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Name, description, price, availability.
- Seasonal/hidden state theo content rules.
- Currency format lấy từ configuration, không hard-code.

**Dependencies:** DEC-0008, Phase 2 schema.

---

## EO-033 — Dish media treatment
**Priority:** P1  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- Responsive image.
- Optimized loading.
- Alt text available.
- Crop/focal treatment stable.

---

# EPIC-05 — Our Story

## EO-040 — Story page composition
**Priority:** P1  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- Origin.
- Founders.
- Chef.
- Philosophy.
- Sourcing.
- Sustainability.
- Restaurant design.
- Storytelling flow, không corporate profile.

---

## EO-041 — Story CMS integration
**Priority:** P1  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Published content fetched from canonical content source.
- Missing optional section không gây broken layout.

---

# EPIC-06 — Gallery

## EO-050 — Gallery page
**Priority:** P1  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- Masonry/asymmetric grid.
- Food/Chef/Ingredients/Kitchen/Dining Room/Wine/Guests categories supported.
- Keyboard access nếu lightbox được dùng.

---

## EO-051 — Gallery loading strategy
**Priority:** P1  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Below-fold lazy loading.
- No major layout shift.
- Không ship toàn bộ high-resolution assets ban đầu.

---

# EPIC-07 — Private Dining

## EO-060 — Private Dining page
**Priority:** P1  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- Private Room 12–20.
- Chef's Table 6–8.
- Full Buyout up to 80.
- `Plan Your Event` CTA.

---

## EO-061 — Private Dining enquiry form
**Priority:** P1  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Fields: name/email/phone/date/guests/type/budget/message.
- Client + server validation.
- Success/error state.
- Duplicate submit protection.
- PII không gửi analytics.

---

## EO-062 — Persist/deliver private-event enquiry
**Priority:** P1  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Submission không bị mất khi email provider fail nếu persistence được chọn.
- Failure observable.
- Admin/relevant destination nhận được enquiry theo workflow được chốt.

---

# EPIC-08 — Reservation Frontend

## EO-070 — Reservation search form
**Priority:** P0  
**Status:** BLOCKED_BY_DECISION

**Acceptance criteria**
- Date + guests.
- Invalid/past date rejected.
- Guest range lấy từ config/business rules.
- Search submission accessible.

**Dependencies:** DEC-0012, DEC-0013, DEC-0014.

---

## EO-071 — Availability result states
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Loading.
- Available slots.
- Fully booked.
- Closed.
- Invalid request.
- Server error.

---

## EO-072 — Slot selection
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Single slot selectable.
- Keyboard accessible.
- Selected state clear.
- Stale slot conflict handled after submit.

---

## EO-073 — Guest details form
**Priority:** P0  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- Name/email/phone/special request.
- Field labels.
- Inline/server validation.
- Error summary or equivalent accessible behavior.

---

## EO-074 — Reservation submit
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Disable/restrict duplicate submit.
- Use idempotency mechanism where applicable.
- Server revalidates slot.
- Conflict returns recoverable UX.
- Confirmation only after success.

---

## EO-075 — Reservation confirmation page
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Reservation ID.
- Date.
- Time.
- Guest count.
- Contact.
- Notes.
- Correct timezone formatting.

**Dependencies:** DEC-0009.

---

## EO-076 — Add to Calendar
**Priority:** P1  
**Status:** BLOCKED_BY_DECISION

**Acceptance criteria**
- Calendar event uses correct timezone.
- Restaurant location/contact present when confirmed.
- No sensitive notes accidentally exported.

**Dependencies:** DEC-0009, DEC-0022.

---

## EO-077 — Reservation confirmation email
**Priority:** P1  
**Status:** BLOCKED_BY_DECISION

**Acceptance criteria**
- Send after successful reservation/confirmation event.
- Contains reservation code/date/time/guests/contact.
- Failure logged/observable.
- Email failure does not create duplicate reservation on retry.

**Dependencies:** DEC-0017.

---

# EPIC-09 — Contact & Location

## EO-080 — Contact page
**Priority:** P0  
**Status:** BLOCKED_BY_DECISION

**Acceptance criteria**
- Address.
- Opening hours.
- Phone.
- Email.
- Directions CTA.
- Contact data sourced centrally.

**Dependencies:** DEC-0022.

---

## EO-081 — Opening hours component
**Priority:** P0  
**Status:** READY

**Acceptance criteria**
- Uses data source, not duplicated hard-code per page.
- Closed day supported.
- Can reflect future special-closure feature without component rewrite.

---

## EO-082 — Dress code / reservation policy content
**Priority:** P1  
**Status:** BLOCKED_BY_DECISION

**Dependencies:** DEC-0020, cancellation policy.

---

# EPIC-10 — Reservation Domain & Backend

## EO-090 — Reservation domain model
**Priority:** P0  
**Status:** BLOCKED_BY_DECISION

**Acceptance criteria**
- Reservation code.
- Customer relation.
- Date/start time.
- Guest count.
- Status.
- Special request/internal note.
- Timestamps.
- Cancellation timestamp if applicable.

**Dependencies:** DEC-0009, DEC-0011, DEC-0019.

---

## EO-091 — Customer domain model
**Priority:** P0  
**Status:** READY

**Acceptance criteria**
- Name/email/phone.
- Supports reservation history relation.
- PII handling documented.

---

## EO-092 — Opening hours model
**Priority:** P0  
**Status:** READY

**Acceptance criteria**
- Day-of-week.
- Open/close.
- Closed state.
- Supports operational query by restaurant-local date.

---

## EO-093 — Special closure model
**Priority:** P1  
**Status:** READY

**Acceptance criteria**
- Date.
- Optional partial-day window.
- Reason/internal/public message fields can be represented as required by later UX.

---

## EO-094 — Table/capacity model
**Priority:** P0  
**Status:** BLOCKED_BY_DECISION

**Dependencies:** DEC-0019.

**Acceptance criteria**
- Model matches chosen availability strategy.
- Does not require migration redesign for normal table activation/deactivation.

---

## EO-095 — Availability engine
**Priority:** P0  
**Status:** BLOCKED_BY_DECISION

**Acceptance criteria**
- Considers opening hours.
- Special closure.
- Requested date.
- Guest count.
- Existing active reservations.
- Chosen capacity/table model.
- Booking window.
- Dining duration.
- Slot interval.
- Same-day cutoff.

**Dependencies:** DEC-0009, 0010, 0011, 0012, 0013, 0014, 0019.

---

## EO-096 — Reservation state machine
**Priority:** P0  
**Status:** READY

**Acceptance criteria**
- PENDING→CONFIRMED/CANCELLED.
- CONFIRMED→SEATED/CANCELLED/NO_SHOW.
- SEATED→COMPLETED.
- Invalid transition rejected centrally.

---

## EO-097 — Reservation creation transaction
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Revalidates availability inside mutation boundary.
- Atomic commit.
- No partial reservation on failure.
- Concurrency strategy testable.

---

## EO-098 — Idempotency / duplicate protection
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Repeated identical submission does not create unintended duplicates.
- Retry semantics documented.
- Idempotency data has bounded retention.

---

## EO-099 — Reservation API contract
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Availability query.
- Create reservation.
- Get reservation by authorized/public-safe locator if included.
- Errors use stable machine-readable codes.

---

# EPIC-11 — Admin Menu & Content

## EO-100 — Admin menu category CRUD
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Create/edit/reorder/activate category.
- Validation.
- Public menu only shows publishable/active state.

---

## EO-101 — Admin dish CRUD
**Priority:** P0  
**Status:** BLOCKED_BY_DECISION

**Acceptance criteria**
- Name/description/price/image/availability/seasonal/display order.
- Currency-aware price validation/display.
- Delete/archive behavior defined.

**Dependencies:** DEC-0008.

---

## EO-102 — Admin content: chef/story/home
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Home banner.
- Restaurant story.
- Chef profile.
- Safe publish/update workflow.

---

## EO-103 — Admin gallery
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Upload/reference image.
- Category.
- Alt text.
- Caption.
- Order.
- Publish state.

---

## EO-104 — Admin operational content
**Priority:** P0  
**Status:** BLOCKED_BY_DECISION

**Acceptance criteria**
- Opening hours.
- Contact.
- Address.
- Changes surface consistently public-side.

**Dependencies:** DEC-0022.

---

# EPIC-12 — Admin Reservations

## EO-110 — Admin authentication
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Login/session/logout.
- Protected routes.
- Secure cookie/session configuration.
- Failed auth observable without leaking credential data.

---

## EO-111 — Reservation list
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Filter by date/status.
- Shows guest, time, count, status.
- Pagination/query strategy handles operational volume.

---

## EO-112 — Reservation detail
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Guest/contact.
- Date/time.
- Count/status.
- Special request.
- Internal note.
- Reservation code/timestamps.

---

## EO-113 — Reservation status actions
**Priority:** P0  
**Status:** READY

**Acceptance criteria**
- UI only presents valid next actions.
- Server remains authority.
- Invalid/stale transition returns explicit error.

**Dependencies:** EO-096.

---

## EO-114 — Reservation cancellation
**Priority:** P0  
**Status:** BLOCKED_BY_DECISION

**Acceptance criteria**
- Admin can cancel allowed statuses.
- Audit fields/reason strategy defined.
- Availability released according to domain rule.

---

## EO-115 — Manual table assignment
**Priority:** P1  
**Status:** BLOCKED_BY_DECISION

**Dependencies:** DEC-0018, DEC-0019.

---

# EPIC-13 — SEO

## EO-120 — Route metadata
**Priority:** P0  
**Status:** READY

**Acceptance criteria**
- Unique title/description for public routes.
- Canonical defined.
- No accidental noindex on production routes.

---

## EO-121 — Sitemap and robots
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Public canonical URLs included appropriately.
- Admin/private routes excluded.
- Environment-safe indexing behavior.

---

## EO-122 — Restaurant structured data
**Priority:** P1  
**Status:** BLOCKED_BY_DECISION

**Acceptance criteria**
- Restaurant/LocalBusiness data matches visible content.
- OpeningHours/PostalAddress use production values.
- AggregateRating omitted unless valid rating data exists.

**Dependencies:** DEC-0022.

---

## EO-123 — Menu structured data
**Priority:** P1  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Reflects public menu.
- No hidden/unavailable dish falsely exposed as active offering if schema semantics conflict.

---

# EPIC-14 — Performance & Media

## EO-130 — Image delivery pipeline
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Responsive sizes.
- AVIF/WebP where supported.
- Explicit dimensions.
- CDN/storage integration.
- Fallback behavior.

---

## EO-131 — Hero critical asset strategy
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Correct hero image preload.
- No unnecessary preload variants.
- LCP asset identified.

---

## EO-132 — Lazy loading strategy
**Priority:** P0  
**Status:** READY

**Acceptance criteria**
- Below-fold images lazy.
- Above-fold critical media not accidentally lazy.
- Gallery does not eager-load all assets.

---

## EO-133 — Font optimization
**Priority:** P0  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- Font loading strategy documented.
- Prevent excessive variants.
- Fallback metrics/layout shift considered.

---

## EO-134 — Code splitting
**Priority:** P1  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Heavy non-critical admin/gallery/reservation enhancements not all in initial public bundle.

---

# EPIC-15 — Accessibility

## EO-140 — Global semantic/navigation accessibility
**Priority:** P0  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- Landmarks.
- Skip navigation.
- Visible focus.
- Correct heading hierarchy.

---

## EO-141 — Reservation form accessibility
**Priority:** P0  
**Status:** BLOCKED_BY_DESIGN

**Acceptance criteria**
- Labels tied to fields.
- Errors announced.
- Slot selection keyboard operable.
- Submission state announced appropriately.

---

## EO-142 — Reduced motion support
**Priority:** P0  
**Status:** READY

**Acceptance criteria**
- Decorative transitions disabled/reduced under preference.
- No information depends solely on animation.

---

## EO-143 — Media alt-text contract
**Priority:** P0  
**Status:** READY

**Acceptance criteria**
- CMS/content model requires meaningful alt where image is informative.
- Decorative images can be explicitly marked decorative.

---

# EPIC-16 — Observability & Operations

## EO-150 — Application error tracking
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Frontend/backend failures captured.
- PII scrubbed.
- Environment/release tagged.

---

## EO-151 — Structured application logging
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Reservation mutation has correlation/request ID.
- No raw secrets.
- Sensitive guest fields redacted according to policy.

---

## EO-152 — Reservation failure monitoring
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Ability to distinguish validation/conflict/internal failure.
- Operational alerts can be configured without parsing arbitrary strings.

---

## EO-153 — Database backup and recovery runbook
**Priority:** P0  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Backup schedule defined.
- Restore procedure documented.
- Restore verification process defined.

---

## EO-154 — Health/readiness checks
**Priority:** P1  
**Status:** BLOCKED_BY_TECH

**Acceptance criteria**
- Service health can be checked.
- Dependency failures do not expose secrets/details publicly.

---

# Deferred tickets

Các item sau không vào active MVP backlog nếu chưa được re-prioritize:

- Guest self-service reservation management.
- Advanced customer history.
- VIP workflow.
- Admin calendar.
- Automated table assignment.
- Newsletter.
- Multi-language expansion.
- Advanced CRM.
- Deposit/payment.
- POS integration.
- Multi-location.
- Loyalty/gift cards.
