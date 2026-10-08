/**
 * Component: <wl-contact>
 * Form đăng ký tư vấn & thông tin liên hệ với validate client-side
 */
class WlContact extends HTMLElement {
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
    if (!this._data) return;

    const config = this._config || {};
    const tag = config.tag || 'Tư vấn miễn phí';
    const title = config.title || 'Đăng ký nhận lộ trình học';
    const subtitle = config.subtitle || 'Để lại thông tin để chuyên gia liên hệ tư vấn trong 15 phút';

    const contact = this._data.contact || {};
    const phone = contact.phone || '024 8888 6789';
    const email = contact.email || 'hotro@edu.vn';
    const address = contact.address || 'Hà Nội & TP. Hồ Chí Minh';
    const programs = contact.programs || ['Chương trình cơ bản', 'Chương trình nâng cao'];

    const programOptions = programs.map(p => `<option value="${p}">${p}</option>`).join('');

    this.innerHTML = `
      <section id="contact" class="section-wrapper">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">${tag}</span>
            <h2 class="section-title">${title}</h2>
            <p class="section-subtitle">${subtitle}</p>
          </div>

          <div class="contact-box">
            <div class="contact-info-pane">
              <div>
                <h3>Thông Tin Liên Hệ</h3>
                <p style="margin-top: 0.75rem;">Chúng tôi luôn sẵn sàng hỗ trợ giải đáp mọi thắc mắc của bạn 24/7.</p>
              </div>

              <ul class="contact-meta-list">
                <li class="contact-meta-item">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <div>
                    <div style="font-size: 0.8rem; opacity: 0.8;">Hotline Tư Vấn</div>
                    <strong>${phone}</strong>
                  </div>
                </li>
                <li class="contact-meta-item">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <div>
                    <div style="font-size: 0.8rem; opacity: 0.8;">Email Hỗ Trợ</div>
                    <strong>${email}</strong>
                  </div>
                </li>
                <li class="contact-meta-item">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <div>
                    <div style="font-size: 0.8rem; opacity: 0.8;">Văn Phòng Đào Tạo</div>
                    <strong>${address}</strong>
                  </div>
                </li>
              </ul>

              <div style="font-size: 0.85rem; opacity: 0.85;">
                Cam kết bảo mật 100% thông tin cá nhân của người học.
              </div>
            </div>

            <div class="contact-form-pane">
              <div id="form-success-msg" class="form-alert-success" style="margin-bottom: 1.25rem;">
                ✓ Đăng ký thành công! Chuyên viên sẽ gọi điện tư vấn trong vòng 15 phút.
              </div>

              <form id="consultation-form" class="form-grid">
                <div class="form-group">
                  <label for="c-name">Họ và tên *</label>
                  <input type="text" id="c-name" class="form-input" placeholder="Nguyễn Văn A" required>
                </div>

                <div class="form-group">
                  <label for="c-phone">Số điện thoại *</label>
                  <input type="tel" id="c-phone" class="form-input" placeholder="0987 654 321" required pattern="[0-9]{9,11}">
                </div>

                <div class="form-group">
                  <label for="c-email">Email (tùy chọn)</label>
                  <input type="email" id="c-email" class="form-input" placeholder="email@example.com">
                </div>

                <div class="form-group">
                  <label for="c-program">Khóa học bạn quan tâm</label>
                  <select id="c-program" class="form-select">
                    ${programOptions}
                  </select>
                </div>

                <div class="form-group">
                  <label for="c-message">Ghi chú hoặc mục tiêu của bạn</label>
                  <textarea id="c-message" class="form-textarea" rows="3" placeholder="Ví dụ: Chưa có nền tảng, muốn chuyển ngành trong 6 tháng..."></textarea>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.9rem;">
                  Gửi Thông Tin Đăng Ký
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    `;

    // Client-side form handling
    const form = this.querySelector('#consultation-form');
    const successMsg = this.querySelector('#form-success-msg');
    if (form && successMsg) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        successMsg.style.display = 'block';
        form.reset();
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
  }
}

customElements.define('wl-contact', WlContact);
export default WlContact;
