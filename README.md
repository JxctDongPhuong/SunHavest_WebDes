# 📘 BÁO CÁO KIẾN TRÚC & TÀI LIỆU KỸ THUẬT HỆ THỐNG JIT
> **Dự án:** Nền Tảng Giáo Dục & Hướng Nghiệp Chuẩn Kiến Trúc JIT (Just-In-Time Component Rendering)  
> **Thương hiệu đại diện:** Brand B — **CareerPath**  
> **Người thực hiện:** MiniThinh (Dev UI / Data & Web Components)

---

## 1. Tổng Quan Kiến Trúc Hệ Thống (Architecture Overview)

Dự án được xây dựng theo kiến trúc **JIT (Just-In-Time) Component Rendering** kết hợp mô hình **White-Label**, cho phép toàn bộ giao diện và dữ liệu được nạp động theo thời gian thực từ cấu hình JSON mà không cần biên dịch trước.

```
       [ data/brand-*.json ] (Single Source of Truth: Token, Pages, Data)
                │
                ▼
         [ js/core.js ] (JIT Engine)
       ┌────────┴─────────────────────────────────┐
       ▼                                          ▼
[ applyTheme() ]                           [ renderPage() ]
  Bơm biến CSS vào :root                     Duyệt mảng pages.home
  (Ghi đè design tokens trong base.css)       Dynamic import('./components/wl-*.js')
                                             Tạo document.createElement('wl-*')
                                             Bơm el.config & el.data
                                                  │
                                                  ▼
                                         [ Light DOM #app ]
                                         (Hiển thị trên trình duyệt)
                                                  ▲
                                                  │ Áp dụng style & hiệu ứng
                                         [ css/components.css ]
```

### Vai trò các tầng trong hệ thống:
1. **`index.html`**: Đóng vai trò là "Vỏ bọc rỗng" (Shell container) duy nhất, chỉ chứa thẻ `<div id="app"></div>` và nạp các tài nguyên nền tảng.
2. **`data/brand-*.json`**: Nguồn dữ liệu duy nhất (Single Source of Truth), chứa toàn bộ token màu sắc, font chữ, danh sách section cần vẽ và nội dung chi tiết.
3. **`js/core.js`**: "Trái tim" điều phối hệ thống. Chịu trách nhiệm nạp JSON, bơm biến CSS vào `:root`, nạp các Web Component đúng lúc cần hiển thị (Just-In-Time), và truyền dữ liệu cho từng component.
4. **`css/base.css`**: Khung thiết kế nền tảng (Design Tokens tĩnh & động, CSS Reset cho `*`, `ul, ol`, Typography và các tiện ích dùng chung như `.container`, `.btn`).
5. **`css/components.css`**: Tầng giao diện chi tiết, hiệu ứng tương tác (hover, micro-animations, glassmorphism) và bố cục responsive cho từng Web Component.
6. **`js/components/`**: Các Web Components độc lập (`wl-stats.js`, `wl-features.js`, `wl-cards.js`,...).

---

## 2. Chi Tiết Hoạt Động & Cơ Chế Tương Tác Của 3 Web Components Cốt Lõi

Ba Web Component do **MiniThinh** phụ trách gồm: `<wl-stats>`, `<wl-features>` và `<wl-cards>`. Tất cả đều được viết theo chuẩn **Web Components thuần (Custom Elements v1)**, kế thừa từ `HTMLElement`.

---

### 2.1. Component Thống Kê: `<wl-stats>` (`js/components/wl-stats.js`)

#### A. Ý nghĩa của code
- **Mục đích nghiệp vụ:** Hiển thị các chỉ số uy tín và kết quả vượt trội (Social Proof) như: *"95.6% Ứng viên nhận được offer"*, *"12.000+ Hồ sơ CV được nâng cấp"*, nhằm thuyết phục ứng viên tin tưởng vào nền tảng ngay sau khối Hero.
- **Mục đích kỹ thuật:** Tách biệt hoàn toàn phần dữ liệu số liệu ra khỏi giao diện; số lượng thống kê có thể là 3, 4 hay 6 chỉ số tùy thuộc vào file JSON của từng thương hiệu.

