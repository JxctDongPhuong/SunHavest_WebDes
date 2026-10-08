/**
 * Component: <wl-testimonials>
 * Thẻ review: avatar (ảnh hoặc chữ cái đầu), điểm sao, nơi đang làm việc.
 */
class WlTestimonials extends HTMLElement {
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

  render() {
    if (!this._data) return;

    const config = this._config || {};
    const title = config.title || "Học viên nói gì về chúng tôi";
    const subtitle = config.subtitle || "";
    const all = Array.isArray(this._data) ? this._data : this._data.items || [];
    const limit = Number(config.limit) > 0 ? Number(config.limit) : all.length;
    const items = all.slice(0, limit);

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

    const initials = (name) => {
      const parts = String(name || "?")
        .trim()
        .split(/\s+/);
      return esc((parts[parts.length - 1][0] || "?").toUpperCase());
    };

    const stars = (rating) => {
      const r = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
      return `<span class="tst-stars" role="img" aria-label="${r} trên 5 sao">${"★".repeat(r)}<span class="tst-stars-off">${"★".repeat(5 - r)}</span></span>`;
    };

    this.innerHTML = `
      <section class="section section-testimonials" id="${esc(config.id || "testimonials")}">
        <div class="container">
          <div class="section-head text-center">
            ${config.tag ? `<div class="tag-pill">${esc(config.tag)}</div>` : ""}
            <h2 class="section-title">${esc(title)}</h2>
            ${subtitle ? `<p class="section-subtitle">${esc(subtitle)}</p>` : ""}
          </div>

          <div class="tst-grid">
            ${items
              .map((item) => {
                const name = item.name || "Học viên";
                const role = item.role || item.job || "";
                const company = item.company || item.workplace || "";
                const course = item.course || "";
                const text = item.content || item.text || "";
                return `
                <figure class="tst-card">
                  ${stars(item.rating)}
                  <blockquote class="tst-quote">${esc(text)}</blockquote>
                  <figcaption class="tst-author">
                    ${
                      item.avatar
                        ? `<img class="tst-avatar" src="${esc(item.avatar)}" alt="" loading="lazy">`
                        : `<span class="tst-avatar tst-avatar-initial" aria-hidden="true">${initials(name)}</span>`
                    }
                    <span class="tst-meta">
                      <strong>${esc(name)}</strong>
                      ${role || company ? `<span>${esc([role, company].filter(Boolean).join(" tại "))}</span>` : ""}
                      ${course ? `<span class="tst-course">Khóa ${esc(course)}</span>` : ""}
                    </span>
                  </figcaption>
                </figure>`;
              })
              .join("")}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define("wl-testimonials", WlTestimonials);
