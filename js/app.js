/**
 * Application Logic: js/app.js
 * Logic tương tác bổ sung, hiệu ứng cuộn trang mượt mà
 * (Việc nạp JSON và dựng section do js/core.js đảm nhiệm.)
 */
document.addEventListener("DOMContentLoaded", () => {
  const FALLBACK_OFFSET = 80;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Chiều cao header thực tế (nếu đo được), không thì dùng 80px như cũ
  function getHeaderOffset() {
    const header =
      document.querySelector("wl-header header") ||
      document.querySelector("wl-header");
    const h = header ? header.offsetHeight : 0;
    return h > 0 ? h : FALLBACK_OFFSET;
  }

  function findSection(hash) {
    try {
      return document.querySelector(hash);
    } catch (err) {
      return null; // hash không phải selector hợp lệ, vd "#1abc"
    }
  }

  function scrollToSection(section, smooth) {
    const top =
      section.getBoundingClientRect().top +
      window.pageYOffset -
      getHeaderOffset();
    window.scrollTo({
      top,
      behavior: smooth && !reduceMotion.matches ? "smooth" : "auto",
    });
  }

  // Smooth scroll cho các liên kết anchor nội bộ
  document.addEventListener("click", (e) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    )
      return;

    const target = e.target.closest('a[href^="#"]');
    if (!target) return;

    const hash = target.getAttribute("href");
    if (hash === "#" || hash === "") return;

    const section = findSection(hash);
    if (!section) return;

    e.preventDefault();
    scrollToSection(section, true);
    history.pushState(null, "", hash); // giữ link chia sẻ được, nút Back vẫn hoạt động
  });

  // Mở trang với sẵn #hash (vd index.html?brand=brand-c#faq):
  // section được dựng bất đồng bộ nên chờ nó xuất hiện rồi mới cuộn
  if (location.hash.length > 1) {
    const goToHash = () => {
      const section = findSection(location.hash);
      if (!section) return false;
      scrollToSection(section, false);
      return true;
    };

    if (!goToHash()) {
      const observer = new MutationObserver(() => {
        if (goToHash()) observer.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => observer.disconnect(), 3000);
    }
  }
});
