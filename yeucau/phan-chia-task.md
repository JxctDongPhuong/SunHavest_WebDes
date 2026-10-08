# KẾ HOẠCH PHÂN CHIA NHIỆM VỤ NHÓM (3 THÀNH VIÊN)
## Dự Án Website Giáo Dục & Nghề Nghiệp (Kiến Trúc JIT Web Components)
**Thời gian chuẩn bị:** 05/10 – 10/10 | **Chấm trực tiếp:** 11/10

---

## 1. NGUYÊN TẮC PHÂN CHIA & ĐỘC LẬP
Để tránh xung đột code (conflict Git) và tối ưu thế mạnh của từng người:
1. **Mỗi người phụ trách 1 File Cấu hình Thương hiệu (Brand Config JSON):** Toàn quyền quyết định màu sắc, font chữ, câu chuyện thương hiệu và bố cục các section.
2. **Chia đều thư viện 11 Web Components:** Mỗi người làm một nhóm component độc lập, tuân thủ đúng chuẩn template chung.
3. **Mỗi người 1 Git Branch riêng biệt:** Chỉ merge vào `main` sau khi đã kiểm tra component chạy tốt trên cả 3 brand.

---

## 2. BẢNG PHÂN CHIA NHIỆM VỤ CHI TIẾT

