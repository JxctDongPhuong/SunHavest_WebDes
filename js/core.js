// init app
window.appState = {
  currentBrand: 'brand-b',
  data: null
};

// Hiển thị giao diện báo lỗi / chưa có dữ liệu cho thương hiệu
export function renderEmptyBrandState(brandId = 'brand-b') {
  const appEl = document.getElementById('app');
  if (!appEl) return;

  const letter = (brandId || '').replace('brand-', '').toUpperCase();
  const brandName = `Brand ${letter || 'N/A'}`;

  // Cập nhật tiêu đề trang
  document.title = `${brandName} — Chưa có dữ liệu`;

  appEl.innerHTML = `
    <section class="empty-brand-state">
      <div class="empty-state-card">
        <div class="empty-state-icon">📁</div>
        <span class="empty-state-badge">Chưa có dữ liệu</span>
        <h2 class="empty-state-title">${brandName} chưa có dữ liệu cấu hình</h2>
        <p class="empty-state-desc">
          Hệ thống không tìm thấy dữ liệu hợp lệ trong file <code>data/${brandId}.json</code>. 
          Cấu hình thương hiệu này hiện chưa có mã nguồn hoặc đang được thành viên khác phát triển.
        </p>
        <div class="empty-state-actions">
          <button onclick="window.switchBrandTo('brand-b')" class="btn btn-primary">
            Quay lại Brand B (CareerPath)
          </button>
          <button onclick="window.switchBrandTo('brand-a')" class="btn btn-secondary">
            Xem Brand A (CodeNest)
          </button>
        </div>
      </div>
    </section>
  `;
}

// Hàm hỗ trợ chuyển đổi nhanh thương hiệu
window.switchBrandTo = function(targetBrandId) {
  const selector = document.getElementById('brand-selector');
  if (selector) selector.value = targetBrandId;
  if (window.customizerInstance && typeof window.customizerInstance.switchBrand === 'function') {
    window.customizerInstance.switchBrand(targetBrandId);
  } else {
    window.location.search = `?brand=${targetBrandId}`;
  }
};

window.renderEmptyBrandState = renderEmptyBrandState;

// fetch brand data 
export async function loadBrandData(brandId = 'brand-b') {
  try {
    // waiting until get response
    const response = await fetch(`data/${brandId}.json`);
    if (!response.ok) {
      throw new Error(`File data/${brandId}.json không tồn tại (HTTP ${response.status})`);
    }
    const text = await response.text();
    const cleanText = text.trim();
    if (!cleanText || cleanText === '{}' || cleanText === '[]') {
      throw new Error(`File data/${brandId}.json chưa có code/dữ liệu rỗng`);
    }

    const data = JSON.parse(cleanText);
    if (!data.name || (!data.pages && !data.theme)) {
      throw new Error(`Cấu trúc JSON trong ${brandId}.json chưa hoàn thiện`);
    }

    // update state
    window.appState.currentBrand = brandId;
    window.appState.data = data;

    return data;
  } catch (e) {
    console.warn(`[Core JIT] Thương hiệu ${brandId} chưa có dữ liệu:`, e.message);
    renderEmptyBrandState(brandId);
    return null;
  }
}

// Adding design tokens to CSS variables (:root)
export function applyTheme(theme = {}, data = {}) {
  const root = document.documentElement;

  if (theme.colorPrimary) {
    root.style.setProperty('--color-primary', theme.colorPrimary);
  }
  if (theme.colorPrimaryHover) {
    root.style.setProperty('--color-primary-hover', theme.colorPrimaryHover);
  }
  if (theme.colorPrimaryLight) {
    root.style.setProperty('--color-primary-light', theme.colorPrimaryLight);
  }
  if (theme.colorPrimarySubtle) {
    root.style.setProperty('--color-primary-subtle', theme.colorPrimarySubtle);
  }
  if (theme.colorPrimarySoft) {
    root.style.setProperty('--color-primary-soft', theme.colorPrimarySoft);
  }
  if (theme.colorBg) {
    root.style.setProperty('--color-bg', theme.colorBg);
  }
  if (theme.colorSurface) {
    root.style.setProperty('--color-surface', theme.colorSurface);
  }
  if (theme.fontHeading) {
    root.style.setProperty('--font-heading', `'${theme.fontHeading}', sans-serif`);
    loadGoogleFonts(theme.fontHeading);
  }

  // update page title
  if (data.name && data.tagline) {
    document.title = `${data.name} — ${data.tagline}`;
  }

  //update Favicon
  if (data.favicon) {
    let faviconEl = document.querySelector("link[rel*='icon']");
    if (!faviconEl) {
      faviconEl = document.createElement('link');
      faviconEl.rel = 'shortcut icon';
      document.head.appendChild(faviconEl);
    }
    faviconEl.href = data.favicon;
  }
}

// add font from gg
function loadGoogleFonts(fontName) {
  const fontId = `gfont-${fontName.toLowerCase().replace(/\s+/g, '')}`;
  // stop when font is loaded
  if (!document.getElementById(fontId)) {
    // add font to head website if not loaded
    const fontLink = document.createElement('link');
    fontLink.id = fontId;
    fontLink.rel = 'stylesheet';
    fontLink.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(fontLink);
  }
}

// render components to #app
export async function renderPage(data) {
  const appEl = document.getElementById('app');
  if (!appEl || !data) return;

  const pageKey = document.body.dataset.page || 'home';
  const sections = data.pages?.[pageKey];

  if (!sections) {
    appEl.innerHTML = '<p>Page not found</p>';
    return;
  }

  // delete all old data
  appEl.innerHTML = '';

  for (const sec of sections) {
    const type = sec.type;
    const tagName = `wl-${type}`;

    try {
      // adding dynamic component file js 
      await import(`./components/${tagName}.js`);

      // create custom element card
      const el = document.createElement(tagName);

      // Assign section configuration (tag, title, subtitle, source,...)
      el.config = sec;

      // defining the value of custom element 
      if (sec.source && data[sec.source]) {
        el.data = data[sec.source];
      } else if (data[type]) {
        el.data = data[type];
      } else {
        el.data = data;
      }

      // append
      appEl.appendChild(el);

    } catch (e) {
      console.warn(`⚠️ can't not loaded component ${tagName}:`, e.message);
    }
  }

  // turn on live customizer if they have
  if (window.initCustomizer) {
    window.initCustomizer(data);
    console.log('✅ Live Customizer is running');
  }
}

// Expose core functions to window for interoperability
window.loadBrandData = loadBrandData;
window.applyTheme = applyTheme;
window.renderPage = renderPage;

async function initApp() {
  // Check URL param first (e.g., ?brand=brand-a)
  const urlParams = new URLSearchParams(window.location.search);
  const initialBrand = urlParams.get('brand') || 'brand-b';

  // load brand data 
  const brandData = await loadBrandData(initialBrand);
  if (brandData) {
    applyTheme(brandData.theme, brandData);
    await renderPage(brandData);
    console.log('✅ Page rendered', brandData.name);
  }
}

// waiting for DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
