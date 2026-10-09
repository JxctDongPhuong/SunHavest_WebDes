/**
 * Module: customize.js
 * Nhiệm vụ:
 * 1. Tạo thanh điều khiển cố định (fixed) ở góc dưới bên trái màn hình.
 * 2. Cung cấp Dropdown chuyển đổi linh hoạt giữa 3 cấu hình JSON (Brand A, Brand B, Brand C).
 * 3. Cung cấp thanh chọn màu nhanh (Xanh lam, Vàng, Đỏ) và ô chọn màu tùy ý theo thời gian thực.
 */

// Danh sách thương hiệu tương ứng với các file JSON trong thư mục data/
const BRAND_OPTIONS = [
  { id: 'brand-a', name: 'Brand A — CodeNest (IT)', color: '#1d4ed8' },
  { id: 'brand-b', name: 'Brand B — CareerPath (Hướng nghiệp)', color: '#0f9d8a' },
  { id: 'brand-c', name: 'Brand C — SkillWorks (Đang phát triển)', color: '#ea580c' }
];

// 3 màu preset theo yêu cầu + mã màu
const COLOR_PRESETS = [
  { id: 'blue', label: 'Xanh lam', hex: '#1358e8' },
  { id: 'yellow', label: 'Vàng', hex: '#f59e0b' },
  { id: 'red', label: 'Đỏ', hex: '#ef4444' }
];

class LiveCustomizer {
  constructor() {
    this.currentBrand = this.getInitialBrand();
    this.currentColor = null;
    this.isCollapsed = false;
    this.init();
  }

  // Lấy brand ban đầu từ URL parameter hoặc mặc định brand-b
  getInitialBrand() {
    const params = new URLSearchParams(window.location.search);
    return params.get('brand') || window.appState?.currentBrand || 'brand-b';
  }

  init() {
    this.injectStyles();
    this.createPanel();
    this.setupEvents();
  }

  // 1. Nhúng Style CSS cho thanh Customizer cố định ở góc trái
  injectStyles() {
    if (document.getElementById('customizer-styles')) return;

    const style = document.createElement('style');
    style.id = 'customizer-styles';
    style.textContent = `
      /* Thanh điều khiển luôn cố định ở góc dưới bên trái */
      #live-customize-panel {
        position: fixed;
        left: 20px;
        bottom: 20px;
        z-index: 99999;
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        user-select: none;
      }

      .customizer-box {
        background: rgba(15, 23, 42, 0.94);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 16px;
        padding: 16px 18px;
        box-shadow: 0 16px 36px -6px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.08);
        color: #f8fafc;
        display: flex;
        flex-direction: column;
        gap: 12px;
        min-width: 285px;
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
      }

      .customizer-box.is-collapsed {
        display: none;
      }

      /* Nút icon tròn thu gọn / mở lại panel */
      .customizer-toggle-btn {
        position: fixed;
        left: 20px;
        bottom: 20px;
        z-index: 99998;
        background: #0f172a;
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.2);
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        font-size: 1.2rem;
        transition: transform 0.2s ease, background-color 0.2s ease;
      }

      .customizer-toggle-btn:hover {
        transform: scale(1.08);
        background: #1e293b;
      }

      .customizer-toggle-btn.is-visible {
        display: flex;
      }

      /* Header của bảng điều khiển */
      .customizer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .customizer-title {
        font-size: 0.82rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #94a3b8;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .customizer-close-btn {
        background: transparent;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        padding: 2px 6px;
        font-size: 1rem;
        border-radius: 4px;
        line-height: 1;
        transition: all 0.2s ease;
      }

      .customizer-close-btn:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.1);
      }

      /* Nhóm cấu hình Brand JSON */
      .customizer-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .customizer-label {
        font-size: 0.76rem;
        font-weight: 600;
        color: #cbd5e1;
      }

      /* Dropdown chọn Brand */
      .customizer-select {
        background: #1e293b;
        color: #f8fafc;
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 0.82rem;
        font-weight: 500;
        cursor: pointer;
        outline: none;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      .customizer-select:hover,
      .customizer-select:focus {
        border-color: #38bdf8;
        box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.25);
      }

      /* Thanh chọn màu nhanh */
      .color-picker-row {
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(30, 41, 59, 0.7);
        padding: 6px 10px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .color-dot-btn {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        border: 2px solid transparent;
        cursor: pointer;
        position: relative;
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
        padding: 0;
      }

      .color-dot-btn:hover {
        transform: scale(1.18);
      }

      .color-dot-btn.is-active {
        border-color: #ffffff;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
        transform: scale(1.12);
      }

      /* Ô chọn màu tùy ý (input color) */
      .custom-color-wrap {
        margin-left: auto;
        position: relative;
        display: flex;
        align-items: center;
      }

      .custom-color-input {
        width: 28px;
        height: 28px;
        padding: 0;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        cursor: pointer;
        background: transparent;
        overflow: hidden;
      }

      .custom-color-input::-webkit-color-swatch-wrapper {
        padding: 0;
      }

      .custom-color-input::-webkit-color-swatch {
        border: none;
        border-radius: 50%;
      }
    `;
    document.head.appendChild(style);
  }