| Tiêu chí | Phuong Dong (Trưởng nhóm / Core) | MiniThinh (Dev UI / Data) | Simmy (Dev UX / Forms) |
|---|---|---|---|
| **Vai trò chính** | Kiến trúc hệ thống, Layout chung & Core Engine | Xây dựng Component Nội dung & Trình diễn | Xây dựng Component Tương tác, Đánh giá & Form |
| **File Config phụ trách** | [**`data/brand-a.json`**](file:///D:/Webdes/figma-jit/data/brand-a.json)<br>*(CodeNest - Lập trình & CNTT)* | [**`data/brand-b.json`**](file:///D:/Webdes/figma-jit/data/brand-b.json)<br>*(CareerPath - Hướng nghiệp & CV)* | [**`data/brand-c.json`**](file:///D:/Webdes/figma-jit/data/brand-c.json)<br>*(SkillWorks - Nghề thực hành)* |
| **Git Branch** | `feature/brand-a-core` | `feature/brand-b-components` | `feature/brand-c-interaction` |
| **CSS phụ trách** | [**`css/base.css`**](file:///D:/Webdes/figma-jit/css/base.css)<br>*(Design Tokens, Reset, Typography)* | [**`css/components.css`**](file:///D:/Webdes/figma-jit/css/components.css)<br>*(Styling: Cards, Features, Stats)* | [**`css/components.css`**](file:///D:/Webdes/figma-jit/css/components.css)<br>*(Styling: Steps, Testimonials, FAQ, Contact)* |
| **Web Components phân công** | 1. [`wl-header.js`](file:///D:/Webdes/figma-jit/js/components/wl-header.js)<br>2. [`wl-hero.js`](file:///D:/Webdes/figma-jit/js/components/wl-hero.js)<br>3. [`wl-footer.js`](file:///D:/Webdes/figma-jit/js/components/wl-footer.js)<br>4. [`wl-sticky-cta.js`](file:///D:/Webdes/figma-jit/js/components/wl-sticky-cta.js) | 5. [`wl-cards.js`](file:///D:/Webdes/figma-jit/js/components/wl-cards.js)<br>6. [`wl-features.js`](file:///D:/Webdes/figma-jit/js/components/wl-features.js)<br>7. [`wl-stats.js`](file:///D:/Webdes/figma-jit/js/components/wl-stats.js)<br>8. Module Customizer ([`customizer.js`](file:///D:/Webdes/figma-jit/js/customizer.js)) | 9. [`wl-steps.js`](file:///D:/Webdes/figma-jit/js/components/wl-steps.js)<br>10. [`wl-testimonials.js`](file:///D:/Webdes/figma-jit/js/components/wl-testimonials.js)<br>11. [`wl-faq.js`](file:///D:/Webdes/figma-jit/js/components/wl-faq.js)<br>12. [`wl-contact.js`](file:///D:/Webdes/figma-jit/js/components/wl-contact.js) |
| **Nhiệm vụ khi thuyết trình (11/10)** | Thuyết trình phần **Kiến trúc JIT, White-Label và cách core nạp on-demand** | Thuyết trình phần **Design Tokens, Typography, Live Customizer & Brand B** | Thuyết trình phần **Trải nghiệm người dùng (UX), Tương tác động, Form Validation & Brand C** |

---

## 3. CHI TIẾT NHIỆM VỤ TỪNG THÀNH VIÊN

### 👤 Thành viên 1: Trưởng nhóm (Architecture & Navigation)
- **Nhiệm vụ kỹ thuật:**
  1. Quản lý [`js/core.js`](file:///D:/Webdes/figma-jit/js/core.js): Đảm bảo hàm `initApp()` nạp JSON động theo tham số `?brand=` mượt mà, không lỗi crash.
  2. Viết 4 components định hình khung trang:
     - `<wl-header>`: Menu định hướng, dropdown trên máy tính, drawer mở menu trên mobile.
     - `<wl-hero>`: Section mở đầu, hình ảnh bên phải/trái, nút CTA chính, thống kê nổi bật.
     - `<wl-sticky-cta>`: Thanh CTA nổi khi cuộn xuống trang.
     - `<wl-footer>`: Chân trang đầy đủ thông tin pháp lý, bản quyền, link liên kết.
  3. Hoàn thiện file cấu hình **`data/brand-a.json`** (CodeNest):
     - Chủ đề: Học viện lập trình công nghệ thực chiến.
     - Màu chủ đạo: `#1d4ed8` (Xanh Royal Blue). Font: `Plus Jakarta Sans`.
     - Soạn nội dung các khóa học: Frontend, Backend, Fullstack, Phỏng vấn Tech.

---

### 👤 Thành viên 2: Frontend Dev 1 (Data-driven Showcase)
- **Nhiệm vụ kỹ thuật:**
  1. Xây dựng 3 components hiển thị dữ liệu lưới/thẻ:
     - `<wl-cards>`: Lưới hiển thị danh sách khóa học/chương trình (3 hoặc 4 cột, có tag danh mục, thời lượng, học phí, đánh giá sao).
     - `<wl-features>`: Khối lý do/giá trị khác biệt (hiển thị so le ảnh trái - chữ phải hoặc 3 cột icon).
     - `<wl-stats>`: Các con số biết nói (ví dụ: 15.000+ học viên, 98% có việc làm, 50+ đối tác tuyển dụng).
  2. Quản lý [`js/customizer.js`](file:///D:/Webdes/figma-jit/js/customizer.js): Panel cho phép BGK bấm đổi màu sắc, font chữ và chế độ tối trực tiếp trên màn hình.
  3. Hoàn thiện file cấu hình **`data/brand-b.json`** (CareerPath):
     - Chủ đề: Trung tâm Định hướng Nghề nghiệp & Huấn luyện Phỏng vấn Việc làm.
     - Màu chủ đạo: `#0d9488` (Teal ngọc bích sang trọng). Font: `Space Grotesk` hoặc `Poppins`.
     - Sắp xếp bố cục section riêng trong `pages.home` (ví dụ: đưa phần Đánh giá & Thống kê lên trước Khóa học).

---

### 👤 Thành viên 3: Frontend Dev 2 (Interactions & Conversion)
- **Nhiệm vụ kỹ thuật:**
  1. Xây dựng 4 components tương tác người dùng:
     - `<wl-steps>`: Lộ trình 3 hoặc 4 bước thành công (có đường nối nối các bước trực quan).
     - `<wl-testimonials>`: Đánh giá học viên (thẻ review kèm avatar, điểm số, cựu học viên đang làm ở đâu).
     - `<wl-faq>`: Accordion câu hỏi thường gặp (bấm vào mở ra/đóng lại mượt mà với CSS transition).
     - `<wl-contact>`: Form đăng ký tư vấn/nhận tài liệu có validation dữ liệu (bắt lỗi số điện thoại, email, thông báo gửi thành công).
  2. Hoàn thiện file cấu hình **`data/brand-c.json`** (SkillWorks):
     - Chủ đề: Học viện Dạy nghề Thực hành & Đào tạo Kỹ thuật Ứng dụng.
     - Màu chủ đạo: `#ea580c` (Cam năng động, ấm áp). Font: `Outfit` hoặc `Montserrat`.
     - Tùy chỉnh danh sách FAQ và các bước lộ trình riêng biệt cho học viên học nghề.

---

## 4. HƯỚNG DẪN XÂY DỰNG WEB COMPONENT CHUẨN JIT
Mọi thành viên **bắt buộc** phải tuân theo cấu trúc mẫu sau khi viết file `js/components/wl-[tên].js` để đảm bảo hệ thống JIT tự động nạp thành công:

```javascript
/**
 * Component: <wl-example>
 * Người phụ trách: [Tên thành viên]
 */
class WlExample extends HTMLElement {
  // 1. Nhận cấu hình từ Core Engine (pages.home[i])
  set config(val) {
    this._config = val;
  }
  get config() {
    return this._config;
  }

  // 2. Nhận dữ liệu tương ứng từ JSON (sec.source ? data[sec.source] : data)
  set data(val) {
    this._data = val;
    this.render(); // Tự render lại khi dữ liệu được truyền vào
  }
  get data() {
    return this._data;
  }

  // 3. Vòng đời khi element được append vào DOM
  connectedCallback() {
    if (this._data) {
      this.render();
    }
  }

  // 4. Hàm vẽ giao diện
  render() {
    // Luôn kiểm tra an toàn dữ liệu đầu vào (Tránh lỗi màn hình trắng nếu thiếu trường)
    if (!this._data) return;

    const config = this._config || {};
    const title = config.title || 'Tiêu đề mặc định';
    const subtitle = config.subtitle || '';
    const items = Array.isArray(this._data) ? this._data : (this._data.items || []);

    // 5. Trả về HTML dùng các Class chung có sẵn trong css/components.css
    this.innerHTML = `
      <section class="section section-example" id="${config.id || 'example'}">
        <div class="container">
          <div class="section-head text-center">
            ${config.tag ? `<div class="tag-pill">${config.tag}</div>` : ''}
            <h2 class="section-title">${title}</h2>
            ${subtitle ? `<p class="section-subtitle">${subtitle}</p>` : ''}
          </div>

          <div class="example-grid">
            ${items.map(item => `
              <div class="example-card">
                <h3>${item.title || item.name}</h3>
                <p>${item.desc || item.content}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;

    // 6. Gắn sự kiện (nếu component có tính tương tác như Accordion hay Tab)
    this.setupEvents();
  }

  setupEvents() {
    // Đăng ký sự kiện click/input nếu cần
  }
}

// BẮT BUỘC: Đăng ký custom element vào window
customElements.define('wl-example', WlExample);
```

### Các nguyên tắc vàng khi viết Component:
1. **Không can thiệp inline style màu sắc cố định:** Dùng biến CSS hệ thống như `var(--color-primary)`, `var(--color-bg)`, `var(--font-heading)`. Nhờ đó khi chuyển sang Brand B hoặc Brand C, component tự động đổi màu theo.
2. **Luôn có Fallback:** Trường hợp file JSON thiếu chữ `tag` hay `subtitle`, dùng cú pháp fallback `const text = item.text || ''` để không bị văng lỗi Javascript.
3. **Class tên nhất quán:** Bọc toàn bộ nội dung trong thẻ `<section class="section">` và `<div class="container">` để lề 2 bên trang thẳng tắp trên mọi kích thước màn hình.

---

## 5. HƯỚNG DẪN QUẢN LÝ FILE CẤU HÌNH BRAND (`data/brand-*.json`)

Mỗi người sở hữu 1 file cấu hình, có cấu trúc chuẩn gồm 4 khối lớn:

```json
{
  "id": "brand-a",
  "name": "Tên Thương Hiệu",
  "tagline": "Khẩu hiệu ngắn",
  "slogan": "Thông điệp dài cho thẻ Title SEO",
  
  "theme": {
    "colorPrimary": "#1d4ed8",
    "colorPrimaryHover": "#1e40af",
    "colorPrimaryLight": "#eff6ff",
    "colorBg": "#ffffff",
    "colorSurface": "#f8fafc",
    "fontHeading": "Plus Jakarta Sans"
  },

  "menu": [
    { "label": "Khóa học", "href": "#programs" },
    { "label": "Liên hệ", "href": "#contact" }
  ],

  "pages": {
    "home": [
      { "type": "header" },
      { "type": "hero", "variant": "split" },
      { "type": "cards", "source": "programs", "title": "Khóa học tiêu biểu" },
      { "type": "features", "source": "features", "title": "Ưu điểm vượt trội" },
      { "type": "steps", "source": "steps", "title": "Lộ trình học" },
      { "type": "stats", "source": "stats" },
      { "type": "testimonials", "source": "testimonials" },
      { "type": "faq", "source": "faqs", "limit": 4 },
      { "type": "contact" },
      { "type": "footer" },
      { "type": "sticky-cta" }
    ]
  },

  "programs": [ ... ],
  "features": [ ... ],
  "stats": [ ... ],
  "testimonials": [ ... ],
  "faqs": [ ... ]
}
```

> **Mẹo tạo ấn tượng với BGK:**
> Trong mảng `pages.home`, các thành viên hãy thử đổi thứ tự section giữa các brand:
> - **Brand A:** Hero → Cards → Features → Steps → Stats → Testimonials → FAQ → Contact.
> - **Brand B:** Hero → Stats → Features → Cards → Testimonials → Steps → FAQ → Contact.
> Khi mở demo trên trình duyệt, chỉ cần đổi thanh chọn brand là bố cục nhảy tức thì — chứng minh sức mạnh của **Just-In-Time Rendering**!

---

## 6. QUY TRÌNH PHỐI HỢP GIT ĐỂ KHÔNG BỊ CONFLICT

1. **Khởi tạo:** Cả 3 người kéo bản mới nhất của nhánh `main`:
   ```bash
   git pull origin main
   ```
2. **Tạo nhánh làm việc của mình:**
   - TV1: `git checkout -b feature/brand-a-core`
   - TV2: `git checkout -b feature/brand-b-components`
   - TV3: `git checkout -b feature/brand-c-interaction`
3. **Quy tắc sửa file:**
   - Chỉ sửa các file component JS đã được phân công.
   - Chỉ chỉnh sửa file `brand-*.json` của chính mình.
   - Nếu cần thêm class CSS vào `css/components.css`, hãy thêm vào cuối file kèm comment ghi tên component của mình:
     ```css
     /* ===================================================
        COMPONENT: WL-CARDS (Thành viên 2)
        =================================================== */
     .cards-grid { ... }
     ```
4. **Họp đồng bộ & Merge (Tối ngày 09/10 & 10/10):**
   - Lần lượt gộp nhánh vào `main`.
   - Mở `index.html?brand=brand-a`, `index.html?brand=brand-b`, `index.html?brand=brand-c` để kiểm tra toàn bộ 11 component hoạt động trơn tru.
