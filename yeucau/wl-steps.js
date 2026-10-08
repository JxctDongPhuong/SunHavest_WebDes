/**
 * Component: <wl-steps>
 * Phụ trách: Simmy (Frontend Dev 2 - Interactions & Conversion)
 * Mục tiêu: Hiển thị lộ trình 3-4 bước thành công với đường nối trực quan (Connector Line)
 */
class WlSteps extends HTMLElement {
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

    // Chuẩn hóa dữ liệu: hỗ trợ cả mảng trực tiếp và object bọc { items: [...] } / { steps: [...] }
    let rawSteps = [];
    if (Array.isArray(this._data)) {
      rawSteps = this._data;
    } else if (Array.isArray(this._data.items)) {
      rawSteps = this._data.items;
    } else if (Array.isArray(this._data.steps)) {
      rawSteps = this._data.steps;
    }

    if (rawSteps.length === 0) return;

    const config = this._config || {};
    const tag = config.tag || 'Lộ trình thành công';
    const title = config.title || 'Các bước chinh phục mục tiêu';
    const subtitle = config.subtitle || 'Quy trình tinh gọn & bài bản giúp bạn tự tin làm chủ sự nghiệp';

    const stepsHtml = rawSteps.map((step, index) => {
      const stepNum = step.num || `0${index + 1}`;
      const isLast = index === rawSteps.length - 1;

      return `
        <div class="step-item ${isLast ? 'is-last' : ''}">
          <div class="step-indicator">
            <div class="step-badge">
              <span class="step-num-text">${stepNum}</span>
            </div>
            ${!isLast ? '<div class="step-connector-line" aria-hidden="true"></div>' : ''}
          </div>
          
          <div class="step-card">
            <div class="step-card-header">
              <span class="step-order-pill">Bước ${index + 1}</span>
            </div>
            <h3 class="step-title">${step.title || 'Tiêu đề bước'}</h3>
            <p class="step-desc">${step.desc || 'Mô tả chi tiết bước thực hiện.'}</p>
          </div>
        </div>
      `;
    }).join('');

    this.innerHTML = `
      <style>
        wl-steps {
          display: block;
        }

        .steps-timeline-track {
          display: grid;
          grid-template-columns: repeat(${rawSteps.length}, 1fr);
          gap: 1.5rem;
          position: relative;
          margin-top: 2.5rem;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .step-indicator {
          display: flex;
          align-items: center;
          position: relative;
          margin-bottom: 1.5rem;
        }

        .step-badge {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: var(--color-primary, #1d4ed8);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-heading, inherit);
          font-size: 1.25rem;
          font-weight: 800;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
          position: relative;
          z-index: 2;
          flex-shrink: 0;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .step-item:hover .step-badge {
          transform: scale(1.1);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
        }

        .step-connector-line {
          position: absolute;
          left: 52px;
          right: -1.5rem;
          top: 50%;
          transform: translateY(-50%);
          height: 3px;
          background: linear-gradient(90deg, var(--color-primary, #1d4ed8) 0%, rgba(200, 210, 225, 0.5) 100%);
          z-index: 1;
        }

        .step-card {
          background: var(--color-surface, #ffffff);
          border: 1px solid var(--color-border, #e2e8f0);
          border-radius: var(--radius-lg, 16px);
          padding: 1.75rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .step-item:hover .step-card {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
          border-color: var(--color-primary, #1d4ed8);
        }

        .step-order-pill {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-primary, #1d4ed8);
          background: var(--color-primary-light, rgba(29, 78, 216, 0.08));
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
          margin-bottom: 0.25rem;
        }

        .step-title {
          font-family: var(--font-heading, inherit);
          font-size: 1.15rem;
          font-weight: 700;
          line-height: 1.4;
          color: var(--color-text, #0f172a);
          margin: 0;
        }

        .step-desc {
          font-size: 0.92rem;
          line-height: 1.6;
          color: var(--color-text-muted, #64748b);
          margin: 0;
        }

        /* Responsive cho máy tính bảng và điện thoại */
        @media (max-width: 900px) {
          .steps-timeline-track {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding-left: 1rem;
          }

          .step-item {
            flex-direction: row;
            gap: 1.5rem;
          }

          .step-indicator {
            flex-direction: column;
            margin-bottom: 0;
          }

          .step-connector-line {
            position: absolute;
            left: 50%;
            top: 52px;
            bottom: -2rem;
            right: auto;
            width: 3px;
            height: auto;
            transform: translateX(-50%);
            background: linear-gradient(180deg, var(--color-primary, #1d4ed8) 0%, rgba(200, 210, 225, 0.5) 100%);
          }

          .step-item.is-last .step-connector-line {
            display: none;
          }
        }
      </style>

      <section id="steps" class="section-wrapper">
        <div class="container">
          <div class="section-header text-center">
            <span class="section-tag">${tag}</span>
            <h2 class="section-title">${title}</h2>
            <p class="section-subtitle">${subtitle}</p>
          </div>

          <div class="steps-timeline-track">
            ${stepsHtml}
          </div>
        </div>
      </section>
    `;
  }
}

// Đăng ký Custom Element vào window
if (!customElements.get('wl-steps')) {
  customElements.define('wl-steps', WlSteps);
}
