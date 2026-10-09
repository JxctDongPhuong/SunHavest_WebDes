// init app
window.appState = {
  currentBrand: 'brand-b',
  data: null
};

// fetch brand data 
export async function loadBrandData(brandId = 'brand-b') {
  try {
    // waiting until get response
    const response = await fetch(`data/${brandId}.json`);
    if (!response.ok) {
      throw new Error(`can't fetch brand data: ${brandId}`);
    }
    const data = await response.json();

    // update state
    window.appState.currentBrand = brandId;
    window.appState.data = data;

    return data;
  } catch (e) {
    console.error('Error loading brand data:', e);
    const appEl = document.getElementById('app');
    if (appEl) {
      appEl.innerHTML = `
        <div style="padding: 40px; text-align: center;">
          <h2 style="color: red; margin-bottom: 12px;">❌ Error</h2>
          <p>Không thể tải dữ liệu thương hiệu. Vui lòng kiểm tra lại file JSON.</p>
          <button onclick="loadBrandData('brand-a')" style="margin-top: 16px; padding: 8px 16px; cursor: pointer;">Thử lại Brand A</button>
        </div>
      `;
    }
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
