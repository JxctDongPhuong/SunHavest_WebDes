/**
 * Component: <wl-cards>
 * Hiển thị danh mục khóa học / chương trình đào tạo dạng thẻ lưới
 */
class WlCards extends HTMLElement {
  set data(val) {
    this._data = val;
    this.render();
  }

  get data() {
    return this._data;
  }

  set config(val) {
    this._config = val;
    this.render();
  }

  get config() {
    return this._config;
  }

  connectedCallback() {
    if (this._data) {
      this.render();
    }
  }

  render() {
    if (!this._data || !Array.isArray(this._data)) return;

    const config = this._config || {};
    const tag = config.tag || "Chương trình đào tạo";
    const title = config.title || "Các khóa học nổi bật";
    const subtitle =
      config.subtitle ||
      "Chọn lộ trình học tập phù hợp nhất với mục tiêu của bạn";

    const cardsHtml = this._data
      .map(
        (item) => `
      <article class="course-card">
        <div class="card-media">
          <img src="${item.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"}" alt="${item.title}" loading="lazy">
          ${item.badge ? `<span class="card-badge">${item.badge}</span>` : ""}
        </div>

        <div class="card-body">
          <div class="card-meta">
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${item.duration || "Linh hoạt"}
            </span>
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              ${item.level || "Cơ bản"}
            </span>
          </div>

          <h3 class="card-title">${item.title}</h3>
          <p class="card-desc">${item.desc}</p>

          <div class="card-footer">
            <div class="card-price">${item.price || "Liên hệ"}</div>
            <a href="#contact" class="btn btn-outline" style="padding: 0.45rem 1rem; font-size: 0.85rem;">${item.action || "Đăng ký ngay"}</a>
          </div>
        </div>
      </article>
    `,
      )
      .join("");

    this.innerHTML = `
      <section id="programs" class="section-wrapper">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">${tag}</span>
            <h2 class="section-title">${title}</h2>
            <p class="section-subtitle">${subtitle}</p>
          </div>

          <div class="cards-grid">
            ${cardsHtml}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define("wl-cards", WlCards);
export default WlCards;