#### B. Cấu trúc và cách thức hoạt động nội tại
```javascript
class WlStats extends HTMLElement {
  set config(val) { this._config = val; }
  get config() { return this._config; }

  set data(val) {
    this._data = val;
    this.render(); // Tự động vẽ lại giao diện ngay khi nhận dữ liệu
  }
  get data() { return this._data; }

  connectedCallback() {
    if (this._data) this.render();
  }

  render() {
    // Duyệt mảng data.items để sinh HTML .stat-item
  }
}
customElements.define('wl-stats', WlStats);
```
- **Getter / Setter (`config`, `data`):** Khi `core.js` gán `el.data = data.stats`, setter `data` được kích hoạt và tự động gọi hàm `this.render()`.
- **Vòng đời `connectedCallback()`:** Đảm bảo nếu phần tử được gắn vào cây DOM sau khi dữ liệu đã có thì component vẫn tự render ra màn hình một cách an toàn.
- **Light DOM Rendering:** Component đổ trực tiếp HTML vào `this.innerHTML` (thay vì Shadow DOM) để có thể thừa hưởng toàn bộ biến CSS tokens và quy tắc styling chung từ `base.css` và `components.css`.

#### C. Cách tương tác với các file khác
| File tương tác | Cách thức tương tác |
| :--- | :--- |
| **`js/core.js`** | `core.js` đọc cấu hình `{ "type": "stats", "source": "stats" }` trong `pages.home`, gọi dynamic `import('./components/wl-stats.js')`, dùng `document.createElement('wl-stats')`, gán `el.data = data.stats` và gắn vào `#app`. |
| **`data/brand-b.json`** | Nhận mảng đối tượng `stats: [{ "value": "95.6%", "label": "..." }]`. Nếu đổi sang `brand-a.json`, mảng `stats` có nội dung IT khác sẽ tự động hiển thị mà không sửa 1 dòng JS. |
| **`css/base.css`** | Thừa hưởng các class tiện ích chung: `.section-wrapper`, `.container`, và các token `:root` như `--font-heading`, `--color-surface`. |
| **`css/components.css`** | Nhận toàn bộ bố cục `.stats-grid` (4 cột responsive), gradient màu chữ `--color-primary`, và các hiệu ứng hover nâng cao: nhấc thẻ `translateY(-6px)`, thanh quét sáng `::before` và quầng sáng radial `::after`. |

---

### 2.2. Component Lợi Thế Vượt Trội: `<wl-features>` (`js/components/wl-features.js`)

#### A. Ý nghĩa của code
- **Mục đích nghiệp vụ:** Giới thiệu các phương pháp huấn luyện độc quyền (Mô hình 1-1 với HR Leader, Phân tích CV qua thuật toán ATS, Mạng lưới việc làm ẩn).
- **Mục đích kỹ thuật:** Tạo layout dạng hàng so le linh hoạt (Alternating Layout: hàng lẻ chữ trái - ảnh phải, hàng chẵn ảnh trái - chữ phải).

#### B. Cấu trúc và cách thức hoạt động nội tại
```javascript
const featuresHtml = items.map((item, idx) => {
  const isReverse = idx % 2 !== 0; // Xác định dòng so le chẵn / lẻ
  const highlightsHtml = (item.highlights || []).map(hl => `
    <li>
      <svg width="18" height="18" ...><polyline points="20 6 9 17 4 12"/></svg>
      <span>${hl}</span>
    </li>
  `).join('');

  return `
    <div class="feature-item ${isReverse ? 'reverse' : ''}">
      <div class="feature-content">
        <span class="feature-index">${item.index || '0' + (idx + 1)}</span>
        <h3 class="feature-title">${item.title}</h3>
        <p class="feature-desc">${item.desc}</p>
        <ul class="feature-highlights">${highlightsHtml}</ul>
      </div>
      <div class="feature-media"><img src="${item.image}"></div>
    </div>
  `;
}).join('');
```
- **Xử lý logic so le (`idx % 2 !== 0`):** Component tự động gắn thêm class `reverse` vào các item có chỉ số lẻ mà không cần cấu hình thủ công trong JSON.
- **Nested List Rendering:** Mỗi feature có danh sách các ưu điểm `highlights`. Component dùng `map()` lồng nhau để render các thẻ `<li>` kèm SVG icon dấu check xanh sắc nét.
- **Fallback an toàn:** Nếu thiếu `item.index` hoặc `item.image`, code tự sinh số thứ tự `01, 02...` và nạp ảnh fallback chất lượng cao từ Unsplash.

