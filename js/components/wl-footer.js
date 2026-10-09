/**
 * COMPONENT: <wl-footer>
 * Hiển thị chân trang: Brand Info, Cột liên kết động, Bản quyền & Mạng xã hội
 */

class WlFooter extends HTMLElement {
    set config(val) { this._config = val; }
    get config() { return this._config; }

    set data(val) {
        this._data = val;
        this.render();
    }
    get data() { return this._data; }

    connectedCallback() {
        if (this._data) this.render();
    }

    render() {
        if (!this._data) return;

        // 1. Trích xuất dữ liệu an toàn (Hỗ trợ cả trường hợp nhận data.footer hoặc root data)
        const rootData = window.appState?.data || {};
        const footerData = (this._data.columns || this._data.about || this._data.brandLinks)
            ? this._data
            : (this._data.footer || rootData.footer || {});

        const name = rootData.name || this._data.name || 'CareerPath';
        const favicon = rootData.favicon || rootData.logoUrl || this._data.favicon || this._data.logoUrl || '';
        const tagline = rootData.tagline || this._data.tagline || '';
        const about = footerData.about || '';
        const copyright = footerData.copyright || `© ${new Date().getFullYear()} ${name}. All rights reserved.`;
        const columns = footerData.columns || [];
        const brandLinks = footerData.brandLinks || [];

        // 2. Render các cột liên kết động
        const columnsHtml = columns.map(col => `
      <div class="footer-col">
        <h3 class="footer-col-title">${col.title}</h3>
        <ul class="footer-links">
          ${col.links.map(link => `
            <li>
              <a href="${link.href}">${link.label}</a>
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('');

        // 3. Render HTML tổng thể
        this.innerHTML = `
      <footer class="site-footer" id="footer">
        <div class="container">
          <!-- Phần trên: Grid gồm Cột Thương hiệu + Các cột Menu -->
          <div class="footer-grid">
            
            <!-- Cột 1: Thông tin thương hiệu & Giới thiệu -->
            <div class="footer-brand-col">
              <a href="#" class="footer-logo">
                ${favicon ? `<img src="${favicon}" alt="${name}" class="footer-logo-img" style="width: 28px; height: 28px; object-fit: contain;">` : ''}
                <span class="logo-text">${name}</span>
              </a>
              ${tagline ? `<p class="footer-tagline">${tagline}</p>` : ''}
              ${about ? `<p class="footer-about">${about}</p>` : ''}
              
              <!-- Mạng xã hội -->
              <div class="footer-socials">
                <a href="#" class="social-btn" aria-label="Facebook">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" class="social-btn" aria-label="LinkedIn">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="#" class="social-btn" aria-label="YouTube">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>

            <!-- Các cột điều hướng -->
            ${columnsHtml}

          </div>

          <!-- Thanh thương hiệu liên kết / Hệ sinh thái đối tác -->
          ${brandLinks.length > 0 ? `
            <div class="footer-brands-bar">
              <span class="footer-brands-label">Hệ sinh thái liên kết:</span>
              <div class="footer-brands-list">
                ${brandLinks.map(b => `
                  <a href="${b.href || '#'}" class="footer-brand-pill">
                    <span class="pill-dot"></span>
                    <span>${b.name}</span>
                  </a>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Phần dưới: Divider, Copyright & Back to Top -->
          <div class="footer-bottom">
            <p class="footer-copyright">${copyright}</p>
            <div class="footer-bottom-links">
              <a href="#">Điều khoản bảo mật</a>
              <span class="sep">•</span>
              <a href="#">Quy chế hoạt động</a>
              <span class="sep">•</span>
              <a href="#hero" class="back-to-top">Lên đầu trang ↑</a>
            </div>
          </div>
        </div>
      </footer>
    `;
    }
}

//
customElements.define('wl-footer', WlFooter);
export default WlFooter;
