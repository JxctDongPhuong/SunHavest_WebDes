/**
 * Module: customize.js
 * Nhiệm vụ:
 * 1. Tự động kiểm tra (scan) các file JSON trong thư mục data/ (không hardcode cố định danh sách).
 * 2. Tìm thấy bao nhiêu file JSON thì sinh bấy nhiêu tùy chọn thương hiệu trên màn hình.
 * 3. Kiểm tra nội dung bên trong file JSON xem có code hay không:
 *    - Nếu có code đầy đủ: Tự động lấy tên (data.name) và màu sắc (theme.colorPrimary) từ file JSON.
 *    - Nếu file trống / chưa có code: Hiển thị cảnh báo "(⚠️ Đang cập nhật)" ngay tại chỗ chọn brand.
 * 4. Cung cấp thanh chọn màu nhanh (Xanh lam, Vàng, Đỏ) và Color Picker thời gian thực.
 * 5. Luôn cố định (fixed) ở góc dưới bên trái màn hình dù cuộn chuột lên xuống.
 */

// Danh sách các ID tiềm năng để hệ thống tự động quét kiểm tra trong thư mục data/
const CANDIDATE_BRANDS = ['brand-a', 'brand-b', 'brand-c', 'brand-d', 'brand-e', 'brand-f'];

// 3 màu preset theo yêu cầu + mã màu
const COLOR_PRESETS = [
  { id: 'blue', label: 'Xanh lam', hex: '#1358e8' },
  { id: 'yellow', label: 'Vàng', hex: '#f59e0b' },
  { id: 'red', label: 'Đỏ', hex: '#ef4444' }
];

class LiveCustomizer {
  constructor() {
    window.customizerInstance = this;
    this.currentBrand = this.getInitialBrand();
    this.discoveredBrands = [];
    this.currentColor = null;
    this.isCollapsed = false;
    this.init();
  }

  // Lấy brand ban đầu từ URL parameter hoặc mặc định brand-b
  getInitialBrand() {
    const params = new URLSearchParams(window.location.search);
    return params.get('brand') || window.appState?.currentBrand || 'brand-b';
  }

  // Chuyển 'brand-a' -> 'Brand A', 'brand-b' -> 'Brand B'
  formatBrandId(id) {
    const letter = id.replace('brand-', '').toUpperCase();
    return `Brand ${letter}`;
  }

  async init() {
    // 1. Tự động quét kiểm tra tất cả các file JSON thực tế trong data/
    this.discoveredBrands = await this.scanBrandFiles();
    
    // 2. Tạo giao diện bảng điều khiển dựa trên số lượng file tìm được
    this.createPanel();
    
    // 3. Gắn các sự kiện tương tác
    this.setupEvents();

    // 4. Kiểm tra cảnh báo cho brand ban đầu
    this.updateWarningState();

    // 5. Nếu brand ban đầu chưa có code -> vẽ giao diện báo chưa có dữ liệu lên web!
    const initialBrandInfo = this.discoveredBrands.find(b => b.id === this.currentBrand);
    if (initialBrandInfo && !initialBrandInfo.hasCode) {
      if (typeof window.renderEmptyBrandState === 'function') {
        window.renderEmptyBrandState(this.currentBrand);
      }
    }
  }

