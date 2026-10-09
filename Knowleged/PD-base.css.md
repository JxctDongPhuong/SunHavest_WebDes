# Kiến Thức Nền Tảng: base.css & Hệ Thống White-Label

---

## 1. Bốn Nhiệm Vụ Cốt Lõi của `base.css` (4 Missions)

1. **Design Tokens (CSS Variables - `:root`):** Khai báo toàn bộ biến màu sắc, font chữ, kích thước, bo góc, bóng đổ và khoảng cách.
2. **Reset & Normalize CSS:** Xóa bỏ các kiểu dáng mặc định không đồng nhất giữa các trình duyệt (Chrome, Safari, Edge...).
3. **Default Styles cho Element & Layout:** Thiết lập khung bố cục dùng chung (`html`, `body`, `.container`, `.section-wrapper`).
4. **Shared UI Components:** Các thành phần giao diện tái sử dụng trên mọi trang (`.btn`, `.section-header`, `.section-tag`, `.badge`...).

---

## 2. Hệ Thống Design Tokens trong `:root`

### A. Tổng quan các nhóm Token

| Nhóm | Danh sách Token | Số lượng |
| :--- | :--- | :---: |
| **Màu thương hiệu (Dynamic)** | `primary`, `primary-hover`, `primary-light`, `primary-subtle`, `primary-soft` | 5 |
| **Màu chữ & Viền (Static)** | `text-main`, `text-muted`, `border` | 3 |
| **Typography** | `heading`, `body` | 2 |
| **Bo góc (Border Radius)** | `radius-primary` (10px), `radius-md` (16px), `radius-lg` (24px), `radius-xl` (32px) | 4 |
| **Bóng đổ (Box Shadow)** | `shadow-md`, `shadow-lg` | 2 |
| **Bố cục (Layout)** | `container-max` (1440px), `page-padding` (96px) | 2 |

---

### B. Dynamic Tokens (Biến Động - Thay đổi theo từng Brand)

```css
:root {
  /* --- Dynamic Brand Colors --- */
  --color-primary: #1358E8;         /* Màu chủ đạo thương hiệu */
  --color-primary-hover: #0F47BD;   /* Màu khi hover nút/link */
  --color-primary-light: #E8F0FF;   /* Nền badge, icon highlight */
  --color-primary-subtle: #F3F7FF;  /* Nền khối section nhạt */
  --color-primary-soft: #BCD3FF;    /* Thẻ phụ, đường viền mềm */
  --color-bg: #FFFFFF;              /* Màu nền trang chính */
  --color-surface: #FFFFFF;         /* Màu nền thẻ card */
  
  /* --- Dynamic Font & Radius --- */
  --font-heading: 'Be Vietnam Pro', system-ui, sans-serif;
  --radius-primary: 10px;           /* Bo góc mặc định cho nút & input */
}
```

---

### C. Static Tokens (Biến Tĩnh - Cố định cho toàn dự án)

| Tên Token | Ý nghĩa / Giá trị | Ứng dụng thực tế |
| :--- | :--- | :--- |
| `--font-body` | Font cho chữ thường (đoạn văn, nhãn) | Kế thừa vào `body`, mọi chữ thường đều dùng font này |
| `--color-text-main` | Màu chữ chính, đậm (`#252525`) | Tiêu đề, tên khóa học, câu hỏi FAQ lúc đóng |
| `--color-text-muted` | Màu chữ phụ, nhạt hơn (`#707070`) | Đoạn mô tả, câu trả lời FAQ, placeholder |
| `--color-border` | Màu đường viền chuẩn | Viền mục FAQ, viền ô nhập input, viền thẻ card |
| `--radius-md` | Bo góc 16px | Mục FAQ, khối tóm tắt |
| `--radius-lg` | Bo góc 24px | Khung form trắng, thẻ lớn |
| `--radius-xl` | Bo góc 32px | Khối banner lớn, section Contact |
| `--shadow-md` | Đổ bóng vừa | Thẻ card nổi nhẹ khi hover |
| `--shadow-lg` | Đổ bóng lớn, mờ | Khung nổi bật (báo cáo, kết quả luyện tập) |
| `--container-max` | Chiều rộng tối đa (1440px) | Giới hạn `.container` không bị giãn quá rộng trên màn 2K/4K |
| `--page-padding` | Lề trái/phải (96px) | Khoảng cách an toàn 2 bên lề của `.container` |

---

## 3. Bản Chất & Cơ Chế Hoạt Động của `*-primary-*`

### Khái niệm:
* **Các biến `primary`** là các cổng kết nối động (Dynamic Ports) cho phép thay đổi dữ liệu được truyền từ file Data/JSON.
* **Các class cơ sở như `.btn`** là cấu hình mặc định / tĩnh (bộ khung xương: kích thước, padding, bo tròn, hiệu ứng click).

### Phân cấp cụ thể:
* **`.btn` (Khung xương cố định):** Giữ nguyên quy chuẩn hình dáng, kích thước, hiệu ứng click cho mọi nút trên toàn web.
* **`--color-primary`, `--color-secondary` (Biến nhận dữ liệu):** Nhận giá trị màu sắc từ file cấu hình / JSON của từng Brand.
* **`.btn-primary`, `.section-tag` (Thành phần gắn biến):** Gắn sẵn các biến `var(--color-primary)`. Khi dữ liệu đầu vào đổi, toàn bộ component này sẽ tự động "khoác áo mới" theo đúng màu thương hiệu.

---

## 4. Quy Trình Chuyển Đổi Thương Hiệu (Brand Switcher Workflow)

```text
[ Người dùng chọn "EduCareer" trên #brand-switcher ]
                      ↓
[ JavaScript bắt sự kiện thay đổi (onchange) ]
                      ↓
[ JS đọc dữ liệu màu & font của EduCareer từ file Data ]
  { primary: '#f97316', heading: 'Outfit', logo: 'logo-educareer.svg' }
                      ↓
[ JS cập nhật đè lên các biến CSS trong :root ]
  document.documentElement.style.setProperty('--color-primary', '#f97316');
                      ↓
[ Toàn bộ Website lập tức đổi sang màu Cam và Logo mới mà không cần reload trang! ]
```