  // 2. Tạo cây DOM của thanh điều khiển
  createPanel() {
    // Xóa panel cũ nếu có
    const existing = document.getElementById('live-customize-panel');
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.id = 'live-customize-panel';

    const optionsHtml = BRAND_OPTIONS.map(b => `
      <option value="${b.id}" ${b.id === this.currentBrand ? 'selected' : ''}>
        ${b.name}
      </option>
    `).join('');

    const colorDotsHtml = COLOR_PRESETS.map(c => `
      <button 
        type="button" 
        class="color-dot-btn" 
        data-color="${c.hex}" 
        title="${c.label} (${c.hex})"
        style="background-color: ${c.hex};"
      ></button>
    `).join('');

    container.innerHTML = `
      <!-- Nút mở lại khi đã thu nhỏ -->
      <button type="button" class="customizer-toggle-btn" id="customizer-open-btn" title="Mở bảng điều chỉnh">
        ⚙️
      </button>

      <!-- Khung panel điều khiển chính -->
      <div class="customizer-box" id="customizer-main-box">
        <div class="customizer-header">
          <span class="customizer-title">
            <span>⚙️</span> Live Customizer
          </span>
          <button type="button" class="customizer-close-btn" id="customizer-close-btn" title="Thu nhỏ">
            ✕
          </button>
        </div>

        <!-- 1. Dropdown chọn cấu hình JSON -->
        <div class="customizer-group">
          <label class="customizer-label" for="brand-selector">📂 Cấu hình Thương hiệu (JSON):</label>
          <select class="customizer-select" id="brand-selector">
            ${optionsHtml}
          </select>
        </div>

        <!-- 2. Thanh chọn đổi màu (Xanh lam, Vàng, Đỏ) -->
        <div class="customizer-group">
          <label class="customizer-label">🎨 Màu chủ đạo (Theme Color):</label>
          <div class="color-picker-row">
            ${colorDotsHtml}

            <!-- Ô chọn màu tự do -->
            <div class="custom-color-wrap" title="Chọn màu tùy chỉnh">
              <input type="color" class="custom-color-input" id="custom-color-picker" value="#1358e8">
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);
  }

  // 3. Gắn các sự kiện tương tác
  setupEvents() {
    const brandSelect = document.getElementById('brand-selector');
    const colorDots = document.querySelectorAll('.color-dot-btn');
    const colorPicker = document.getElementById('custom-color-picker');
    const closeBtn = document.getElementById('customizer-close-btn');
    const openBtn = document.getElementById('customizer-open-btn');
    const mainBox = document.getElementById('customizer-main-box');

    // A. Chuyển đổi giữa 3 cấu hình JSON
    if (brandSelect) {
      brandSelect.addEventListener('change', async (e) => {
        const selectedBrand = e.target.value;
        await this.switchBrand(selectedBrand);
      });
    }

    // B. Chọn 1 trong 3 màu có sẵn (Xanh lam, Vàng, Đỏ)
    colorDots.forEach(btn => {
      btn.addEventListener('click', () => {
        const hex = btn.getAttribute('data-color');
        this.applyCustomColor(hex);

        colorDots.forEach(d => d.classList.remove('is-active'));
        btn.classList.add('is-active');

        if (colorPicker) colorPicker.value = hex;
      });
    });

    // C. Chọn màu bất kỳ qua Color Picker
    if (colorPicker) {
      colorPicker.addEventListener('input', (e) => {
        const hex = e.target.value;
        this.applyCustomColor(hex);
        colorDots.forEach(d => d.classList.remove('is-active'));
      });
    }

    // D. Thu gọn / Mở bảng
    if (closeBtn && openBtn && mainBox) {
      closeBtn.addEventListener('click', () => {
        mainBox.classList.add('is-collapsed');
        openBtn.classList.add('is-visible');
      });

      openBtn.addEventListener('click', () => {
        mainBox.classList.remove('is-collapsed');
        openBtn.classList.remove('is-visible');
      });
    }
  }

  // 4. Hàm nạp lại dữ liệu Brand và vẽ lại trang
  async switchBrand(brandId) {
    this.currentBrand = brandId;

    // Cập nhật URL parameter mà không reload trang (?brand=...)
    const newUrl = `${window.location.pathname}?brand=${brandId}`;
    window.history.replaceState({ brand: brandId }, '', newUrl);

    try {
      // Dùng hàm từ core.js (được gắn vào window)
      if (typeof window.loadBrandData === 'function') {
        const data = await window.loadBrandData(brandId);
        if (data) {
          if (typeof window.applyTheme === 'function') {
            window.applyTheme(data.theme, data);
          }
          if (typeof window.renderPage === 'function') {
            await window.renderPage(data);
          }
          console.log(`✅ Đã chuyển đổi sang cấu hình: ${data.name} (${brandId}.json)`);
        } else {
          console.warn(`File data/${brandId}.json chưa sẵn sàng (đang do thành viên khác phụ trách).`);
        }
      }
    } catch (err) {
      console.warn(`Lỗi khi chuyển đổi thương hiệu ${brandId}:`, err);
    }
  }

  // 5. Hàm thay đổi biến màu CSS trên toàn trang
  applyCustomColor(hex) {
    this.currentColor = hex;
    const root = document.documentElement;

    // Cập nhật các Design Tokens màu sắc chính
    root.style.setProperty('--color-primary', hex);
    root.style.setProperty('--color-primary-hover', `color-mix(in srgb, ${hex} 82%, black)`);
    root.style.setProperty('--color-primary-light', `color-mix(in srgb, ${hex} 12%, white)`);
    root.style.setProperty('--color-primary-subtle', `color-mix(in srgb, ${hex} 8%, transparent)`);
    root.style.setProperty('--color-primary-soft', `color-mix(in srgb, ${hex} 28%, white)`);

    console.log(`🎨 Đã đổi màu chủ đạo sang: ${hex}`);
  }
}

// Khởi chạy khi DOM sẵn sàng
function initCustomize() {
  new LiveCustomizer();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomize);
} else {
  initCustomize();
}

export default LiveCustomizer;
