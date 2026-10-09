/**
 * COMPONENT: <wl-hero>
 * Dữ liệu 100% động từ JSON: Badge, Tiêu đề, Mô tả, Nút bấm, Checklist, Banner & Thống kê
 */

class WlHero extends HTMLElement {
  set config(val) {
    this._config = val;
  }
  get config() {
    return this._config;
  }

  set data(val) {
    this._data = val;
    this.render();
  }
  get data() {
    return this._data;
  }

  connectedCallback() {
    if (this._data) {
      this.render();
    }
  }

  render() {
    if (!this._data) return;

    const hero = this._data;
    const title = hero.title || '';
    const desc = hero.desc || '';
    const ctaText = hero.ctaText || 'Đặt lịch tư vấn';
    const secondaryCtaText = hero.secondaryCtaText || '';
    const studentImg = hero.image || '';
    const badge = hero.badge || '';
    const badgeTag = hero.badgeTag || '';

    // Tách dòng tiêu đề nếu có dấu phẩy hoặc dấu chấm để tạo 2 dòng (dòng 2 có màu nổi bật)
    let titleLine1 = title;
    let titleLine2 = '';

    if (title.includes(',')) {
      const parts = title.split(',');
      titleLine1 = parts[0].trim() + ',';
      titleLine2 = parts.slice(1).join(',').trim();
    } else if (title.includes('.')) {
      const parts = title.split('.');
      titleLine1 = parts[0].trim() + '.';
      titleLine2 = parts.slice(1).join('.').trim();
    }

    // Checklist động từ data
    const checklistItems = hero.checklist || hero.highlights || (hero.trustText ? [hero.trustText] : []);

    // Visual Showcase động từ data
    const windowTitle = hero.windowTitle || '';
    const windowBadge = hero.windowBadge || '';
    const mentor = hero.mentor || null;
    const partners = hero.partners || [];
    const stat1 = hero.floatingStat1 || null;
    const stat2 = hero.floatingStat2 || null;

    this.innerHTML = `
      <section class="hero-section" id="hero">
        <div class="container">
          <div class="hero-grid">
            
            <!-- CỘT TRÁI: Badge, Tiêu đề, Mô tả, 2 Nút CTA & Checklist -->
            <div class="hero-content">
              ${badge ? `
                <div class="hero-badge-wrap">
                  ${badgeTag ? `<span class="hero-badge-tag">${badgeTag}</span>` : ''}
                  <span class="hero-badge-text">${badge}</span>
                </div>
              ` : ''}

              <h1 class="hero-title">
                <span class="title-dark">${titleLine1}</span>
                ${titleLine2 ? `<span class="title-highlight">${titleLine2}</span>` : ''}
              </h1>

              ${desc ? `<p class="hero-desc">${desc}</p>` : ''}

              <div class="hero-actions">
                ${ctaText ? `
                  <a href="#contact" class="btn btn-hero-cta">
                    <span>${ctaText}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                ` : ''}

                ${secondaryCtaText ? `
                  <a href="#programs" class="btn btn-hero-secondary">
                    <span>${secondaryCtaText}</span>
                  </a>
                ` : ''}
              </div>

              <!-- Tiêu chí tích xanh dưới nút bấm (render động) -->
              ${checklistItems.length > 0 ? `
                <div class="hero-check-list">
                  ${checklistItems.map(item => `
                    <div class="check-item">
                      <span class="check-icon">✓</span>
                      <span>${item}</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>

            <!-- CỘT PHẢI: Visual Showcase Card & Floating Stats Động -->
            <div class="hero-visual">
              <!-- Quầng sáng hiệu ứng chiều sâu nền -->
              <div class="hero-glow-backdrop"></div>

              <!-- Khung Card Cửa Sổ Mô Phỏng Chính -->
              <div class="hero-banner-card">
                ${windowTitle ? `
                  <!-- Thanh điều hướng cửa sổ mô phỏng -->
                  <div class="hero-frame-header">
                    <div class="frame-window-dots">
                      <span class="dot dot-red"></span>
                      <span class="dot dot-yellow"></span>
                      <span class="dot dot-green"></span>
                    </div>
                    <div class="frame-window-title">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                      <span>${windowTitle}</span>
                    </div>
                    ${windowBadge ? `
                      <div class="frame-live-badge">
                        <span class="live-dot"></span>
                        <span>${windowBadge}</span>
                      </div>
                    ` : ''}
                  </div>
                ` : ''}

                <!-- Vùng ảnh chính kèm profile overlay nếu có -->
                <div class="hero-image-wrap">
                  ${studentImg ? `
                    <img src="${studentImg}" alt="${title}" class="hero-banner-img" loading="eager">
                  ` : ''}
                  
                  ${mentor ? `
                    <!-- Overlay thông tin mentor ở đáy ảnh -->
                    <div class="hero-image-overlay">
                      <div class="mentor-badge-info">
                        <div class="mentor-avatar-icon">${mentor.avatar || '🎯'}</div>
                        <div class="mentor-text">
                          <div class="mentor-name">${mentor.name || ''}</div>
                          <div class="mentor-role">${mentor.role || ''}</div>
                        </div>
                      </div>
                      ${mentor.rating ? `
                        <div class="mentor-rating">
                          <span class="stars">★★★★★</span>
                          <span class="rating-num">${mentor.rating}</span>
                        </div>
                      ` : ''}
                    </div>
                  ` : ''}
                </div>

                ${partners.length > 0 ? `
                  <!-- Dải doanh nghiệp đối tác tuyển dụng dưới đáy -->
                  <div class="hero-partners-bar">
                    <span class="partners-label">Doanh nghiệp liên kết:</span>
                    <div class="partners-tags">
                      ${partners.map(p => `<span class="partner-pill">${p}</span>`).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
              
              <!-- Floating Card 1 (render động) -->
              ${stat1 ? `
                <div class="floating-stat-card floating-card-top">
                  <div class="card-widget-header">
                    <div class="widget-avatar-box avatar-teal">
                      <span class="widget-icon-text">${stat1.icon || '★'}</span>
                    </div>
                    <div class="widget-details">
                      <div class="widget-title-row">
                        <strong class="widget-title">${stat1.title || ''}</strong>
                        ${stat1.badge ? `<span class="widget-badge-verify">${stat1.badge}</span>` : ''}
                      </div>
                      ${stat1.desc ? `<span class="widget-desc">${stat1.desc}</span>` : ''}
                    </div>
                  </div>
                  ${stat1.footer ? `
                    <div class="card-widget-footer">
                      <span class="widget-footer-shield">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                      </span>
                      <span class="widget-footer-text">${stat1.footer}</span>
                    </div>
                  ` : ''}
                </div>
              ` : ''}

              <!-- Floating Card 2 (render động) -->
              ${stat2 ? `
                <div class="floating-stat-card floating-card-bottom">
                  <div class="card-widget-header">
                    <div class="widget-avatar-box avatar-teal">
                      <span class="widget-icon-text">${stat2.icon || '✦'}</span>
                    </div>
                    <div class="widget-details">
                      <div class="widget-title-row">
                        <strong class="widget-title">${stat2.title || ''}</strong>
                        ${stat2.badge ? `<span class="widget-badge-verify">${stat2.badge}</span>` : ''}
                      </div>
                      ${stat2.desc ? `<span class="widget-desc">${stat2.desc}</span>` : ''}
                    </div>
                  </div>
                  ${stat2.footer ? `
                    <div class="card-widget-footer">
                      <span class="widget-footer-shield">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                      </span>
                      <span class="widget-footer-text">${stat2.footer}</span>
                    </div>
                  ` : ''}
                </div>
              ` : ''}

            </div>

          </div>
        </div>
      </section>
    `;
  }
}

// Đăng ký Custom Element
customElements.define('wl-hero', WlHero);
export default WlHero;
