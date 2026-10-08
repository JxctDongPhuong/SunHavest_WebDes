/**
 * Component: <wl-features>
 * Section giới thiệu phương pháp & tính năng vượt trội dạng so le (alternating left/right)
 */
class WlFeatures extends HTMLElement {
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
    const tag = config.tag || 'Lợi thế vượt trội';
    const title = config.title || 'Phương pháp học tập thông minh';
    const subtitle = config.subtitle || 'Tối ưu thời gian và chi phí với mô hình đào tạo thực chiến';

    const featuresHtml = this._data.map((item, idx) => {
      const isReverse = idx % 2 !== 0;
      const highlightsHtml = (item.highlights || []).map(hl => `
        <li>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>${hl}</span>
        </li>
      `).join('');

      return `
        <div class="feature-item ${isReverse ? 'reverse' : ''}">
          <div class="feature-content">
            <span class="feature-index">${item.index || '0' + (idx + 1)}</span>
            <h3 class="feature-title">${item.title}</h3>
            <p class="feature-desc">${item.desc}</p>
            ${highlightsHtml ? `<ul class="feature-highlights">${highlightsHtml}</ul>` : ''}
          </div>

          <div class="feature-media">
            <img src="${item.image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=700&q=80'}" alt="${item.title}" loading="lazy">
          </div>
        </div>
      `;
    }).join('');

    this.innerHTML = `
      <section id="features" class="section-wrapper">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">${tag}</span>
            <h2 class="section-title">${title}</h2>
            <p class="section-subtitle">${subtitle}</p>
          </div>

          <div class="features-list">
            ${featuresHtml}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('wl-features', WlFeatures);
export default WlFeatures;
