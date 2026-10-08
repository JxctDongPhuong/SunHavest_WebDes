/**
 * Module: js/customizer.js
 * Bảng điều khiển Tùy Chỉnh Giao Diện Trực Tiếp trên Trình Duyệt (JIT Live Customizer)
 * Cho phép đổi màu, đổi font, bật/tắt và di chuyển thứ tự section theo thời gian thực.
 */

export function setupLiveCustomizer(currentData, brandId, onDataUpdate) {
  // Tránh tạo trùng lặp
  if (document.getElementById('jit-customizer-drawer')) return;

  // 1. Tạo Drawer Panel
  const drawer = document.createElement('div');
  drawer.id = 'jit-customizer-drawer';
  drawer.innerHTML = `
    <div class="customizer-header">
      <div class="customizer-title">
        <span>⚙️</span>
        <strong>JIT Live Customizer</strong>
      </div>
      <button id="customizer-close-btn" class="customizer-close" title="Đóng bảng">✕</button>
    </div>

    <div class="customizer-body">
      <!-- Tab 1: Màu sắc & Giao diện -->
      <div class="customizer-group">
        <h4>🎨 Màu sắc chủ đạo (Tokens)</h4>
        <div class="customizer-row">
          <label for="cz-primary-color">Màu chính:</label>
          <div class="color-picker-wrap">
            <input type="color" id="cz-primary-color" value="${currentData.theme?.colorPrimary || '#1d4ed8'}">
            <span id="cz-primary-hex">${currentData.theme?.colorPrimary || '#1d4ed8'}</span>
          </div>
        </div>

        <div class="customizer-row">
          <label for="cz-bg-color">Màu nền trang:</label>
          <div class="color-picker-wrap">
            <input type="color" id="cz-bg-color" value="${currentData.theme?.colorBg || '#ffffff'}">
            <span id="cz-bg-hex">${currentData.theme?.colorBg || '#ffffff'}</span>
          </div>
        </div>
      </div>

      <!-- Tab 2: Phông chữ -->
      <div class="customizer-group">
        <h4>🔤 Phông chữ (Google Fonts)</h4>
        <div class="customizer-row">
          <label for="cz-font-select">Font hiển thị:</label>
          <select id="cz-font-select" class="customizer-select">
            <option value="Plus Jakarta Sans">Plus Jakarta Sans (Hiện đại)</option>
            <option value="Inter">Inter (Công nghệ chuẩn)</option>
            <option value="Poppins">Poppins (Trẻ trung, Hướng nghiệp)</option>
            <option value="Montserrat">Montserrat (Chắc chắn, Dạy nghề)</option>
            <option value="Space Grotesk">Space Grotesk (Tech độc đáo)</option>
            <option value="Roboto">Roboto (Phổ biến)</option>
          </select>
        </div>
      </div>

      <!-- Tab 3: Bố cục Sections (JIT Layout) -->
      <div class="customizer-group">
        <h4>📑 Bố cục & Thứ tự Section (JIT)</h4>
        <p class="customizer-hint">Tick để Ẩn/Hiện, bấm ▲/▼ để đổi thứ tự trực tiếp trên trang.</p>
        <div id="cz-sections-list" class="sections-manager-list">
          <!-- Render danh sách section động ở dưới -->
        </div>
      </div>

      <!-- Tab 4: Sửa nhanh Tiêu đề Hero -->
      <div class="customizer-group">
        <h4>✏️ Sửa nhanh nội dung</h4>
        <div class="customizer-field">
          <label for="cz-brand-name">Tên thương hiệu:</label>
          <input type="text" id="cz-brand-name" class="customizer-input" value="${currentData.name || ''}">
        </div>
        <div class="customizer-field" style="margin-top: 0.6rem;">
          <label for="cz-hero-title">Tiêu đề Hero chính:</label>
          <textarea id="cz-hero-title" class="customizer-textarea" rows="2">${currentData.hero?.title || ''}</textarea>
        </div>
      </div>
    </div>

    <div class="customizer-footer">
      <button id="cz-export-btn" class="cz-btn cz-btn-primary" title="Tải file JSON đã tùy chỉnh về máy">
        📥 Xuất file JSON
      </button>
      <button id="cz-reset-btn" class="cz-btn cz-btn-secondary" title="Khôi phục cấu hình gốc">
        🔄 Khôi phục
      </button>
    </div>
  `;

  document.body.appendChild(drawer);

  // 2. Thêm nút kích hoạt "Tùy chỉnh giao diện" vào Brand Switcher
  const switcher = document.getElementById('brand-switcher');
  if (switcher && !document.getElementById('customizer-toggle-btn')) {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'customizer-toggle-btn';
    toggleBtn.className = 'customizer-trigger-btn';
    toggleBtn.innerHTML = `⚙️ Tùy chỉnh trực tiếp`;
    toggleBtn.title = 'Mở bảng điều khiển Live Customizer';
    switcher.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', () => {
      drawer.classList.toggle('active');
    });
  }

  // 3. Xử lý nút Đóng
  const closeBtn = drawer.querySelector('#customizer-close-btn');
  closeBtn.addEventListener('click', () => {
    drawer.classList.remove('active');
  });

  // 4. Logic Đổi Màu Thực Tế (Live Color Picker)
  const primaryPicker = drawer.querySelector('#cz-primary-color');
  const primaryHex = drawer.querySelector('#cz-primary-hex');
  const bgPicker = drawer.querySelector('#cz-bg-color');
  const bgHex = drawer.querySelector('#cz-bg-hex');

  primaryPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    primaryHex.textContent = color;
    document.documentElement.style.setProperty('--color-primary', color);
    document.documentElement.style.setProperty('--color-primary-hover', adjustBrightness(color, -20));
    document.documentElement.style.setProperty('--color-primary-subtle', hexToRgba(color, 0.08));
    if (!currentData.theme) currentData.theme = {};
    currentData.theme.colorPrimary = color;
  });

  bgPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    bgHex.textContent = color;
    document.documentElement.style.setProperty('--color-bg', color);
    if (!currentData.theme) currentData.theme = {};
    currentData.theme.colorBg = color;
  });

  // 5. Logic Đổi Font Thực Tế (Live Font Select)
  const fontSelect = drawer.querySelector('#cz-font-select');
  if (currentData.theme?.fontHeading) {
    fontSelect.value = currentData.theme.fontHeading;
  }
  fontSelect.addEventListener('change', (e) => {
    const fontName = e.target.value;
    // Nạp link font Google động nếu chưa có
    const fontId = `google-font-${fontName.toLowerCase().replace(/\s+/g, '-')}`;
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700;800&display=swap`;
      document.head.appendChild(link);
    }
    document.documentElement.style.setProperty('--font-heading', `"${fontName}", sans-serif`);
    document.documentElement.style.setProperty('--font-body', `"${fontName}", sans-serif`);
    if (!currentData.theme) currentData.theme = {};
    currentData.theme.fontHeading = fontName;
  });

  // 6. Logic Quản Lý Section (Ẩn/Hiện & Đổi thứ tự)
  renderSectionManager(drawer, currentData);

  // 7. Logic Sửa Chữ Nhanh
  const brandNameInput = drawer.querySelector('#cz-brand-name');
  brandNameInput.addEventListener('input', (e) => {
    currentData.name = e.target.value;
    const headerEl = document.querySelector('wl-header');
    if (headerEl) headerEl.data = currentData;
    const footerEl = document.querySelector('wl-footer');
    if (footerEl) footerEl.data = currentData;
  });

  const heroTitleInput = drawer.querySelector('#cz-hero-title');
  heroTitleInput.addEventListener('input', (e) => {
    if (!currentData.hero) currentData.hero = {};
    currentData.hero.title = e.target.value;
    const heroEl = document.querySelector('wl-hero');
    if (heroEl) heroEl.data = currentData;
  });

  // 8. Xuất file JSON (Download JSON)
  const exportBtn = drawer.querySelector('#cz-export-btn');
  exportBtn.addEventListener('click', () => {
    const jsonStr = JSON.stringify(currentData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brandId}-custom.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert(`Đã xuất file ${brandId}-custom.json thành công! Bạn có thể lưu vào thư mục data/ để sử dụng.`);
  });

  // 9. Khôi phục mặc định
  const resetBtn = drawer.querySelector('#cz-reset-btn');
  resetBtn.addEventListener('click', () => {
    if (confirm('Khôi phục lại giao diện ban đầu của cấu hình này?')) {
      localStorage.removeItem(`custom_${brandId}`);
      window.location.reload();
    }
  });
}

/**
 * Hiển thị danh sách các Section để bật/tắt và di chuyển thứ tự
 */
function renderSectionManager(drawer, currentData) {
  const container = drawer.querySelector('#cz-sections-list');
  const page = document.body.dataset.page || 'home';
  const sections = currentData.pages?.[page] || [];

  container.innerHTML = sections.map((sec, index) => {
    const type = sec.type;
    const isFirst = index === 0;
    const isLast = index === sections.length - 1;

    return `
      <div class="cz-section-item" data-index="${index}" data-type="${type}">
        <label class="cz-section-checkbox-label">
          <input type="checkbox" checked class="cz-section-toggle" data-type="${type}">
          <span class="cz-section-name">wl-${type}</span>
        </label>
        <div class="cz-section-order-btns">
          <button class="cz-arrow-btn move-up" ${isFirst ? 'disabled' : ''} title="Di chuyển lên">▲</button>
          <button class="cz-arrow-btn move-down" ${isLast ? 'disabled' : ''} title="Di chuyển xuống">▼</button>
        </div>
      </div>
    `;
  }).join('');

  // Lắng nghe sự kiện Ẩn / Hiện section
  container.querySelectorAll('.cz-section-toggle').forEach(input => {
    input.addEventListener('change', (e) => {
      const type = e.target.dataset.type;
      const el = document.querySelector(`wl-${type}`);
      if (el) {
        el.style.display = e.target.checked ? 'block' : 'none';
      }
    });
  });

  // Lắng nghe sự kiện Đổi thứ tự (Lên / Xuống)
  container.querySelectorAll('.move-up').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const item = e.target.closest('.cz-section-item');
      const idx = parseInt(item.dataset.index, 10);
      if (idx > 0) {
        swapSections(currentData, page, idx, idx - 1);
        renderSectionManager(drawer, currentData);
      }
    });
  });

  container.querySelectorAll('.move-down').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const item = e.target.closest('.cz-section-item');
      const idx = parseInt(item.dataset.index, 10);
      if (idx < sections.length - 1) {
        swapSections(currentData, page, idx, idx + 1);
        renderSectionManager(drawer, currentData);
      }
    });
  });
}

/**
 * Hoán đổi vị trí của 2 section trong DOM và trong data.pages
 */
function swapSections(currentData, page, indexA, indexB) {
  const sections = currentData.pages[page];
  const app = document.querySelector('#app');
  
  const elA = document.querySelector(`wl-${sections[indexA].type}`);
  const elB = document.querySelector(`wl-${sections[indexB].type}`);

  if (elA && elB && app) {
    if (indexA < indexB) {
      // Chuyển xuống: đưa A ra sau B
      elB.after(elA);
    } else {
      // Chuyển lên: đưa A lên trước B
      elB.before(elA);
    }
  }

  // Hoán đổi trong dữ liệu JSON
  const temp = sections[indexA];
  sections[indexA] = sections[indexB];
  sections[indexB] = temp;
}

/**
 * Hàm phụ trợ: Chuyển mã Hex sang RGBA
 */
function hexToRgba(hex, alpha) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

/**
 * Hàm phụ trợ: Tăng/giảm độ sáng của màu Hex
 */
function adjustBrightness(hex, percent) {
  let num = parseInt(hex.replace('#', ''), 16);
  let amt = Math.round(2.55 * percent);
  let R = (num >> 16) + amt;
  let G = (num >> 8 & 0x00FF) + amt;
  let B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
}
