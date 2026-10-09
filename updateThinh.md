core.js
Code cũ:
export async function loadBrandData(...) { ... }
export function applyTheme(...) { ... }
export async function renderPage(...) { ... }
Code mới (thêm vào trước hàm initApp):
window.loadBrandData = loadBrandData;
window.applyTheme = applyTheme;
window.renderPage = renderPage;

Khác biệt ở đâu? Trước đây, 3 hàm này chỉ nằm trong phạm vi của module core.js. Nếu file customize.js
 muốn ra lệnh "hãy nạp lại dữ liệu Brand A" thì không gọi được.
Tác dụng: Giúp file customize.js khi người dùng chọn thương hiệu mới trên Dropdown có thể gọi window.loadBrandData() và window.renderPage() để vẽ lại toàn bộ giao diện theo thương hiệu mới ngay lập tức.

2. Tự động nhận diện thương hiệu từ đường link URL
Code cũ:
async function initApp() {
  // Bị gán cứng (hardcoded) chỉ nạp Brand B
  const brandData = await loadBrandData('brand-b');
  if (brandData) {
    applyTheme(brandData.theme, brandData);
    await renderPage(brandData);
  }
}
Code mới:
async function initApp() {
  // 1. Kiểm tra xem trên link URL có ?brand= nào không
  const urlParams = new URLSearchParams(window.location.search);
  const initialBrand = urlParams.get('brand') || 'brand-b';
  // 2. Nạp đúng brand được yêu cầu (nếu không có thì mặc định brand-b)
  const brandData = await loadBrandData(initialBrand);
  if (brandData) {
    applyTheme(brandData.theme, brandData);
    await renderPage(brandData);
    console.log('✅ Page rendered', brandData.name);
  }
}
Tác dụng: Khi bạn chọn Brand A ở thanh customize.js, đường link đổi thành ?brand=brand-a. Nếu bạn hoặc Ban giám khảo bấm F5 (Reload lại trang), trang web vẫn ghi nhớ và giữ nguyên Brand A chứ không bị nhảy ngược về Brand B.

