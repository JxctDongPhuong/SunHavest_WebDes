/**
 * COMPONENT: <wl-sticky-cta>
 * Thanh CTA cố định dưới màn hình, xuất hiện khi scroll qua Hero
 */

class WlStickyCta extends HTMLElement {
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

        const brand = this._data;
        const ctaText = brand.cta || 'Đặt lịch tư vấn';
        const tagline = brand.tagline || '';

        this.innerHTML = `
            <div class="sticky-cta-bar" id="sticky-cta">
                <div class="container sticky-cta-inner">
                    <div class="sticky-cta-left">
                        <span class="sticky-cta-pulse"></span>
                        <p class="sticky-cta-text">
                            <strong>${brand.stickyText || brand.slogan || 'Đăng ký nhận ưu đãi'}</strong>
                            ${tagline ? `<span>${tagline}</span>` : ''}
                        </p>
                    </div>
                    <div class="sticky-cta-actions">
                        <a href="#contact" class="btn-sticky-dismiss" id="sticky-dismiss">Để sau</a>
                        <a href="#contact" class="btn-sticky-cta">
                            <span>${ctaText}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Gắn logic scroll & dismiss sau khi render xong
        this._initBehavior();
    }

    _initBehavior() {
        const bar = this.querySelector('#sticky-cta');
        const dismissBtn = this.querySelector('#sticky-dismiss');

        if (!bar) return;

        // Chỉ hiện khi scroll xuống quá 400px
        const onScroll = () => {
            if (window.scrollY > 400) {
                bar.classList.add('is-visible');
            } else {
                bar.classList.remove('is-visible');
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        // Ẩn khi bấm "Để sau"
        if (dismissBtn) {
            dismissBtn.addEventListener('click', (e) => {
                e.preventDefault();
                bar.classList.add('is-dismissed');
                window.removeEventListener('scroll', onScroll);
            });
        }
    }
}

customElements.define('wl-sticky-cta', WlStickyCta);
export default WlStickyCta;
