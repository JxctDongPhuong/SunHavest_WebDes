# 🚀 DỰ ÁN WEBSITE GIÁO DỤC & NGHỀ NGHIỆP — CHUẨN KIẾN TRÚC JIT
## 👤 Không Gian Làm Việc Dành Riêng Cho: MiniThinh (Frontend Dev 1 / Dev UI & Data)

> **Thương hiệu phụ trách:** Brand B — **CareerPath** (Định hướng nghề nghiệp, CV & Phỏng vấn)  
> **Màu chủ đạo:** `#0f9d8a` (Teal ngọc bích) | **Font tiêu đề:** `Poppins`  
> **Git Branch:** `feature/brand-b-components`  
> **Ngày báo cáo trực tiếp:** 11/10

---

## 1. Cấu Trúc Thư Mục Chuẩn Kiến Trúc JIT (Just-In-Time)

Thư mục `minithinh-jit/` được xây dựng đúng 100% theo chuẩn quy định của cuộc thi và kế hoạch phân chia:

```text
minithinh-jit/
├── index.html                    <-- File HTML duy nhất, chỉ chứa <div id="app"></div>
├── README-MINITHINH.md           <-- File hướng dẫn và kịch bản thuyết trình này
├── css/
│   ├── base.css                  <-- Design Tokens (:root CSS variables), Reset, Typography
│   └── components.css            <-- Styling chung của tất cả Web Components (Cards, Features, Stats...)
├── data/
│   ├── brand-a.json              <-- Cấu hình CodeNest (IT)
│   ├── brand-b.json              <-- [CỦA BẠN] Cấu hình CareerPath (Đã đảo thứ tự JIT: Stats lên đầu)
│   └── brand-c.json              <-- Cấu hình SkillWorks (Dạy nghề)
└── js/
    ├── core.js                   <-- JIT Core Engine: Nạp JSON -> Bơm Tokens -> Dựng createElement('wl-*')
    ├── app.js                    <-- Smooth scrolling & tương tác bổ trợ
    ├── customizer.js             <-- [CỦA BẠN] Live Customizer Panel (Đổi màu, font, đảo thứ tự section)
    └── components/
        ├── wl-cards.js           <-- [CỦA BẠN] Web Component: Thẻ khóa học / Dịch vụ
        ├── wl-features.js        <-- [CỦA BẠN] Web Component: Lợi thế vượt trội (So le ảnh - chữ)
        ├── wl-stats.js           <-- [CỦA BẠN] Web Component: Các con số thống kê uy tín
        ├── wl-header.js          <-- Navigation header & mobile menu drawer
        ├── wl-hero.js            <-- Banner mở đầu & floating stat pills
        ├── wl-steps.js           <-- Lộ trình các bước
        ├── wl-testimonials.js    <-- Đánh giá học viên
        ├── wl-faq.js             <-- Accordion hỏi đáp thường gặp
        ├── wl-contact.js         <-- Form đăng ký tư vấn & validation
        ├── wl-footer.js          <-- Chân trang
        └── wl-sticky-cta.js      <-- Nút CTA nổi chân màn hình
```

---

## 2. Danh Sách File & Công Việc Của MiniThinh

### 💎 A. Cấu hình thương hiệu Brand B (`data/brand-b.json`)
- Đã thiết lập bộ **Design Tokens**:
  - `colorPrimary`: `#0f9d8a` (Teal)
  - `colorPrimaryHover`: `#0d8776`
  - `colorBg`: `#f6fbfa` (Nền sáng ngọc thanh lịch)
  - `fontHeading`: `Poppins`
- **Khác biệt hóa bố cục JIT (`pages.home`):**
  - Khác với Brand A (để Khóa học lên trước), Brand B đưa **Thống kê (`stats`)** lên ngay sau Hero để làm nổi bật uy tín hướng nghiệp:
  - `Hero` ➔ `Stats` ➔ `Features` ➔ `Cards` ➔ `Testimonials` ➔ `Steps` ➔ `FAQ` ➔ `Contact`.

---

### 💎 B. 3 Web Components Chuẩn JIT (`js/components/`)
Tất cả 3 file đều tuân thủ nghiêm ngặt chuẩn Web Components:

#### 1. `js/components/wl-stats.js`
- **Mục đích:** Hiển thị 4 con số biết nói của CareerPath (*12.000+ Học viên*, *95% Vượt lọc ATS*, *150+ Đối tác*, *4.9/5 Hài lòng*).
- **Chuẩn JIT:** Kế thừa `HTMLElement`, nhận `config` và `data` qua getters/setters, tự render vào Light DOM, dùng class `.stats-grid`, `.stat-item`.

#### 2. `js/components/wl-features.js`
- **Mục đích:** Hiển thị 3 lợi thế vượt trội dạng so le (alternating reverse) kèm ảnh minh họa và các gạch đầu dòng tính năng (`highlights`).
- **Chuẩn JIT:** Nhận mảng dữ liệu `features`, tự động đánh số thứ tự `01`, `02`, `03`, dùng class `.features-list`, `.feature-item`.