  // ==========================================================
  // QUÉT & KIỂM TRA ĐỘNG CÁC FILE JSON (KHÔNG HARDCODE)
  // ==========================================================
  async scanBrandFiles() {
    const foundList = [];

    // Quét song song các file tiềm năng trong thư mục data/
    const checkPromises = CANDIDATE_BRANDS.map(async (id) => {
      try {
        const res = await fetch(`data/${id}.json`, { cache: 'no-cache' });
        
        // Nếu file KHÔNG tồn tại (404, 403,...) -> Bỏ qua hoàn toàn, không hiển thị
        if (!res.ok) return null;

        const text = await res.text();
        const trimmed = text.trim();

        // TRƯỜNG HỢP 1: File tồn tại nhưng KHÔNG CÓ CODE (0 bytes, chỉ có khoảng trắng, hoặc rỗng)
        if (!trimmed || trimmed === '{}' || trimmed === '[]') {
          return {
            id,
            hasCode: false,
            label: `${this.formatBrandId(id)} — (⚠️ Chưa có dữ liệu)`,
            displayName: this.formatBrandId(id),
            color: null,
            data: null,
            statusText: 'Chưa có code dữ liệu'
          };
        }

        // TRƯỜNG HỢP 2: File có nội dung, kiểm tra xem có parse được JSON và có cấu trúc hợp lệ không
        try {
          const json = JSON.parse(trimmed);

          // Một file cấu hình hợp lệ cần có ít nhất thông tin tên (name) và các trang/giao diện (pages hoặc theme)
          const hasValidContent = Boolean(
            json && 
            typeof json === 'object' && 
            json.name && 
            (json.pages || json.theme)
          );

          if (!hasValidContent) {
            // File tồn tại nhưng thiếu các trường cấu hình quan trọng -> Chưa có dữ liệu
            return {
              id,
              hasCode: false,
              label: `${json?.name || this.formatBrandId(id)} — (⚠️ Chưa có dữ liệu)`,
              displayName: json?.name || this.formatBrandId(id),
              color: json?.theme?.colorPrimary || null,
              data: json,
              statusText: 'Cấu hình chưa hoàn thiện'
            };
          }

          // File CÓ CODE ĐẦY ĐỦ: Lấy trực tiếp thông tin từ chính file JSON
          return {
            id,
            hasCode: true,
            label: `${this.formatBrandId(id)} — ${json.name}`,
            displayName: json.name,
            color: json.theme?.colorPrimary || null,
            data: json,
            statusText: 'Hoạt động'
          };

        } catch (syntaxErr) {
          // File có nội dung nhưng bị lỗi cú pháp JSON
          return {
            id,
            hasCode: false,
            label: `${this.formatBrandId(id)} — (⚠️ Lỗi cú pháp JSON)`,
            displayName: this.formatBrandId(id),
            color: null,
            data: null,
            statusText: 'Lỗi cú pháp JSON'
          };
        }

      } catch (networkErr) {
        return null;
      }
    });

    const results = await Promise.all(checkPromises);

    // Lọc lấy các file JSON thực tế tồn tại
    results.forEach(item => {
      if (item) foundList.push(item);
    });

    console.log(`🔍 [Live Customizer] Đã quét thư mục data/: Tìm thấy ${foundList.length} file JSON.`);
    return foundList;
  }