#### C. Cách tương tác với các file khác
| File tương tác | Cách thức tương tác |
| :--- | :--- |
| **`js/core.js`** | Nhận biết section `features`, nạp file JS tương ứng, truyền `config` (chứa `tag`, `title`, `subtitle`) và `data` (mảng `features`). |
| **`data/brand-b.json`** | Lấy dữ liệu từ mảng `features` gồm: `index`, `title`, `desc`, mảng `highlights`, và đường dẫn ảnh `image`. |
| **`css/base.css`** | Phụ thuộc vào quy tắc reset **`ul, ol { list-style: none; }`** trong `base.css` để loại bỏ dấu chấm đen mặc định của trình duyệt (`disc`), giúp dấu check SVG hiển thị đúng chuẩn thiết kế. |
| **`css/components.css`** | Áp dụng Grid 2 cột (`grid-template-columns: 1fr 1fr; gap: 60px;`). Class `.feature-item.reverse` kích hoạt quy tắc hoán đổi vị trí hiển thị (`.feature-content { order: 2; }` và `.feature-media { order: 1; }`). Xử lý hover phóng to ảnh nhẹ và co về 1 cột trên màn hình di động. |

---

### 2.3. Component Danh Mục Khóa Học / Dịch Vụ: `<wl-cards>` (`js/components/wl-cards.js`)

#### A. Ý nghĩa của code
- **Mục đích nghiệp vụ:** Trưng bày các gói giải pháp then chốt của CareerPath (Sửa CV ATS, Mock Interview, Khai phóng tiềm năng, Cố vấn Quản lý) kèm thời lượng, giá tiền và nút đăng ký tư vấn.
- **Mục đích kỹ thuật:** Tạo lưới thẻ responsive tự động co giãn (`auto-fill`), giới hạn chiều cao nội dung đồng đều giữa các thẻ, tích hợp badge nhãn nổi và nút hành động chuyển đổi (Conversion CTA).

#### B. Cấu trúc và cách thức hoạt động nội tại
```javascript
const cardsHtml = items.map(item => `
  <article class="course-card">
    <div class="card-media">
      <img src="${item.image}" loading="lazy">
      ${item.badge ? `<span class="card-badge">${item.badge}</span>` : ''}
    </div>
    <div class="card-body">
      <div class="card-meta">
        <span><svg ...></svg> ${item.duration}</span>
        <span><svg ...></svg> ${item.level}</span>
      </div>
      <h3 class="card-title">${item.title}</h3>
      <p class="card-desc">${item.desc}</p>
      <div class="card-footer">
        <div class="card-price">${item.price}</div>
        <a href="#contact" class="btn btn-outline">${item.action}</a>
      </div>
    </div>
  </article>
`).join('');
```
- **Khai báo thẻ ngữ nghĩa HTML5 (`<article>`):** Mỗi card là một bài viết độc lập chuẩn SEO.
- **Lazy loading ảnh (`loading="lazy"`):** Tối ưu tốc độ tải trang khi danh sách có nhiều dịch vụ.
- **Badge có điều kiện:** Chỉ render thẻ `span.card-badge` khi trường `item.badge` có giá trị trong JSON.

