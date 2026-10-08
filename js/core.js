/**
 * Core Engine: js/core.js
 * Quản lý nạp dữ liệu JSON, áp dụng Theme tokens động, nạp font, và dựng Web Components JIT
 */

async function initApp() {
  const urlParams = new URLSearchParams(window.location.search);
  const brandId = urlParams.get('brand') || localStorage.getItem('selected_brand') || 'brand-a';
  const page = document.body.dataset.page || 'home';

  try {
    const res = await fetch(`data/${brandId}.json`);
    if (!res.ok) throw new Error(`Không tìm thấy file cấu hình data/${brandId}.json`);
    const data = await res.json();

    // 1. Áp dụng CSS Variables Theme
    applyTheme(data);

    // 2. Cập nhật Title & Favicon
    document.title = `${data.name} — ${data.tagline || data.slogan}`;
    updateFavicon(data.favicon);

    // 3. Dựng các section Web Components theo cấu hình JSON
    const appEl = document.querySelector('#app');
    if (!appEl) {
      console.error('Không tìm thấy phần tử #app');
      return;
    }
    appEl.innerHTML = ''; // Reset container

    const pageSections = data.pages?.[page] || [];
    for (const sec of pageSections) {
      try {
        // Nạp dynamic component module tương ứng
        await import(`./components/wl-${sec.type}.js`);
        
        const el = document.createElement(`wl-${sec.type}`);
        el.config = sec;
        el.data = sec.source ? data[sec.source] : data;
        appEl.appendChild(el);
      } catch (err) {
        console.warn(`[Core] Không dựng được section: wl-${sec.type}`, err);
      }
    }

    // 4. Khởi tạo Floating Brand Switcher hỗ trợ chấm thi & demo
    setupBrandSwitcher(brandId);

    // 5. Khởi tạo Bảng điều khiển Tùy chỉnh Giao diện Trực tiếp (Live Customizer)
    const { setupLiveCustomizer } = await import('./customizer.js');
    setupLiveCustomizer(data, brandId);

  } catch (error) {
    console.error('[Core Error]:', error);
    const appEl = document.querySelector('#app');
    if (appEl) {
      appEl.innerHTML = `
        <div style="padding: 3rem; text-align: center; color: #ef4444;">
          <h2>Lỗi tải dữ liệu cấu hình</h2>
          <p>${error.message}</p>
          <p style="margin-top: 1rem; color: #64748b;">Gợi ý: Cần chạy website qua local web server (ví dụ Live Server, npx serve, hoặc python -m http.server) để trình duyệt cho phép fetch() JSON tĩnh.</p>
        </div>
      `;
    }
  }
}

/**
 * Ghi đè biến CSS vào :root dựa trên đối tượng theme của từng brand
 */
function applyTheme(data) {
  const root = document.documentElement.style;
  const theme = data.theme || {};

  if (theme.colorPrimary) root.setProperty('--color-primary', theme.colorPrimary);
  if (theme.colorPrimaryHover) root.setProperty('--color-primary-hover', theme.colorPrimaryHover);
  if (theme.colorPrimaryLight) root.setProperty('--color-primary-light', theme.colorPrimaryLight);
  if (theme.colorPrimarySubtle) root.setProperty('--color-primary-subtle', theme.colorPrimarySubtle);
  if (theme.colorBg) root.setProperty('--color-bg', theme.colorBg);
  if (theme.colorSurface) root.setProperty('--color-surface', theme.colorSurface);

  if (theme.fontHeading) {
    root.setProperty('--font-heading', `"${theme.fontHeading}", system-ui, -apple-system, sans-serif`);
    root.setProperty('--font-body', `"${theme.fontHeading}", system-ui, -apple-system, sans-serif`);
    loadGoogleFont(theme.fontHeading);
  }
}

/**
 * Tải động Google Font nếu cần
 */
function loadGoogleFont(fontName) {
  const id = `google-font-${fontName.toLowerCase().replace(/\s+/g, '-')}`;
  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700;800&display=swap`;
    document.head.appendChild(link);
  }
}

/**
 * Cập nhật Favicon
 */
function updateFavicon(url) {
  if (!url) return;
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = url;
}

/**
 * Tạo widget chọn cấu hình (Brand Switcher) nổi ở góc màn hình để demo cho BGK
 */
function setupBrandSwitcher(currentBrand) {
  if (document.getElementById('brand-switcher')) return;

  const switcher = document.createElement('div');
  switcher.id = 'brand-switcher';
  switcher.innerHTML = `
    <span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
      Cấu hình:
    </span>
    <select id="brand-select-input" aria-label="Chọn cấu hình thương hiệu">
      <option value="brand-a" ${currentBrand === 'brand-a' ? 'selected' : ''}>Brand A: CodeNest (IT/Code)</option>
      <option value="brand-b" ${currentBrand === 'brand-b' ? 'selected' : ''}>Brand B: CareerPath (Hướng nghiệp)</option>
      <option value="brand-c" ${currentBrand === 'brand-c' ? 'selected' : ''}>Brand C: SkillWorks (Dạy nghề)</option>
    </select>
  `;

  document.body.appendChild(switcher);

  const select = switcher.querySelector('#brand-select-input');
  select.addEventListener('change', (e) => {
    const newBrand = e.target.value;
    localStorage.setItem('selected_brand', newBrand);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('brand', newBrand);
    window.location.href = newUrl.toString();
  });
}

// Chạy khởi tạo khi DOM sẵn sàng
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
