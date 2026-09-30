# EMBER & OAK — MODERN FINE DINING RESTAURANT WEBSITE

## 1. Tổng quan dự án

**Ember & Oak** là website dành cho một nhà hàng fine dining hiện đại, tập trung vào trải nghiệm ẩm thực cao cấp, thực đơn theo mùa, nguyên liệu tuyển chọn và kỹ thuật chế biến bằng lửa.

Website không chỉ đóng vai trò giới thiệu thương hiệu mà còn là kênh chuyển đổi chính để khách hàng:

- Khám phá nhà hàng.
- Xem thực đơn.
- Tìm hiểu món ăn nổi bật.
- Xem thông tin đầu bếp và triết lý ẩm thực.
- Đặt bàn trực tuyến.
- Tìm hiểu dịch vụ private dining.
- Xem địa chỉ, giờ mở cửa và thông tin liên hệ.

Thiết kế theo phong cách **Modern Fine Dining + Editorial**, ưu tiên hình ảnh lớn, typography mạnh, layout bất đối xứng và trải nghiệm thị giác cao cấp.

---

## 2. Định vị thương hiệu

### Tên thương hiệu

**EMBER & OAK**

Ý nghĩa:

- **Ember**: than hồng, lửa, kỹ thuật nướng và open-fire cooking.
- **Oak**: gỗ sồi, sự tinh tế, tự nhiên và cảm giác trưởng thành.

Tên thương hiệu phù hợp với một nhà hàng mang phong cách:

- Contemporary cuisine.
- Seasonal dining.
- Open-fire cooking.
- Fine dining hiện đại.
- Không gian ấm, tối và sang trọng.

---

## 3. Đối tượng khách hàng

### Khách hàng cá nhân

Những người muốn tìm nhà hàng cho:

- Dinner.
- Date night.
- Anniversary.
- Birthday.
- Fine dining experience.
- Business dinner.
- Family occasion.

### Khách hàng doanh nghiệp

Các công ty cần:

- Private dining.
- Business dinner.
- Client meeting.
- Corporate event.
- Small private event.

### Khách du lịch

Khách đang tìm kiếm:

- Nhà hàng nổi bật trong thành phố.
- Trải nghiệm ẩm thực địa phương cao cấp.
- Tasting menu.
- Wine pairing.

---

## 4. Mục tiêu chính của website

### 4.1. Xây dựng hình ảnh thương hiệu

Ngay khi truy cập, người dùng phải cảm nhận được:

- Cao cấp.
- Tinh tế.
- Ấm áp.
- Hiện đại.
- Chuyên nghiệp.

Không được tạo cảm giác giống website bán đồ ăn nhanh hoặc website đặt đồ ăn.

### 4.2. Giới thiệu trải nghiệm ẩm thực

Website không chỉ hiển thị món ăn mà phải kể được câu chuyện phía sau:

- Nguyên liệu.
- Kỹ thuật chế biến.
- Đầu bếp.
- Triết lý nhà hàng.
- Không gian.
- Trải nghiệm dining.

### 4.3. Thúc đẩy đặt bàn

**Reserve a Table** là CTA quan trọng nhất toàn bộ website.

CTA này phải xuất hiện tại:

- Header.
- Hero.
- Menu.
- Reservation section.
- Footer.

Người dùng luôn có thể đặt bàn mà không phải tìm kiếm quá lâu.

### 4.4. Cung cấp thông tin nhanh

Người dùng phải dễ dàng tìm thấy:

- Menu.
- Giá.
- Giờ mở cửa.
- Địa chỉ.
- Số điện thoại.
- Dress code.
- Chính sách đặt bàn.
- Private dining.

---

## 5. Định hướng thiết kế

### Style

**Modern Fine Dining / Editorial Restaurant**

Không sử dụng layout SaaS hoặc quá nhiều card UI.

Thiết kế ưu tiên:

- Large typography.
- Editorial composition.
- Full-width photography.
- Asymmetric layout.
- Negative space.
- Image overlapping.
- Smooth transition.

---

## 6. Color Palette

### Primary Background

Charcoal:

`#171512`

hoặc Espresso:

`#1B1714`

### Secondary Background

Warm Cream:

`#F1E9DB`

### Primary Text

Cream White:

`#F6F1E8`

### Secondary Text

Muted Beige:

`#B8AA98`

### Accent

Burnt Orange:

`#C66A3A`

hoặc Copper:

`#B8734A`

Accent chỉ nên được sử dụng cho:

- CTA.
- Hover.
- Divider.
- Label nhỏ.
- Active navigation.

Không sử dụng quá nhiều.

---

## 7. Typography

Website sử dụng kết hợp hai loại font.

### Display / Heading

Serif.

Ví dụ:

- Cormorant Garamond.
- Playfair Display.
- DM Serif Display.
- Libre Baskerville.

Sử dụng cho:

- Hero.
- Section heading.
- Quote.
- Menu title.

### UI / Body

Sans-serif.

Ví dụ:

- Inter.
- Manrope.
- Neue Haas Grotesk.
- DM Sans.

Sử dụng cho:

- Navigation.
- Button.
- Label.
- Paragraph.
- Metadata.

---

## 8. Cấu trúc website

```text
/
├── Home
├── Menu
├── Our Story
├── Private Dining
├── Gallery
├── Reservations
└── Contact
```

Trong đó **Home Page** là trang quan trọng nhất.

---

## 9. Home Page

### 9.1. Header

Header dạng minimal.

**Logo**

EMBER & OAK

**Navigation**

- Home
- Menu
- Our Story
- Private Dining
- Contact

**CTA**

**Reserve a Table**

Header ban đầu có thể transparent trên hero.

Khi scroll:

- Chuyển sang background tối.
- Sticky phía trên.
- Blur nhẹ.
- Border-bottom rất mờ.

---

## 10. Hero Section

Hero phải tạo ấn tượng mạnh ngay lập tức.

Layout bất đối xứng.

### Left side

Typography cực lớn:

> SEASONAL  
> DINING,  
> REFINED.

Description:

> Contemporary cuisine inspired by local ingredients and open-fire cooking.

CTA:

- View Menu
- Reserve a Table

### Right side

Một ảnh món signature dạng portrait.

Có thể thêm:

- Một ảnh nhỏ overlap.
- Year established.
- Location.
- Michelin / award badge nếu thương hiệu có.

Hero cao khoảng:

`90–100vh`

---

## 11. Philosophy Section

Giới thiệu triết lý nhà hàng.

Label:

**OUR PHILOSOPHY**

Heading:

> Simple ingredients.  
> Unexpected experiences.

Nội dung tập trung vào:

- Seasonal ingredients.
- Local farmers.
- Sustainable sourcing.
- Open-fire cooking.
- Minimal intervention.

Bên cạnh là ảnh:

- Chef.
- Kitchen.
- Ingredient.
- Fire cooking.

---

## 12. Signature Menu

Đây là phần nổi bật thứ hai sau Hero.

Không sử dụng card grid.

Hiển thị dạng editorial list.

```text
01

CHARRED OCTOPUS                         $28

smoked potato · chili · preserved lemon
```

```text
02

DUCK BREAST                            $34

beetroot · blackberry · fermented jus
```

```text
03

BLACK COD                              $38

miso · leek · sesame
```

Khi hover vào từng món:

- Hình ảnh món ăn thay đổi.
- Number highlight.
- Text dịch nhẹ.
- Image transition.

CTA cuối section:

**Explore Full Menu**

---

## 13. Restaurant Atmosphere

Section sử dụng ảnh hoặc video full-width.

Nội dung overlay:

> More than dinner.  
> An evening to remember.

Section này tập trung bán **trải nghiệm**, không bán món ăn.

Hình ảnh có thể là:

- Không gian bàn ăn.
- Ánh sáng buổi tối.
- Open kitchen.
- Chef plating.
- Wine service.

---

## 14. Chef Story

Giới thiệu Executive Chef.

Layout:

```text
IMAGE                       STORY
IMAGE                       STORY
IMAGE                       QUOTE
```

Nội dung:

