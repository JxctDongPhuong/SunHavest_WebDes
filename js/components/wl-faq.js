/**
 * Component: <wl-faq>
 * Người phụ trách: Simmy
 * Accordion hỏi đáp, mở/đóng bằng CSS transition (grid-template-rows).
 */
let wlFaqUid = 0;

class WlFaq extends HTMLElement {
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
    if (this._onClick) this.removeEventListener("click", this._onClick);
  }

  render() {
    if (!this._data) return;

    const config = this._config || {};
    const title = config.title || "Câu hỏi thường gặp";
    const subtitle = config.subtitle || "";
    const all = Array.isArray(this._data) ? this._data : this._data.items || [];
    const limit = Number(config.limit) > 0 ? Number(config.limit) : all.length;
    const items = all.slice(0, limit);
    const uid = ++wlFaqUid;

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
      <section class="section-wrapper section-faq" id="${esc(config.id || "faq")}">
        <div class="container">
          <div class="section-header">
            ${config.tag ? `<div class="section-tag">${esc(config.tag)}</div>` : ""}
            <h2 class="section-title">${esc(title)}</h2>
            ${subtitle ? `<p class="section-subtitle">${esc(subtitle)}</p>` : ""}
          </div>

          <div class="faq-list">
            ${items
              .map((item, i) => {
                const q = item.question || item.q || item.title || "";
                const a = item.answer || item.a || item.content || "";
                return `
                <div class="faq-item">
                  <h3 class="faq-q">
                    <button type="button" class="faq-btn" id="faq-btn-${uid}-${i}"
                            aria-expanded="false" aria-controls="faq-panel-${uid}-${i}">
                      <span>${esc(q)}</span>
                      <span class="faq-icon" aria-hidden="true"></span>
                    </button>
                  </h3>
                  <div class="faq-a" id="faq-panel-${uid}-${i}" role="region"
                       aria-labelledby="faq-btn-${uid}-${i}">
                    <div class="faq-a-inner"><p>${esc(a)}</p></div>
                  </div>
                </div>`;
              })
              .join("")}
          </div>
        </div>
      </section>
    `;

    this.setupEvents();
  }

  setupEvents() {
    if (this._onClick) this.removeEventListener("click", this._onClick);

    this._onClick = (e) => {
      const btn = e.target.closest(".faq-btn");
      if (!btn || !this.contains(btn)) return;

      const item = btn.closest(".faq-item");
      const willOpen = !item.classList.contains("is-open");

      // Chỉ mở 1 câu tại một thời điểm
      this.querySelectorAll(".faq-item.is-open").forEach((el) => {
        el.classList.remove("is-open");
        el.querySelector(".faq-btn").setAttribute("aria-expanded", "false");
      });

      if (willOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    };

    this.addEventListener("click", this._onClick);
  }
}

customElements.define("wl-faq", WlFaq);
