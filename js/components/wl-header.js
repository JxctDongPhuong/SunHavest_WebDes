// init 
class WlHeader extends HTMLElement {
    // getter and setter
    set config(val) {
        this._config = val;
        this.render();
    }
    get config() { return this._config }

    set data(val) {
        this._data = val;
        this.render();
    }
    get data() { return this._data }

    connectedCallback() {
        this.classList.add("")
    }

    render() {
        if (!this._data) return;
        const brandName = this._data.name || "CareerPath";
        const logoUrl = this._data.favicon ||
            this._data.logoUrl || "";
        const ctaText = this._data.cta || "Đặt Lịch Tư Vấn";
        const menuItems = this._data.menu || [];

        // traverse an array to create HTML
        const menuHtml = menuItems.map(item => {
            // Tính năng 2: Nếu có menu con -> tạo Dropdown
            if (item.children && item.children.length > 0) {
                const subMenuHtml = item.children.map(child => `
          <a href="${child.href || '#'}" class="dropdown-item">
            <strong class="dropdown-title">${child.label}</strong>
            ${child.desc ? `<p class="dropdown-desc">${child.desc}</p>` : ''}
          </a>
        `).join('');

                return `
          <li class="nav-item has-dropdown">
            <a href="${item.href || '#'}" class="nav-link dropdown-toggle">
              ${item.label}
              <span class="arrow-icon">▾</span>
            </a>
            <div class="dropdown-menu">
              ${subMenuHtml}
            </div>
          </li>
        `;
            }
            // Tính năng 1: Menu con không có -> tạo Link thường
            return `
        <li class="nav-item">
          <a href="${item.href || '#'}" class="nav-link">${item.label}</a>
        </li>
      `;
        }).join('');

        this.innerHTML = `
      <header class="site-header" id="site-header">
        <div class="container">
          <div class="header-inner">
            <!-- Logo & Brand Name -->
            <a href="#" class="brand-logo">
              ${logoUrl ? `<img src="${logoUrl}" alt="${brandName}" class="brand-logo-img">` : ''}
              <span class="brand-logo-text">${brandName}</span>
            </a>

            <!-- Menu Desktop -->
            <nav class="desktop-nav">
              <ul class="nav-list">
                ${menuHtml}
              </ul>
            </nav>

            <!-- Nút CTA & Nút Hamburger Mobile -->
            <div class="header-actions">
              <a href="#contact" class="btn btn-primary header-cta-btn">${ctaText}</a>
              <button class="hamburger-btn" id="hamburger-btn" aria-label="Menu">
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>
        </div>

        <!-- 🟢 Tính năng 3: Drawer trên Mobile -->
        <div class="drawer-backdrop" id="drawer-backdrop"></div>
        <div class="mobile-drawer" id="mobile-drawer">
          <div class="drawer-header">
            <span class="drawer-logo">${brandName}</span>
            <button class="drawer-close-btn" id="drawer-close-btn">✕</button>
          </div>
          <div class="drawer-body">
            <ul class="mobile-nav-list">
              ${menuHtml}
            </ul>
            <a href="#contact" class="btn btn-primary btn-block">${ctaText}</a>
          </div>
        </div>
      </header>
    `;

        this.setupEvents();
    }

    setupEvents() {
        // ... setup mobile drawer, CTA toggle ...

        // 🟢 Tính năng 4: Xử lý click ra ngoài để đóng dropdown
        document.addEventListener('click', (event) => {
            const activeDropdown = this.querySelector('.dropdown-menu.show');

            if (activeDropdown) {
                const toggle = activeDropdown.previousElementSibling;

                // Kiểm tra nếu click không phải vào toggle hoặc menu
                if (!toggle.contains(event.target) && !activeDropdown.contains(event.target)) {
                    toggle.classList.remove('active');
                    activeDropdown.classList.remove('show');
                }
            }
        });

        // 🟢 Tính năng 5: Xử lý link trong mobile drawer
        this.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileDrawer();
            });
        });
    }

    closeMobileDrawer() {
        const drawer = this.querySelector('.mobile-drawer');
        const backdrop = this.querySelector('.drawer-backdrop');
        drawer.classList.remove('active');
        backdrop.classList.remove('active');
    }
}

// Đăng ký thẻ <wl-header> với trình duyệt
customElements.define('wl-header', WlHeader);
export default WlHeader;
