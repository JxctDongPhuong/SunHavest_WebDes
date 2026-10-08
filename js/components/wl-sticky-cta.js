/**
 * Component: <wl-sticky-cta>
 * Thanh kêu gọi hành động cố định ở đáy màn hình
 */
class WlStickyCta extends HTMLElement {
  set data(val) {
    this._data = val;
    this.render();
  }

  get data() {
    return this._data;
  }

  set config(val) {
    this._config = val;
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
    if (!this._data) return;

    const brandName = this._data.name || 'Academy';
    const ctaText = this._data.cta || 'Đăng ký ngay';

    this.innerHTML = `
      <div class="sticky-inner">
        <div class="sticky-text">
          Nhận học bổng & tư vấn lộ trình học tại ${brandName}
        </div>
        <a href="#contact" class="btn btn-primary" style="padding: 0.55rem 1.25rem; font-size: 0.88rem;">
          ${ctaText}
        </a>
      </div>
    `;
  }
}

customElements.define('wl-sticky-cta', WlStickyCta);
export default WlStickyCta;