#### 3. `js/components/wl-cards.js`
- **Mục đích:** Lưới thẻ responsive giới thiệu 4 gói dịch vụ cốt lõi (Sửa CV ATS, Mock Interview, Khai phóng tiềm năng, Cố vấn Senior).
- **Chuẩn JIT:** Render huy hiệu (`badge`), thời lượng, cấp độ, giá tiền và nút đăng ký. Đảm bảo fallback an toàn khi thiếu trường dữ liệu.

---

### 💎 C. Module Live Customizer (`js/customizer.js`)
- Bảng điều khiển drawer bên phải cho phép Ban Giám Khảo:
  - **Live Color Picker:** Chọn đổi màu chính `--color-primary` và màu nền trang theo thời gian thực.
  - **Google Font Switcher:** Đổi phông chữ tiêu đề (`Poppins`, `Space Grotesk`, `Plus Jakarta Sans`, `Inter`, `Montserrat`).
  - **JIT DOM Section Reordering:** Bấm nút **▲ / ▼** để tráo đổi thứ tự bất kỳ section nào ngay trên DOM mà không cần reload trang.
  - **Export JSON:** Xuất file cấu hình đã tùy chỉnh về máy tính.

---

## 3. Cách Khởi Chạy Và Kiểm Thử Dự Án

Do kiến trúc JIT sử dụng dynamic `fetch('data/brand-b.json')` và dynamic `import('./components/wl-*.js')`, bạn cần chạy qua một local server:

### Cách 1: Sử dụng VS Code Extension (Đề xuất)
1. Cài extension **Live Server** trong VS Code.
2. Mở file `minithinh-jit/index.html`.
3. Bấm nút **"Go Live"** ở góc dưới bên phải màn hình (hoặc bấm chuột phải chọn **Open with Live Server**).

### Cách 2: Sử dụng dòng lệnh Node.js
```bash
cd minithinh-jit
npx serve
```
Mở trình duyệt tại: `http://localhost:3000` (mặc định nạp Brand B).

### Cách 3: Kiểm thử JIT chuyển đổi giữa các thương hiệu
- Xem Brand B (CareerPath): `http://localhost:3000/index.html?brand=brand-b`
- Xem Brand A (CodeNest): `http://localhost:3000/index.html?brand=brand-a`
- Xem Brand C (SkillWorks): `http://localhost:3000/index.html?brand=brand-c`

---

## 4. 🎤 Kịch Bản Thuyết Trình 3 Phút (Ngày 11/10)

Khi đến lượt bạn phát biểu trước Hội đồng Giám khảo:

### ⏱️ Phút thứ 1: Giới thiệu thương hiệu CareerPath (Brand B)
> *"Kính thưa Ban giám khảo, em là MiniThinh, phụ trách thương hiệu **CareerPath** - Nền tảng định hướng nghề nghiệp và huấn luyện kỹ năng việc làm.  
> Để tạo cảm giác tin cậy, chuyên nghiệp cho người trẻ, em lựa chọn tông màu chủ đạo Teal `#0f9d8a` kết hợp font chữ `Poppins`. Trong file `brand-b.json`, em sắp xếp đưa khối **Thống kê kết quả** lên ngay sau Hero để tạo ấn tượng về uy tín ngay khi người dùng vừa cuộn trang."*

### ⏱️ Phút thứ 2: Trình bày kiến trúc 3 Web Components
> *"Em phụ trách xây dựng 3 Web Components dữ liệu: `<wl-stats>`, `<wl-features>` và `<wl-cards>`.  
> Cả 3 component đều được viết bằng JavaScript thuần theo chuẩn Web Components API: Có getter/setter cho `config` và `data`, tự render khi nhận dữ liệu, và tuyệt đối không dùng màu inline cố định mà sử dụng 100% Design Tokens `var(--color-primary)`. Nhờ đó, khi hệ thống đổi sang Brand A hay Brand C, 3 component này tự động khoác lên bộ màu mới mà không cần sửa một dòng code nào."*

### ⏱️ Phút thứ 3: Biểu diễn Live Customizer (JIT Live Demo)
> *(Thao tác thực tế trên màn hình chiếu)*  
> *"Đặc biệt, em phát triển module **JIT Live Customizer**.  
> Em xin phép bấm đổi mã màu chính từ Teal sang Xanh tím, đổi font sang Space Grotesk — toàn bộ trang web cập nhật tức thì.  
> Tiếp theo, tại bảng bố cục Section, em bấm nút **▼** để đẩy phần Khóa học xuống dưới phần Lợi thế — DOM tự động hoán đổi vị trí mà không hề reload lại trang. Đây chính là minh chứng rõ ràng nhất cho sức mạnh của kiến trúc **Just-In-Time Rendering** mà nhóm chúng em hướng tới."*
