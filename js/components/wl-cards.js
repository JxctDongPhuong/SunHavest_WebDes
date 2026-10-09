/**
 * Component: <wl-cards>
 * Người phụ trách: MiniThinh (Dev UI / Data)
 * Hiển thị danh mục khóa học / gói đào tạo dạng lưới thẻ responsive
 */
class WlCards extends HTMLElement {
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
    const tag = config.tag || '';
    const title = config.title || 'Chương trình & Khóa học đào tạo';
    const subtitle = config.subtitle || '';
    const items = Array.isArray(this._data) ? this._data : (this._data.items || []);
    if (!items.length) return;

    const cardsHtml = items.map(item => `
      <article class="course-card">
        <div class="card-media">
          <img src="${item.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'}" alt="${item.title || 'Khóa học'}" loading="lazy">
          ${item.badge ? `<span class="card-badge">${item.badge}</span>` : ''}
        </div>

        <div class="card-body">
          <div class="card-meta">
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${item.duration || 'Linh hoạt'}
            </span>
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              ${item.level || 'Cơ bản'}
            </span>
          </div>

          <h3 class="card-title">${item.title || ''}</h3>
          <p class="card-desc">${item.desc || ''}</p>

          <div class="card-footer">
            <div class="card-price">${item.price || 'Liên hệ'}</div>
            <a href="#contact" class="btn btn-outline" style="padding: 0.45rem 1rem; font-size: 0.85rem;">${item.action || 'Đăng ký ngay'}</a>
          </div>
        </div>
      </article>
    `).join('');

    // 5. Trả về HTML dùng các Class chung có sẵn trong css/components.css
    this.innerHTML = `
      <section id="${config.id || 'programs'}" class="section-wrapper">
        <div class="container">
          <div class="section-header">
            ${tag ? `<span class="section-tag">${tag}</span>` : ''}
            <h2 class="section-title">${title}</h2>
            ${subtitle ? `<p class="section-subtitle">${subtitle}</p>` : ''}
          </div>

          <div class="cards-grid">
            ${cardsHtml}
          </div>
        </div>
      </section>
    `;

    // 6. Gắn sự kiện
    this.setupEvents();
  }

  setupEvents() {
    // Sự kiện tương tác nếu có
  }
}

// BẮT BUỘC: Đăng ký custom element vào window
customElements.define('wl-cards', WlCards);
export default WlCards;