  // ==========================================================
  // TẠO GIAO DIỆN BẢNG ĐIỀU KHIỂN CỐ ĐỊNH Ở GÓC TRÁI
  // ==========================================================
  createPanel() {
    const existing = document.getElementById('live-customize-panel');
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.id = 'live-customize-panel';

    // Sinh danh sách <option> dựa trên số lượng file JSON thực tế quét được
    const optionsHtml = this.discoveredBrands.length > 0
      ? this.discoveredBrands.map(b => `
          <option 
            value="${b.id}" 
            class="${b.hasCode ? '' : 'is-updating'}"
            ${b.id === this.currentBrand ? 'selected' : ''}
          >
            ${b.label}
          </option>
        `).join('')
      : `<option value="">Không tìm thấy file JSON nào</option>`;

    // Sinh các nút màu tròn (Xanh lam, Vàng, Đỏ)
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
          <span class="customizer-count-badge" title="Số file JSON thực tế phát hiện được">
            ${this.discoveredBrands.length} files JSON
          </span>
          <button type="button" class="customizer-close-btn" id="customizer-close-btn" title="Thu nhỏ">
            ✕
          </button>
        </div>

        <!-- 1. Dropdown chọn cấu hình JSON (sinh động theo số file quét được) -->
        <div class="customizer-group">
          <label class="customizer-label" for="brand-selector">📂 Cấu hình Thương hiệu (JSON):</label>
          <select class="customizer-select" id="brand-selector">
            ${optionsHtml}
          </select>

          <!-- Hộp cảnh báo nếu Brand chưa có code -->
          <div class="brand-alert-banner is-hidden" id="brand-warning-box">
            <span>⚠️</span>
            <span id="brand-warning-text">Thương hiệu này chưa có code (Đang cập nhật).</span>
          </div>
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

  // ==========================================================
  // CẬP NHẬT TRẠNG THÁI CẢNH BÁO KHI CHỌN BRAND
  // ==========================================================
  updateWarningState() {
    const warningBox = document.getElementById('brand-warning-box');
    const warningText = document.getElementById('brand-warning-text');
    if (!warningBox || !warningText) return;

    const brandInfo = this.discoveredBrands.find(b => b.id === this.currentBrand);

    // Nếu brand không tồn tại hoặc KHÔNG CÓ CODE
    if (brandInfo && !brandInfo.hasCode) {
      warningText.textContent = `File ${brandInfo.id}.json chưa có code dữ liệu (Đang cập nhật).`;
      warningBox.classList.remove('is-hidden');
    } else {
      warningBox.classList.add('is-hidden');
    }
  }

  // ==========================================================
  // GẮN CÁC SỰ KIỆN TƯƠNG TÁC
  // ==========================================================
  setupEvents() {
    const brandSelect = document.getElementById('brand-selector');
    const colorDots = document.querySelectorAll('.color-dot-btn');
    const colorPicker = document.getElementById('custom-color-picker');
    const closeBtn = document.getElementById('customizer-close-btn');
    const openBtn = document.getElementById('customizer-open-btn');
    const mainBox = document.getElementById('customizer-main-box');

    // A. Chuyển đổi giữa các file JSON được tìm thấy
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

    // D. Thu gọn / Mở bảng điều khiển
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

  // ==========================================================
  // CHUYỂN ĐỔI THƯƠNG HIỆU & NẠP LẠI GIAO DIỆN
  // ==========================================================
  async switchBrand(brandId) {
    this.currentBrand = brandId;

    // Cập nhật URL parameter mà không reload trang (?brand=...)
    const newUrl = `${window.location.pathname}?brand=${brandId}`;
    window.history.replaceState({ brand: brandId }, '', newUrl);

    // Cập nhật cảnh báo nếu brand này chưa có code
    this.updateWarningState();

    const brandInfo = this.discoveredBrands.find(b => b.id === brandId);

    // NẾU THƯƠNG HIỆU NÀY CHƯA CÓ CODE / CHƯA CÓ DỮ LIỆU:
    // Vẫn chuyển vào brand đó nhưng web sẽ hiển thị lỗi chưa có dữ liệu!
    if (!brandInfo || !brandInfo.hasCode) {
      console.warn(`⚠️ [Live Customizer] Đã chuyển vào ${brandId} (Chưa có dữ liệu cấu hình).`);
      if (typeof window.renderEmptyBrandState === 'function') {
        window.renderEmptyBrandState(brandId);
      }
      return;
    }

    try {
      if (typeof window.loadBrandData === 'function') {
        const data = await window.loadBrandData(brandId);
        if (data) {
          if (typeof window.applyTheme === 'function') {
            window.applyTheme(data.theme, data);
          }
          if (typeof window.renderPage === 'function') {
            await window.renderPage(data);
          }
          console.log(`✅ [Live Customizer] Đã chuyển đổi sang: ${data.name} (${brandId}.json)`);
        }
      }
    } catch (err) {
      console.warn(`Lỗi khi nạp dữ liệu thương hiệu ${brandId}:`, err);
      if (typeof window.renderEmptyBrandState === 'function') {
        window.renderEmptyBrandState(brandId);
      }
    }
  }

  // ==========================================================
  // THAY ĐỔI BIẾN MÀU CSS CHỦ ĐẠO (:root)
  // ==========================================================
  applyCustomColor(hex) {
    this.currentColor = hex;
    const root = document.documentElement;

    root.style.setProperty('--color-primary', hex);
    root.style.setProperty('--color-primary-hover', `color-mix(in srgb, ${hex} 82%, black)`);
    root.style.setProperty('--color-primary-light', `color-mix(in srgb, ${hex} 12%, white)`);
    root.style.setProperty('--color-primary-subtle', `color-mix(in srgb, ${hex} 8%, transparent)`);
    root.style.setProperty('--color-primary-soft', `color-mix(in srgb, ${hex} 28%, white)`);

    console.log(`🎨 [Live Customizer] Đã đổi màu chủ đạo sang: ${hex}`);
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
