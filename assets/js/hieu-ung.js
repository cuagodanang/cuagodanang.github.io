/* Hiệu ứng chuyển động — Cửa Gỗ Đà Nẵng
   1. Thanh tiến trình cuộn trang
   2. Ảnh lớn trôi nhẹ khi cuộn (parallax)
   3. Số liệu đếm dần khi hiện ra
   4. Chuyển trang mờ dần
   Tất cả tắt khi người xem bật "Giảm chuyển động" trong hệ điều hành. */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  document.documentElement.classList.add('fx');

  /* 1. Thanh tiến trình cuộn */
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.append(bar);

  /* 2. Parallax: ảnh hero + ảnh banner lớn */
  const heroMedia = document.querySelector('.hero__media');
  const banners = [...document.querySelectorAll('main > section > figure.reveal')]
    .filter(f => !f.classList.contains('card'))
    .map(f => { f.classList.add('parallax'); return f.querySelector('img'); })
    .filter(Boolean);

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY, vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      if (heroMedia && y < vh) heroMedia.style.transform = `translate3d(0, ${y * 0.3}px, 0)`;
      banners.forEach(img => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1
        img.style.transform = `translate3d(0, ${p * -6}%, 0) scale(1.14)`;
      });
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* 3. Đếm số liệu */
  const nums = document.querySelectorAll('.stat__num');
  if (nums.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const node = [...e.target.childNodes].find(n => n.nodeType === 3 && /\d/.test(n.textContent));
        if (!node) return;
        const end = parseInt(node.textContent, 10), t0 = performance.now(), dur = 1400;
        (function tick(t) {
          const k = Math.min(1, (t - t0) / dur), ease = 1 - Math.pow(1 - k, 3);
          node.textContent = Math.round(end * ease);
          if (k < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.6 });
    nums.forEach(n => io.observe(n));
  }

  /* 4. Chuyển trang mờ dần (chỉ link nội bộ sang trang khác) */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname) return;
    e.preventDefault();
    document.body.classList.add('is-leaving');
    setTimeout(() => { location.href = url.href; }, 280);
  });
  window.addEventListener('pageshow', () => document.body.classList.remove('is-leaving'));
})();
