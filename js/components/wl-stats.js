/**
 * Component: <wl-stats>
 * Bảng thống kê các con số ấn tượng về kết quả đào tạo & đầu ra của học viên
 */
class WlStats extends HTMLElement {
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

    const statsHtml = this._data.map(item => `
      <div class="stat-item">
        <div class="stat-value">${item.value}</div>
        <div class="stat-label">${item.label}</div>
      </div>
    `).join('');

    this.innerHTML = `
      <section class="section-wrapper" style="padding-top: 3.5rem; padding-bottom: 3.5rem;">
        <div class="container">
          <div class="stats-grid">
            ${statsHtml}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('wl-stats', WlStats);
export default WlStats;
