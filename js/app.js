/**
 * Application Logic: js/app.js
 * Logic tương tác bổ sung, hiệu ứng cuộn trang mượt mà
 */

document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll cho các liên kết anchor nội bộ
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href^="#"]');
    if (!target) return;

    const hash = target.getAttribute('href');
    if (hash === '#' || hash === '') return;

    const section = document.querySelector(hash);
    if (section) {
      e.preventDefault();
      const headerOffset = 80;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});
