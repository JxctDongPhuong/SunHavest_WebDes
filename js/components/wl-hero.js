/**
 * Component: <wl-hero>
 * Hero banner chính với tiêu đề ấn tượng, badges, nút CTA và thẻ nổi minh họa
 */
class WlHero extends HTMLElement {
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
    if (!this._data || !this._data.hero) return;

    const hero = this._data.hero;
    const badgeText = hero.badge || 'Chương trình đào tạo chất lượng cao';
    const badgeTag = hero.badgeTag || 'MỚI';
    const title = hero.title || 'Học thực chiến, bứt phá sự nghiệp';
    const desc = hero.desc || 'Chương trình học chuẩn quốc tế được công nhận bởi hàng trăm doanh nghiệp.';
    const ctaText = hero.ctaText || 'Bắt đầu ngay';
    const secondaryCtaText = hero.secondaryCtaText || 'Tìm hiểu thêm';
    const trustText = hero.trustText || 'Hơn 10.000 học viên đã tin tưởng lựa chọn';
    const heroImage = hero.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80';
    
    const pill1 = hero.floatingStat1 || { title: 'Cam kết chất lượng', desc: 'Đồng hành đến khi đạt mục tiêu', icon: '✓' };
    const pill2 = hero.floatingStat2 || { title: 'Mentor 1-1', desc: 'Chỉ dẫn tận tình', icon: '★' };

    this.innerHTML = `
      <div class="container">
        <div class="hero-grid">
          <div class="hero-content">
            <div class="hero-badge">
              <span class="hero-badge-tag">${badgeTag}</span>
              <span>${badgeText}</span>
            </div>

            <h1 class="hero-title">${title}</h1>

            <p class="hero-desc">${desc}</p>

            <div class="hero-actions">
              <a href="#contact" class="btn btn-primary">${ctaText}</a>
              <a href="#programs" class="btn btn-secondary">${secondaryCtaText}</a>
            </div>

            <div class="hero-trust">
              <div class="hero-avatars">
                <img class="hero-avatar" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="Student avatar">
                <img class="hero-avatar" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="Student avatar">
                <img class="hero-avatar" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="Student avatar">
              </div>
              <span class="hero-trust-text">${trustText}</span>
            </div>
          </div>

          <div class="hero-visual">
            <div class="hero-card-preview">
              <img class="hero-img" src="${heroImage}" alt="${title}">
              
              <div class="floating-pill top-right">
                <span style="font-size: 1.2rem; color: var(--color-primary);">${pill1.icon}</span>
                <div>
                  <div style="color: var(--color-text-main); font-weight: 700;">${pill1.title}</div>
                  <div style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 500;">${pill1.desc}</div>
                </div>
              </div>

              <div class="floating-pill bottom-left">
                <span style="font-size: 1.2rem; color: var(--color-primary);">${pill2.icon}</span>
                <div>
                  <div style="color: var(--color-text-main); font-weight: 700;">${pill2.title}</div>
                  <div style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 500;">${pill2.desc}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('wl-hero', WlHero);
export default WlHero;