- Tên chef.
- Background.
- Philosophy.
- Experience.
- Inspiration.

Quote:

> “Cooking begins with respect for the ingredient.”

Có thể thêm signature của chef phía dưới.

---

## 15. Dining Experiences

### Chef's Tasting Menu

Menu nhiều course do chef thiết kế.

Ví dụ:

**7 Courses — $120**

### Wine Pairing

Wine được lựa chọn phù hợp với từng course.

Ví dụ:

**Wine Pairing — $65**

### Private Dining

Không gian riêng dành cho:

- Birthday.
- Anniversary.
- Business dinner.
- Private event.

Thay vì sử dụng card nhỏ, mỗi experience nên có ảnh lớn dạng editorial.

---

## 16. Reservation Section

Đây là một trong những section quan trọng nhất.

Heading:

> RESERVE YOUR TABLE

Form đơn giản:

```text
DATE

TIME

GUESTS

[ FIND A TABLE ]
```

Sau khi chọn:

```text
Available Times

18:00
18:30
19:00
19:30
20:00
```

Người dùng chọn thời gian và tiếp tục nhập:

- Name.
- Email.
- Phone.
- Special request.

---

## 17. Reservation Confirmation

Sau khi đặt bàn thành công:

```text
Your table is reserved.

Friday, October 16
7:30 PM
2 Guests
```

Thông tin bao gồm:

- Reservation ID.
- Date.
- Time.
- Guest count.
- Contact.
- Notes.

CTA:

- Add to Calendar.
- Manage Reservation.

---

## 18. Gallery

Gallery tập trung vào storytelling.

Nội dung:

- Food.
- Chef.
- Ingredients.
- Kitchen.
- Dining room.
- Wine.
- Guests.

Layout có thể sử dụng masonry hoặc asymmetric grid.

Không nên dùng carousel đơn giản.

---

## 19. Private Dining

Trang riêng dành cho sự kiện riêng.

### Private Room

Sức chứa:

```text
12–20 guests
```

### Chef's Table

```text
6–8 guests
```

### Full Restaurant Buyout

```text
Up to 80 guests
```

CTA:

**Plan Your Event**

Form yêu cầu:

- Name.
- Email.
- Phone.
- Event date.
- Guests.
- Event type.
- Budget.
- Message.

---

## 20. Our Story

Trang này kể câu chuyện thương hiệu.

Nội dung:

- Origin.
- Founders.
- Chef.
- Philosophy.
- Ingredient sourcing.
- Sustainability.
- Restaurant design.

Không nên viết dạng corporate company profile.

Nên xây dựng theo storytelling.

---

## 21. Contact & Location

Section chia hai cột.

### Location

```text
EMBER & OAK

128 Mercer Street
Downtown
```

CTA:

**Get Directions**

### Opening Hours

```text
TUESDAY — THURSDAY
17:30 — 22:30

FRIDAY — SATURDAY
17:30 — 23:30

SUNDAY
17:00 — 22:00

MONDAY
Closed
```

### Contact

```text
hello@emberandoak.com

+1 212 555 0188
```

---

## 22. Footer

Footer giữ phong cách editorial.

Typography lớn:

> COME HUNGRY.  
> LEAVE INSPIRED.

Các nhóm thông tin:

- Our Story
- Menu
- Private Dining
- Reservations
- Contact
- Instagram
- Facebook
- Address
- Phone
- Email

Cuối cùng:

```text
© 2026 Ember & Oak
Privacy
Terms
```

---

## 23. Micro Interaction

### Scroll Reveal

Các section xuất hiện bằng:

- Fade.
- Translate Y.
- Clip-path reveal.

### Image Reveal

Image xuất hiện bằng mask hoặc clip animation.

### Menu Hover

Hover món:

- Đổi ảnh.
- Highlight number.
- Increase letter spacing nhẹ.

### Button

Button có:

- Background slide.
- Arrow transition.
- Underline animation.

### Navigation

Active link sử dụng:

- Small dot.
- Underline.
- Accent color.

---

## 24. Mobile Experience

Mobile không chỉ thu nhỏ desktop.

Hero:

