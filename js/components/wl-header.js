/**
 * Component: <wl-header>
 * Thanh điều hướng chính của website (Logo, Mega/Dropdown menu, Nút CTA, Mobile Drawer)
 */
class WlHeader extends HTMLElement {
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

    const brandName = this._data.name || 'Education';
    const menuItems = this._data.menu || [];
    const ctaText = this._data.cta || 'Đăng ký ngay';
    const firstChar = brandName.charAt(0);

    const menuHtml = menuItems.map(item => {
      const hasChildren = item.children && item.children.length > 0;
      if (hasChildren) {
        const subItems = item.children.map(child => `
          <li class="dropdown-item">
            <a href="${child.href || '#'}">
              <span class="dropdown-item-title">${child.label}</span>
              ${child.desc ? `<span class="dropdown-item-desc">${child.desc}</span>` : ''}
            </a>
          </li>
        `).join('');

        return `
          <li class="nav-item">
            <a href="${item.href || '#'}" class="nav-link">
              ${item.label}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </a>
            <ul class="dropdown-menu">
              ${subItems}
            </ul>
          </li>
        `;
      }
      return `
        <li class="nav-item">
          <a href="${item.href || '#'}" class="nav-link">${item.label}</a>
        </li>
      `;
    }).join('');

    this.innerHTML = `
      <div class="container">
        <div class="header-inner">
          <a href="#" class="brand-logo-wrap">
            <div class="brand-icon-badge">${firstChar}</div>
            <span>${brandName}</span>
          </a>

          <nav>
            <ul class="nav-desktop">
              ${menuHtml}
            </ul>
          </nav>

          <div class="header-actions">
            <a href="#contact" class="btn btn-primary">${ctaText}</a>
            <button class="mobile-toggle" aria-label="Mở menu" id="mobile-toggle-btn">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      <div class="mobile-nav-drawer" id="mobile-drawer">
        <ul class="mobile-nav-list">
          ${menuItems.map(item => `
            <li>
              <a href="${item.href || '#'}" class="nav-link mobile-link">${item.label}</a>
            </li>
          `).join('')}
          <li style="margin-top: 1rem;">
            <a href="#contact" class="btn btn-primary mobile-link" style="width: 100%;">${ctaText}</a>
          </li>
        </ul>
      </div>
    `;

    // Mobile drawer toggle behavior
    const toggleBtn = this.querySelector('#mobile-toggle-btn');
    const drawer = this.querySelector('#mobile-drawer');
    if (toggleBtn && drawer) {
      toggleBtn.addEventListener('click', () => {
        drawer.classList.toggle('active');
      });
      // Close mobile drawer on clicking any link
      this.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
          drawer.classList.remove('active');
        });
      });
    }
  }
}

customElements.define('wl-header', WlHeader);
export default WlHeader;
