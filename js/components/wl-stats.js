/**
 * Component: <wl-stats>
 * Người phụ trách: MiniThinh (Dev UI / Data)
 * Hiển thị các chỉ số thống kê kết quả đào tạo & đầu ra của học viên
 */
class WlStats extends HTMLElement {
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
    if (!this._data) return;

    const config = this._config || {};
    const items = Array.isArray(this._data) ? this._data : (this._data.items || []);
    if (!items.length) return;

    // 5. Trả về HTML dùng các Class chung có sẵn trong css/components.css
    this.innerHTML = `
      <section id="${config.id || 'stats'}" class="section-wrapper stats-section">
        <div class="container">
          <div class="stats-grid">
            ${items.map(item => `
              <div class="stat-item">
                <div class="stat-value">${item.value || ''}</div>
                <div class="stat-label">${item.label || ''}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;

    // 6. Gắn sự kiện
    this.setupEvents();
  }

  setupEvents() {
    // Hiệu ứng tương tác nếu cần
  }
}

// BẮT BUỘC: Đăng ký custom element vào window
customElements.define('wl-stats', WlStats);
export default WlStats;