```text
TITLE

DESCRIPTION

CTA

IMAGE
```

Menu món ăn:

```text
01
CHARRED OCTOPUS

description                 $28
```

Reservation form chuyển thành vertical layout.

Sticky button phía dưới màn hình:

**Reserve a Table**

---

## 25. Các chức năng chính

Website production có thể hỗ trợ:

- Online reservation.
- Reservation management.
- Menu management.
- Seasonal menu.
- Gallery management.
- Private dining enquiry.
- Contact form.
- Newsletter.
- Restaurant opening hours.
- Special closure.
- Event announcement.
- Multi-language.
- SEO.
- Analytics.

---

## 26. Backend quản trị

### Reservations

- Booking list.
- Calendar.
- Table assignment.
- Guest count.
- Status.
- Notes.

### Menu

- Category.
- Dish.
- Price.
- Description.
- Image.
- Availability.
- Seasonal status.

### Customers

- Customer history.
- Reservation history.
- Special requests.
- VIP tag.

### Private Events

- Leads.
- Event date.
- Guest count.
- Budget.
- Status.
- Internal note.

### Content

Admin có thể chỉnh:

- Home banner.
- Restaurant story.
- Chef profile.
- Gallery.
- Opening hours.
- Contact information.

---

## 27. Reservation Status

```text
PENDING
CONFIRMED
SEATED
COMPLETED
CANCELLED
NO_SHOW
```

Workflow:

```text
Customer Booking
        ↓
PENDING
        ↓
CONFIRMED
        ↓
SEATED
        ↓
COMPLETED
```

Hoặc:

```text
CONFIRMED
     ↓
CANCELLED
```

---

## 28. SEO

Website cần tối ưu các nhóm từ khóa như:

```text
fine dining restaurant
modern restaurant
tasting menu
chef tasting menu
private dining
restaurant reservation
```

Các trang Menu, Private Dining và Location cần có metadata riêng.

Structured data nên hỗ trợ:

```text
Restaurant
Menu
LocalBusiness
OpeningHours
PostalAddress
AggregateRating
```

---

## 29. Performance

Do website sử dụng nhiều hình ảnh nên cần:

- WebP / AVIF.
- Responsive image.
- Lazy loading.
- Image CDN.
- Preload hero image.
- Font optimization.
- Code splitting.

Không autoplay video dung lượng lớn trên mobile.

---

## 30. Trải nghiệm người dùng tổng thể

User Journey chính:

```text
Landing Page
        ↓
Discover Restaurant
        ↓
Explore Menu
        ↓
View Atmosphere / Chef
        ↓
Reserve Table
        ↓
Select Date / Time
        ↓
Enter Information
        ↓
Reservation Confirmation
```

Một user khác có thể đi theo:

```text
Google Search
        ↓
Menu
        ↓
View Dishes
        ↓
Reserve Table
```

Vì vậy CTA đặt bàn phải luôn dễ tiếp cận.

---

## 31. Điểm khác biệt của thiết kế

Website Ember & Oak không đi theo kiểu website nhà hàng thông thường:

```text
Hero
Cards
Menu Cards
Gallery
Footer
```

Mà sử dụng:

```text
Large Typography
+
Editorial Layout
+
Asymmetric Images
+
Interactive Menu
+
Storytelling
+
Immersive Photography
```

Điều này giúp template có cảm giác giống một thương hiệu nhà hàng thật thay vì một landing page template chung.

---

## 32. Tổng kết concept

**Ember & Oak** là một website nhà hàng fine dining hiện đại được xây dựng xoay quanh ba yếu tố:

### Food

Món ăn, nguyên liệu, menu và kỹ thuật chế biến.

### Story

Chef, triết lý và nguồn gốc thương hiệu.

### Experience

Không gian, dịch vụ và trải nghiệm dining.

Website phải khiến người dùng có cảm giác:

> “Tôi muốn trải nghiệm nhà hàng này.”

thay vì chỉ:

> “Tôi muốn xem họ bán món gì.”

Đó là mục tiêu quan trọng nhất của toàn bộ thiết kế Ember & Oak.
