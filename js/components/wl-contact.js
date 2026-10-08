/**
 * Component: <wl-contact>
 * Form đăng ký tư vấn: validate họ tên, số điện thoại VN, email; báo gửi thành công.
 */
class WlContact extends HTMLElement {
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
    if (this._data) this.render();
  }

  disconnectedCallback() {
    clearTimeout(this._timer);
  }

  render() {
    if (!this._data) return;

    const config = this._config || {};
    const d = this._data || {};
    const title = config.title || d.title || "Đăng ký tư vấn miễn phí";
    const subtitle = config.subtitle || d.subtitle || "";
    const perks = Array.isArray(d.perks) ? d.perks : [];
    const programs = Array.isArray(d.programs) ? d.programs : [];
    const submitLabel = d.submitLabel || "Gửi đăng ký";

    const esc = (s) =>
      String(s ?? "").replace(
        /[&<>"']/g,
        (c) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[c],
      );

    this.innerHTML = `
      <section class="section section-contact" id="${esc(config.id || "contact")}">
        <div class="container">
          <div class="ct-layout">
            <div class="ct-info">
              ${config.tag ? `<div class="tag-pill">${esc(config.tag)}</div>` : ""}
              <h2 class="section-title">${esc(title)}</h2>
              ${subtitle ? `<p class="section-subtitle">${esc(subtitle)}</p>` : ""}
              ${perks.length ? `<ul class="ct-perks">${perks.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
              <dl class="ct-channels">
                ${d.hotline ? `<div><dt>Hotline</dt><dd><a href="tel:${esc(String(d.hotline).replace(/\s/g, ""))}">${esc(d.hotline)}</a></dd></div>` : ""}
                ${d.email ? `<div><dt>Email</dt><dd><a href="mailto:${esc(d.email)}">${esc(d.email)}</a></dd></div>` : ""}
                ${d.address ? `<div><dt>Địa chỉ</dt><dd>${esc(d.address)}</dd></div>` : ""}
              </dl>
            </div>

            <div class="ct-panel">
              <form class="ct-form" novalidate>
                <div class="ct-field">
                  <label for="ct-name">Họ và tên</label>
                  <input id="ct-name" name="name" type="text" autocomplete="name" placeholder="Nguyễn Văn A" aria-describedby="ct-name-err">
                  <p class="ct-error" id="ct-name-err" role="alert"></p>
                </div>
                <div class="ct-field">
                  <label for="ct-phone">Số điện thoại</label>
                  <input id="ct-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="0912 345 678" aria-describedby="ct-phone-err">
                  <p class="ct-error" id="ct-phone-err" role="alert"></p>
                </div>
                <div class="ct-field">
                  <label for="ct-email">Email <span class="ct-opt">(không bắt buộc)</span></label>
                  <input id="ct-email" name="email" type="email" autocomplete="email" placeholder="ban@email.com" aria-describedby="ct-email-err">
                  <p class="ct-error" id="ct-email-err" role="alert"></p>
                </div>
                ${
                  programs.length
                    ? `
                <div class="ct-field">
                  <label for="ct-program">Nghề bạn quan tâm</label>
                  <select id="ct-program" name="program">
                    <option value="">Chưa chọn, cần tư vấn thêm</option>
                    ${programs.map((p) => `<option value="${esc(p)}">${esc(p)}</option>`).join("")}
                  </select>
                </div>`
                    : ""
                }
                <div class="ct-field">
                  <label for="ct-note">Lời nhắn <span class="ct-opt">(không bắt buộc)</span></label>
                  <textarea id="ct-note" name="note" rows="3" placeholder="Bạn muốn hỏi điều gì?"></textarea>
                </div>
                <button type="submit" class="btn btn-primary ct-submit">${esc(submitLabel)}</button>
              </form>

              <div class="ct-success" role="status" hidden>
                <div class="ct-success-icon" aria-hidden="true">✓</div>
                <h3>${esc(d.successTitle || "Đã nhận đăng ký")}</h3>
                <p>${esc(d.successMessage || "Tư vấn viên sẽ gọi cho bạn trong vòng 24 giờ làm việc.")}</p>
                <button type="button" class="ct-again">Gửi đăng ký khác</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    this.setupEvents();
  }

  // Trả về chuỗi lỗi, hoặc '' nếu hợp lệ
  validate(field, value) {
    const v = String(value || "").trim();
    if (field === "name") {
      if (!v) return "Nhập họ và tên của bạn.";
      if (v.length < 2) return "Họ và tên cần ít nhất 2 ký tự.";
    }
    if (field === "phone") {
      if (!v) return "Nhập số điện thoại để tư vấn viên liên hệ.";
      const clean = v.replace(/[\s.\-]/g, "");
      if (!/^(0|\+?84)(3|5|7|8|9)\d{8}$/.test(clean)) {
        return "Số điện thoại chưa đúng. Ví dụ: 0912345678.";
      }
    }
    if (field === "email" && v) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))
        return "Email chưa đúng định dạng. Ví dụ: ban@email.com.";
    }
    return "";
  }

  setupEvents() {
    const form = this.querySelector(".ct-form");
    const success = this.querySelector(".ct-success");
    const submitBtn = this.querySelector(".ct-submit");
    if (!form) return;

    const showError = (name, msg) => {
      const input = form.elements[name];
      const err = this.querySelector(`#ct-${name}-err`);
      if (!input || !err) return;
      err.textContent = msg;
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      input.classList.toggle("is-invalid", Boolean(msg));
    };

    ["name", "phone", "email"].forEach((name) => {
      const input = form.elements[name];
      // Kiểm tra khi rời ô; xóa lỗi ngay khi người dùng sửa
      input.addEventListener("blur", () =>
        showError(name, this.validate(name, input.value)),
      );
      input.addEventListener("input", () => {
        if (input.classList.contains("is-invalid"))
          showError(name, this.validate(name, input.value));
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let firstInvalid = null;
      ["name", "phone", "email"].forEach((name) => {
        const msg = this.validate(name, form.elements[name].value);
        showError(name, msg);
        if (msg && !firstInvalid) firstInvalid = form.elements[name];
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const payload = {
        name: form.elements.name.value.trim(),
        phone: form.elements.phone.value.replace(/[\s.\-]/g, ""),
        email: form.elements.email.value.trim(),
        program: form.elements.program ? form.elements.program.value : "",
        note: form.elements.note.value.trim(),
      };

      submitBtn.disabled = true;
      const oldLabel = submitBtn.textContent;
      submitBtn.textContent = "Đang gửi…";

      // Giả lập gửi. Khi có backend, thay bằng fetch() tại đây.
      this._timer = setTimeout(() => {
        this.dispatchEvent(
          new CustomEvent("wl-contact:submit", {
            detail: payload,
            bubbles: true,
          }),
        );
        form.hidden = true;
        success.hidden = false;
        success.querySelector("h3").focus?.();
        submitBtn.disabled = false;
        submitBtn.textContent = oldLabel;
      }, 700);
    });

    this.querySelector(".ct-again").addEventListener("click", () => {
      form.reset();
      ["name", "phone", "email"].forEach((n) => showError(n, ""));
      success.hidden = true;
      form.hidden = false;
      form.elements.name.focus();
    });
  }
}

customElements.define("wl-contact", WlContact);