#### C. Cách tương tác với các file khác
| File tương tác | Cách thức tương tác |
| :--- | :--- |
| **`js/core.js`** | `core.js` đọc trường `source: "programs"` trong cấu hình trang, tìm đến thuộc tính `data["programs"]` trong JSON và truyền vào setter `el.data`. |
| **`data/brand-b.json`** | Cung cấp dữ liệu chi tiết cho từng card: `badge`, `title`, `desc`, `duration`, `level`, `price`, `image`, `action`. |
| **`css/base.css`** | Sử dụng chung hệ thống nút bấm `.btn`, `.btn-outline` và các biến token bo góc `--radius-xl`, bóng đổ `--shadow-md`. Liên kết `href="#contact"` giúp cuộn mượt đến section Contact. |
| **`css/components.css`** | Quản lý lưới thẻ `grid-template-columns: repeat(auto-fill, minmax(270px, 1fr))`; hiệu ứng Glassmorphism cho badge; thuộc tính `-webkit-line-clamp: 3` để khóa cố định mô tả ở 3 dòng (đảm bảo mọi card thẳng hàng nhau); hiệu ứng hover làm nổi bật thẻ, zoom ảnh `1.08x` và tự đổi nền nút CTA sang màu `--color-primary`. |

---

## 3. Ma Trận Dữ Liệu & Tương Tác Giữa Các File (Interaction Matrix)

Bảng tổng hợp cách một thay đổi từ file này kích hoạt phản ứng ở các file khác:

```
[ Thay đổi trong JSON ] ──> [ core.js tiếp nhận ] ──> [ Web Components render ] ──> [ CSS tạo kiểu & Hiệu ứng ]
```

| Tình huống thực tế | File kích hoạt | File trung gian xử lý | Kết quả hiển thị trên trình duyệt |
| :--- | :--- | :--- | :--- |
| **Đổi mã màu chủ đạo từ Teal sang Xanh tím** | `data/brand-*.json` (`theme.colorPrimary`) | `core.js` gọi `applyTheme()`, ghi đè `--color-primary` | Toàn bộ số liệu `wl-stats`, tick xanh `wl-features`, giá tiền và nút bấm `wl-cards` đổi màu đồng bộ tức thì. |
| **Đổi thứ tự hiển thị: Stats lên trước Features** | `data/brand-b.json` (`pages.home`) | `core.js` duyệt mảng `pages.home` theo vòng lặp `for...of` | DOM của `<wl-stats>` tự động được chèn lên trước `<wl-features>` mà không cần reload trang. |
| **Thêm một khóa học mới vào danh sách** | `data/brand-b.json` (mảng `programs`) | `wl-cards.js` nhận mảng mới qua `el.data = ...` | Thẻ card mới lập tức được sinh ra, tự vừa vặn vào lưới CSS Grid `auto-fill`. |
| **Chuyển font tiêu đề** | `data/brand-*.json` (`theme.fontHeading`) | `core.js` gọi `loadGoogleFonts()`, tạo thẻ `<link>` nạp font | Font chữ tiêu đề của toàn bộ `h2`, `h3`, `stat-value`, `card-title` chuyển đổi mượt mà. |

---

## 4. Hướng Dẫn Khởi Chạy Và Kiểm Thử (Testing & Demo)

Do kiến trúc JIT sử dụng dynamic `import()` và `fetch()`, hệ thống yêu cầu chạy thông qua máy chủ HTTP:

### 1. Khởi chạy bằng Node.js:
```bash
# Di chuyển vào thư mục dự án
cd minithinh-jit

# Chạy server tĩnh (mặc định cổng 3000)
npx serve
```
Mở trình duyệt: `http://localhost:3000` (mặc định nạp **Brand B — CareerPath**).

### 2. Kiểm thử chuyển đổi White-Label giữa các thương hiệu:
- **Brand B (CareerPath - Định hướng nghề nghiệp):** `http://localhost:3000/index.html?brand=brand-b`
- **Brand A (CodeNest - Lập trình & CNTT):** `http://localhost:3000/index.html?brand=brand-a`
- **Brand C (SkillWorks - Kỹ năng nghề):** `http://localhost:3000/index.html?brand=brand-c`

---
*Tài liệu được biên soạn và cập nhật hoàn chỉnh cho buổi báo cáo tiến độ và nghiệm thu dự án.*
