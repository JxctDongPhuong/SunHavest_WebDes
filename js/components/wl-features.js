/**
 * Component: <wl-features>
 * Người phụ trách: MiniThinh (Dev UI / Data)
 * Hiển thị khối đặc điểm & phương pháp vượt trội dạng so le (alternating)
 */
class WlFeatures extends HTMLElement {
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
    const tag = config.tag || "";
    const title = config.title || "Lợi thế & Phương pháp vượt trội";
    const subtitle = config.subtitle || "";
    const items = Array.isArray(this._data)
      ? this._data
      : this._data.items || [];
    if (!items.length) return;

    const featuresHtml = items
      .map((item, idx) => {
        const isReverse = idx % 2 !== 0;
        const highlightsHtml = (item.highlights || [])
          .map(
            (hl) => `
        <li>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>${hl}</span>
        </li>
      `,
          )
          .join("");

        return `
        <div class="feature-item ${isReverse ? "reverse" : ""}">
          <div class="feature-content">
            <span class="feature-index">${item.index || "0" + (idx + 1)}</span>
            <h3 class="feature-title">${item.title || ""}</h3>
            <p class="feature-desc">${item.desc || ""}</p>
            ${highlightsHtml ? `<ul class="feature-highlights">${highlightsHtml}</ul>` : ""}
          </div>

          <div class="feature-media">
            <img src="${item.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=700&q=80"}" alt="${item.title || "Feature"}" loading="lazy">
          </div>
        </div>
      `;
      })
      .join("");

    // 5. Trả về HTML dùng các Class chung có sẵn trong css/components.css
    this.innerHTML = `
      <section id="${config.id || "features"}" class="section-wrapper">
        <div class="container">
          <div class="section-header">
            ${tag ? `<span class="section-tag">${tag}</span>` : ""}
            <h2 class="section-title">${title}</h2>
            ${subtitle ? `<p class="section-subtitle">${subtitle}</p>` : ""}
          </div>

          <div class="features-list">
            ${featuresHtml}
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
customElements.define("wl-features", WlFeatures);
export default WlFeatures;
