/**
 * Component: <wl-footer>
 * Chân trang chuyên nghiệp với cột liên kết, thông tin bản quyền và giới thiệu
 */
class WlFooter extends HTMLElement {
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
    const footerData = this._data.footer || {};
    const aboutText = footerData.about || 'Nền tảng đào tạo chuyên nghiệp chuẩn đầu ra.';
    const copyrightText = footerData.copyright || `© 2026 ${brandName}. All rights reserved.`;
    const columns = footerData.columns || [];

    const columnsHtml = columns.map(col => `
      <div class="footer-col">
        <h4>${col.title}</h4>
        <ul class="footer-links">
          ${(col.links || []).map(lnk => `
            <li><a href="${lnk.href || '#'}">${lnk.label}</a></li>
          `).join('')}
        </ul>
      </div>
    `).join('');

    this.innerHTML = `
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.85rem;">
              <div class="brand-icon-badge" style="width: 32px; height: 32px; font-size: 1rem;">
                ${brandName.charAt(0)}
              </div>
              <h3 style="margin-bottom: 0; color: #fff;">${brandName}</h3>
            </div>
            <p>${aboutText}</p>
          </div>

          ${columnsHtml}
        </div>

        <div class="footer-bottom">
          <div>${copyrightText}</div>
          <div style="display: flex; gap: 1.5rem;">
            <a href="#">Điều khoản sử dụng</a>
            <a href="#">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('wl-footer', WlFooter);
export default WlFooter;
