/**
 * ==============================================================================
 * COMPONENT: <wl-hero>
 * Thiết kế chuẩn Figma & Vanilla Web Component:
 * Badge nổi bật | Tiêu đề H1 (hỗ trợ tách 2 dòng màu) | Mô tả | 2 Nút CTA | Ảnh Banner + 2 Floating Stats
 * ==============================================================================
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
    const title = hero.title || 'Định hình sự nghiệp, tự tin bước vào tập đoàn mơ ước';
    const desc = hero.desc || 'Tư vấn lộ trình cá nhân hóa, chuẩn hóa hồ sơ ATS và huấn luyện phỏng vấn 1-1 cùng chuyên gia.';
    const ctaText = hero.ctaText || 'Đặt lịch tư vấn hướng nghiệp';
    const secondaryCtaText = hero.secondaryCtaText || 'Trắc nghiệm tính cách nghề';
    const studentImg = hero.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80';
    const badge = hero.badge || 'Chương trình Đồng hành Mùa tuyển dụng 2026';
    const badgeTag = hero.badgeTag || 'TƯ VẤN 1-1';

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

              <p class="hero-desc">${desc}</p>

              <div class="hero-actions">
                <a href="#contact" class="btn btn-hero-cta">
                  <span>${ctaText}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>

                ${secondaryCtaText ? `
                  <a href="#programs" class="btn btn-hero-secondary">
                    <span>${secondaryCtaText}</span>
                  </a>
                ` : ''}
              </div>

              <!-- Tiêu chí tích xanh dưới nút bấm -->
              <div class="hero-check-list">
                <div class="check-item">
                  <span class="check-icon">✓</span>
                  <span>Lộ trình cá nhân hóa</span>
                </div>
                <div class="check-item">
                  <span class="check-icon">✓</span>
                  <span>Học thực chiến & cố vấn 1-1</span>
                </div>
              </div>
            </div>

            <!-- CỘT PHẢI: Visual Showcase Card & 2 Floating Stats Sang Trọng -->
            <div class="hero-visual">
              <!-- Quầng sáng hiệu ứng chiều sâu nền -->
              <div class="hero-glow-backdrop"></div>

              <!-- Khung Card Cửa Sổ Mô Phỏng Chính -->
              <div class="hero-banner-card">
                
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
                    <span>Lớp Học & Tư Vấn 1-1 Trực Tuyến</span>
                  </div>
                  <div class="frame-live-badge">
                    <span class="live-dot"></span>
                    <span>Đang mở đăng ký</span>
                  </div>
                </div>

                <!-- Vùng ảnh chính kèm profile overlay -->
                <div class="hero-image-wrap">
                  <img src="${studentImg}" alt="Chuyên gia và học viên" class="hero-banner-img" loading="eager">
                  
                  <!-- Overlay thông tin chuyên gia / học viên ở đáy ảnh -->
                  <div class="hero-image-overlay">
                    <div class="mentor-badge-info">
                      <div class="mentor-avatar-icon">🎯</div>
                      <div class="mentor-text">
                        <div class="mentor-name">Cố Vấn Chuyên Gia 1-1</div>
                        <div class="mentor-role">Tối ưu hồ sơ & Mô phỏng phỏng vấn</div>
                      </div>
                    </div>
                    <div class="mentor-rating">
                      <span class="stars">★★★★★</span>
                      <span class="rating-num">4.9/5 (1.200+ đánh giá)</span>
                    </div>
                  </div>
                </div>

                <!-- Dải doanh nghiệp đối tác tuyển dụng dưới đáy -->
                <div class="hero-partners-bar">
                  <span class="partners-label">Doanh nghiệp liên kết:</span>
                  <div class="partners-tags">
                    <span class="partner-pill">NovaTech</span>
                    <span class="partner-pill">ApexCorp</span>
                    <span class="partner-pill">SkyGlobal</span>
                    <span class="partner-pill">NexusLab</span>
                  </div>
                </div>
              </div>
              
              <!-- 🌟 Floating Card 1 (Góc trên trái: Tỷ lệ vượt lọc ATS - Format giống hình ảnh) -->
              <div class="floating-stat-card floating-card-top">
                <div class="card-widget-header">
                  <div class="widget-avatar-box avatar-teal">
                    <svg class="widget-sparkle-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z"/>
                    </svg>
                    <span class="widget-dot"></span>
                  </div>
                  <div class="widget-details">
                    <div class="widget-title-row">
                      <strong class="widget-title">Tỷ Lệ Vượt Lọc</strong>
                      <span class="widget-badge-verify">✓ 95.6%</span>
                    </div>
                    <span class="widget-desc">Vượt qua hệ thống lọc tự động</span>
                  </div>
                </div>
                <div class="card-widget-footer">
                  <span class="widget-footer-shield">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </span>
                  <span class="widget-footer-text">Tối ưu từ khóa & chuẩn ATS</span>
                </div>
              </div>

              <!-- 🌟 Floating Card 2 (Góc dưới phải: HR Coach 1-1) -->
              <div class="floating-stat-card floating-card-bottom">
                <div class="card-widget-header">
                  <div class="widget-avatar-box avatar-teal">
                    <svg class="widget-sparkle-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z"/>
                    </svg>
                    <span class="widget-dot"></span>
                  </div>
                  <div class="widget-details">
                    <div class="widget-title-row">
                      <strong class="widget-title">HR Coach 1-1</strong>
                      <span class="widget-badge-verify">✓ Xác minh</span>
                    </div>
                    <span class="widget-desc">Cố vấn từ Giám đốc Nhân sự</span>
                  </div>
                </div>
                <div class="card-widget-footer">
                  <span class="widget-footer-shield">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </span>
                  <span class="widget-footer-text">Đồng hành tới khi nhận Offer</span>
                </div>
              </div>

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
