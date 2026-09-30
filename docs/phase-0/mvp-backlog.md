# EMBER & OAK — PHASE 0 MVP BACKLOG

Status: **DRAFT / PRIORITIZED**

Priority:
- **P0** = launch blocker.
- **P1** = high value, có thể lùi nếu cần nhưng ảnh hưởng chất lượng/vận hành.
- **P2** = enhancement.

---

## EPIC A — Product / Brand Experience

| ID | Priority | Item | Acceptance summary |
|---|---|---|---|
| MVP-A01 | P0 | Global navigation | Các route release 1 truy cập được; Reserve CTA dễ thấy |
| MVP-A02 | P0 | Home | Hero, Philosophy, Signature Menu, Atmosphere, Chef, Experiences, Reservation CTA, Location |
| MVP-A03 | P0 | Responsive/mobile | Mobile layout riêng; sticky Reserve CTA |
| MVP-A04 | P1 | Motion system | Reveal/hover/transition không phá reduced-motion/performance |

---

## EPIC B — Content Pages

| ID | Priority | Item | Acceptance summary |
|---|---|---|---|
| MVP-B01 | P0 | Menu | Category + dishes + price + description + availability |
| MVP-B02 | P1 | Our Story | Storytelling layout đúng brand |
| MVP-B03 | P1 | Gallery | Masonry/asymmetric; responsive images |
| MVP-B04 | P1 | Private Dining | 3 experience types + Plan Your Event |
| MVP-B05 | P0 | Contact | Address, opening hours, phone, email, directions |

---

## EPIC C — Reservation

| ID | Priority | Item | Acceptance summary |
|---|---|---|---|
| MVP-C01 | P0 | Reservation search | Date + guests, validate input |
| MVP-C02 | P0 | Availability | Return valid slots theo business rules |
| MVP-C03 | P0 | Slot selection | User chọn slot khả dụng |
| MVP-C04 | P0 | Guest details | Name/email/phone/special request |
| MVP-C05 | P0 | Reservation creation | Server revalidate + transaction |
| MVP-C06 | P0 | Concurrency protection | Không double-book theo model đã chốt |
| MVP-C07 | P0 | Confirmation | ID/date/time/guests/contact/notes |
| MVP-C08 | P0 | Status model | Valid state transition only |
| MVP-C09 | P1 | Email confirmation | Email sau khi booking thành công |
| MVP-C10 | P1 | Special closure | Closed date/time không trả slot |
| MVP-C11 | P1 | Add to Calendar | Calendar event từ confirmation |

---

## EPIC D — Admin

| ID | Priority | Item | Acceptance summary |
|---|---|---|---|
| MVP-D01 | P0 | Admin auth | Protected routes/session/logout |
| MVP-D02 | P0 | Reservation list | Filter date/status |
| MVP-D03 | P0 | Reservation detail | Guest + booking + notes |
| MVP-D04 | P0 | Reservation status actions | Confirm/seat/complete/cancel/no-show theo state machine |
| MVP-D05 | P0 | Menu management | CRUD category/dish/price/availability |
| MVP-D06 | P0 | Basic content management | Banner/story/chef/gallery/hours/contact |
| MVP-D07 | P1 | Manual table assignment | Host gán table thủ công |
| MVP-D08 | P1 | Customer history | Xem reservation history |
| MVP-D09 | P1 | Private event leads | Enquiry list/detail/status |

---

## EPIC E — Production

| ID | Priority | Item | Acceptance summary |
|---|---|---|---|
| MVP-E01 | P0 | SEO metadata | Route metadata + canonical |
| MVP-E02 | P0 | Sitemap / robots | Crawl control đúng |
| MVP-E03 | P1 | Structured data | Restaurant/Menu/LocalBusiness khi dữ liệu hợp lệ |
| MVP-E04 | P0 | Image optimization | AVIF/WebP/responsive/lazy/preload critical |
| MVP-E05 | P0 | Font optimization | Không gây blocking/layout shift đáng kể |
| MVP-E06 | P0 | Accessibility baseline | Keyboard/forms/focus/alt/reduced motion |
| MVP-E07 | P0 | Error monitoring | Runtime/backend errors quan sát được |
| MVP-E08 | P0 | Security baseline | Auth, validation, secrets, authorization |
| MVP-E09 | P0 | Backup | Database backup/recovery plan |
| MVP-E10 | P1 | Analytics | Conversion events, không gửi PII |

---

# Launch blocker checklist

- [ ] Business rules P0 đã confirmed.
- [ ] Home hoạt động desktop/mobile.
- [ ] Menu production data hiển thị đúng.
- [ ] Reservation end-to-end hoạt động.
- [ ] Double-book protection được test.
- [ ] Admin reservation workflow hoạt động.
- [ ] Opening hours chính xác.
- [ ] Production contact data chính xác.
- [ ] Security review pass.
- [ ] Error monitoring hoạt động.
- [ ] UAT pass.
