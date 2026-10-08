/**
 * Component: <wl-steps>
 * Người phụ trách: Simmy
 * Hiệu ứng: bóc thẻ khi cuộn (sticky + scroll progress)
 */
class WlSteps extends HTMLElement {
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
    this.teardown();
  }

  render() {
    if (!this._data) return;
    this.teardown();

    const config = this._config || {};
    const title = config.title || "Lộ trình học";
    const subtitle = config.subtitle || "";
    const items = Array.isArray(this._data)
      ? this._data
      : this._data.items || [];
    if (!items.length) {
      this.innerHTML = "";
      return;
    }

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
      <section class="section section-steps" id="${esc(config.id || "steps")}">
        <div class="container">
          <div class="section-head text-center">
            ${config.tag ? `<div class="tag-pill">${esc(config.tag)}</div>` : ""}
            <h2 class="section-title">${esc(title)}</h2>
            ${subtitle ? `<p class="section-subtitle">${esc(subtitle)}</p>` : ""}
          </div>
        </div>

        <div class="steps-pin" style="--steps-count:${items.length}">
          <div class="steps-sticky">
            <div class="steps-stack">
              ${items
                .map(
                  (item, i) => `
                <article class="steps-card" data-index="${i}">
                  <div class="steps-content">
                    <span class="steps-num">${esc(item.step)}</span>
                    <div class="steps-text">
                      <h3>${esc(item.title || item.name || `Bước ${i + 1}`)}</h3>
                      <p>${esc(item.desc || item.content || "")}</p>
                    </div>
                  </div>
                  <div class="steps-image">
                    ${item.image ? `<img src="${esc(item.image)}" alt="${esc(item.title || "Step image")}" loading="lazy" />` : ""}
                  </div>
                </article>
              `,
                )
                .join("")}
            </div>
            <ol class="steps-dots" aria-hidden="true">
              ${items.map((_, i) => `<li class="steps-dot${i === 0 ? " is-active" : ""}"></li>`).join("")}
            </ol>
          </div>
        </div>
      </section>
    `;

    this.setupEvents();
  }

  setupEvents() {
    const pin = this.querySelector(".steps-pin");
    const cards = Array.from(this.querySelectorAll(".steps-card"));
    const dots = Array.from(this.querySelectorAll(".steps-dot"));
    if (!pin || !cards.length) return;

    // Người dùng tắt animation -> xếp thẻ dọc bình thường
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.classList.add("is-static");
      return;
    }

    const n = cards.length;
    let ticking = false;
    let visible = false;

    const update = () => {
      ticking = false;
      const max = pin.offsetHeight - window.innerHeight;
      if (max <= 0) return;

      const progress = Math.min(
        1,
        Math.max(0, -pin.getBoundingClientRect().top / max),
      );
      const pos = progress * (n - 1); // 0 -> n-1, thẻ cuối ở lại

      cards.forEach((card, i) => {
        const cp = pos - i;
        let y, scale, dim;

        if (cp < 0) {
          // Thẻ chờ phía sau: nhỏ hơn, thụt xuống, tối hơn
          const d = Math.min(-cp, 3);
          scale = 1 - d * 0.05;
          y = `${d * 40}px`;
          dim = Math.min(d * 0.2, 0.6);
        } else {
          // Thẻ đang bị bóc lên
          scale = 1;
          y = `${-Math.min(cp, 1.2) * 130}%`;
          dim = 0;
        }

        card.style.transform = `translate3d(0, ${y}, 0) scale(${scale})`;
        card.style.setProperty("--dim", dim);
        card.style.opacity = cp >= 1 ? 0 : 1;
      });

      const active = Math.round(pos);
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i <= active));
    };

    const requestUpdate = () => {
      if (!visible || ticking) return;
      ticking = true;
      this._raf = requestAnimationFrame(update);
    };

    this._io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) requestUpdate();
      },
      { rootMargin: "100px 0px" },
    );
    this._io.observe(pin);

    this._onScroll = requestUpdate;
    window.addEventListener("scroll", this._onScroll, { passive: true });
    window.addEventListener("resize", this._onScroll);
  }

  teardown() {
    if (this._io) {
      this._io.disconnect();
      this._io = null;
    }
    if (this._onScroll) {
      window.removeEventListener("scroll", this._onScroll);
      window.removeEventListener("resize", this._onScroll);
      this._onScroll = null;
    }
    if (this._raf) {
      cancelAnimationFrame(this._raf);
      this._raf = null;
    }
  }
}

customElements.define("wl-steps", WlSteps);
