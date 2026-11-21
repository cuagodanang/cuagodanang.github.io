/* Cửa Gỗ Đà Nẵng — JS dùng chung: header, menu, footer, hiệu ứng, dự án, sơ đồ cửa */
(function () {
  const HOTLINE = '0935 645 327';
  const TEL = 'tel:0935645327';
  const ZALO = 'https://zalo.me/0935645327';

  const NAV = [
    ['cua-chinh.html', 'Cửa chính'],
    ['du-an.html', 'Dự án'],
    ['nha-cung-cap.html', 'Nhà cung cấp'],
    ['tin-tuc.html', 'Tin tức'],
    ['ve-chung-toi.html', 'Về chúng tôi'],
  ];
  const page = location.pathname.split('/').pop() || 'index.html';

  /* ── Header + menu ───────────────────────────── */
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <a class="brand" href="index.html" aria-label="Cửa Gỗ Đà Nẵng – trang chủ">
      <img src="assets/img/logo-mark.png" alt="">
      <span class="brand__name">Cửa Gỗ Đà Nẵng<span class="brand__sub">by Sunflower</span></span>
    </a>
    <nav class="nav" aria-label="Chính">
      ${NAV.map(([h, t]) => `<a href="${h}"${page === h || (h === 'du-an.html' && page.startsWith('du-an-')) || (h === 'nha-cung-cap.html' && page === 'phu-kien-cua.html') || (h === 'tin-tuc.html' && page.startsWith('tin-tuc-')) ? ' aria-current="page"' : ''}>${t}</a>`).join('')}
      <a class="btn-quote" href="lien-he.html">Nhận báo giá</a>
    </nav>
    <button class="menu-toggle" aria-label="Mở menu" aria-expanded="false"><span></span><span></span></button>`;
  document.body.prepend(header);

  const overlay = document.createElement('div');
  overlay.className = 'overlay-menu';
  overlay.innerHTML = `
    <nav aria-label="Menu di động">
      <a href="index.html">Trang chủ</a>
      ${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}
      <a href="lien-he.html">Nhận báo giá</a>
    </nav>
    <div><p class="label">Hotline</p><a href="${TEL}" style="font-size:24px">${HOTLINE}</a></div>`;
  header.after(overlay);

  const toggle = header.querySelector('.menu-toggle');
  toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
  });

  const hasHero = !!document.querySelector('.hero');
  let lastY = 0;
  function onScroll() {
    const y = window.scrollY;
    const overHero = hasHero && y < window.innerHeight - 80;
    header.classList.toggle('is-over-hero', overHero);
    header.classList.toggle('is-solid', !overHero && y > 10);
    header.classList.toggle('is-hidden', y > lastY && y > 400 && !document.body.classList.contains('menu-open'));
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Footer ──────────────────────────────────── */
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="wrap">
      <div class="footer-top">
        <p class="h1">Bộ cửa chính là bộ mặt của ngôi nhà.</p>
        <div class="footer-cols">
          <div>
            <span class="label">Khám phá</span>
            ${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}
            <a href="lien-he.html">Liên hệ</a>
          </div>
          <div>
            <span class="label">Liên hệ</span>
            <a href="${TEL}">${HOTLINE}</a>
            <a href="${ZALO}" target="_blank" rel="noopener">Zalo</a>
            <a href="https://maps.app.goo.gl/Zf6oBNodQs65Wsz58" target="_blank" rel="noopener">Xưởng: 123 Dũng Sĩ Điện Ngọc, Điện Bàn, Đà Nẵng ↗</a>
            <span style="display:block;padding:3px 0">Thi công toàn quốc</span>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span class="brand"><img src="assets/img/logo-mark.png" alt=""> Cửa Gỗ Đà Nẵng — thương hiệu của SUNFLOWER Interior Solutions</span>
        <span>Artistry in Wood · © ${new Date().getFullYear()}</span>
      </div>
    </div>`;
  document.body.append(footer);

  const fc = document.createElement('div');
  fc.className = 'float-call';
  fc.innerHTML = `<a href="${TEL}">Gọi ngay</a><a class="float-call__zalo" href="${ZALO}" target="_blank" rel="noopener">Zalo</a><a href="lien-he.html">Nhận báo giá</a>`;
  if (page !== 'lien-he.html') document.body.append(fc);

  /* ── Video: chỉ tải khi sắp cuộn tới (đỡ tốn 4G) ── */
  const lazyVids = document.querySelectorAll('video[data-src]');
  const loadVid = v => { v.src = v.dataset.src; v.removeAttribute('data-src'); v.play && v.play().catch(() => {}); };
  if ('IntersectionObserver' in window) {
    const vo = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { loadVid(e.target); vo.unobserve(e.target); } }), { rootMargin: '300px 0px' });
    lazyVids.forEach(v => vo.observe(v));
  } else lazyVids.forEach(loadVid);

  /* ── Hero trình chiếu ────────────────────────── */
  const slides = document.querySelectorAll('.hero__media img');
  if (slides.length) {
    const dots = document.querySelector('.hero__dots');
    const caps = document.querySelectorAll('[data-hero-cap]');
    let i = 0, timer;
    slides.forEach((_, k) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', 'Ảnh ' + (k + 1));
      b.addEventListener('click', () => { show(k); restart(); });
      dots && dots.append(b);
    });
    function show(k) {
      i = k;
      slides.forEach((s, n) => s.classList.toggle('is-active', n === k));
      dots && [...dots.children].forEach((d, n) => d.classList.toggle('is-active', n === k));
      caps.forEach(c => c.textContent = slides[k].dataset.caption || '');
    }
    function restart() { clearInterval(timer); timer = setInterval(() => show((i + 1) % slides.length), 6000); }
    show(0); restart();
  }

  /* ── Hiệu ứng xuất hiện ──────────────────────── */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  window.observeReveal = root => (root || document).querySelectorAll('.reveal:not(.is-in)').forEach(el => io ? io.observe(el) : el.classList.add('is-in'));
  observeReveal();

  /* ── Thẻ dự án ───────────────────────────────── */
  // Ảnh nhỏ (1080px) cho thẻ dự án, sinh bằng cong-cu-website/tao-trang-du-an.py
  const nho = src => /^assets\/img\/.+\.jpe?g$/i.test(src) ? src.replace('assets/img/', 'assets/img/nho/') : src;
  window.projectCard = function (p, opts = {}) {
    const loc = p.loc || '';
    const tall = opts.tall || p.cat === 'cua-go';   // ảnh cửa chụp dọc → khung 3:4 để thấy trọn bộ cửa
    const pos = p.focus ? ` style="object-position:${p.focus}"` : '';
    const img = p.img
      ? `<div class="card__img${tall ? ' card__img--tall' : ''}"><img src="${nho(p.img)}" onerror="this.onerror=null;this.src='${p.img}'" alt="${p.name}" loading="lazy"${pos}></div>`
      : `<div class="card__img card__img--placeholder${tall ? ' card__img--tall' : ''}"><img src="assets/img/logo-mark.png" alt=""><span>${p.name}</span></div>`;
    return `<a class="card reveal" href="du-an-${p.id}.html">${img}
      <div class="card__body"><span class="card__title">${p.name}</span><span class="card__meta">${loc}</span></div></a>`;
  };

  /* ── Trang Dự án: bộ lọc + lưới/danh sách ────── */
  const grid = document.getElementById('project-grid');
  if (grid && window.PROJECTS) {
    const filters = document.getElementById('filters');
    const params = new URLSearchParams(location.search);
    let cat = params.get('loai') || 'all';
    let view = 'grid';
    const counts = PROJECTS.reduce((a, p) => (a[p.cat] = (a[p.cat] || 0) + 1, a), {});
    const btn = (k, t, n) => `<button data-cat="${k}" aria-pressed="${cat === k}">${t}<sup>${n}</sup></button>`;
    filters.innerHTML = btn('all', 'Tất cả', PROJECTS.length) +
      Object.entries(CATS).map(([k, t]) => btn(k, t, counts[k] || 0)).join('') +
      `<span class="filters__view"><button data-view="grid" aria-pressed="true">Lưới</button><button data-view="list" aria-pressed="false">Danh sách</button></span>`;
    function render() {
      // ưu tiên dự án có ảnh lên trước
      const list = PROJECTS.filter(p => cat === 'all' || p.cat === cat)
        .sort((a, b) => (b.img ? 1 : 0) - (a.img ? 1 : 0));
      if (view === 'grid') {
        grid.className = 'project-grid';
        grid.innerHTML = list.map(p => projectCard(p)).join('');
      } else {
        grid.className = 'project-list';
        grid.innerHTML = list.map(p => `<a href="du-an-${p.id}.html"><span>${p.name}</span><span class="muted">${CATS[p.cat]}</span><span class="muted">${p.loc || '—'}</span><span class="muted">${p.year || ''}</span></a>`).join('');
      }
      observeReveal(grid);
    }
    filters.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.cat) {
        cat = b.dataset.cat;
        filters.querySelectorAll('[data-cat]').forEach(x => x.setAttribute('aria-pressed', x === b));
        history.replaceState(null, '', cat === 'all' ? 'du-an.html' : 'du-an.html?loai=' + cat);
      } else if (b.dataset.view) {
        view = b.dataset.view;
        filters.querySelectorAll('[data-view]').forEach(x => x.setAttribute('aria-pressed', x === b));
      }
      render();
    });
    render();
  }

  /* ── Dự án nổi bật (trang chủ) ───────────────── */
  const featured = document.getElementById('featured-projects');
  if (featured && window.PROJECTS) {
    const fd = PROJECTS.filter(p => p.featured);
    featured.innerHTML = [...fd.filter(p => p.cat === 'cua-go').slice(0, 3), ...fd.filter(p => p.cat !== 'cua-go' && p.cat !== 'nha-o').slice(0, 3)].map(p => projectCard(p)).join('');
    observeReveal(featured);
  }

  /* ── Trang chi tiết dự án ────────────────────
     Mỗi dự án đã có trang riêng du-an-<id>.html (sinh bằng cong-cu-website/tao-trang-du-an.py).
     Link cũ du-an-chi-tiet.html?id=... tự chuyển sang trang mới (xem du-an-chi-tiet.html). */

  /* ── Sơ đồ giải phẫu bộ cửa ──────────────────── */
  const anatomy = document.querySelector('.anatomy');
  if (anatomy) {
    const fig = anatomy.querySelector('.anatomy__fig');
    const parts = anatomy.querySelectorAll('.part');
    function activate(key) {
      fig.dataset.active = key;
      fig.querySelectorAll('[data-part]').forEach(el => el.classList.toggle('is-active', el.dataset.part === key));
      parts.forEach(p => p.classList.toggle('is-active', p.dataset.part === key));
    }
    parts.forEach(p => p.addEventListener('click', () => activate(p.dataset.part)));
    fig.querySelectorAll('[data-part]').forEach(el => el.addEventListener('click', () => {
      activate(el.dataset.part);
      const t = anatomy.querySelector(`.part[data-part="${el.dataset.part}"]`);
      if (t && window.innerWidth < 860) t.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }));
    activate(parts[0].dataset.part);
  }

  /* ── Đếm lượt bấm Gọi / Zalo (GTM → GA4: goi_dien, nhan_zalo) ── */
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    const h = a.getAttribute('href');
    const ev = h.startsWith('tel:') ? 'goi_dien' : /zalo\.me/.test(h) ? 'nhan_zalo' : '';
    if (ev) (window.dataLayer = window.dataLayer || []).push({ event: ev, link_url: h });
  });

  /* ── Form Nhận báo giá (gửi qua FormSubmit về email) ── */
  const form = document.getElementById('quote-form');
  if (form) {
    const params = new URLSearchParams(location.search);
    const q = params.get('kieu');
    if (q) { const r = form.querySelector(`input[data-k="${q}"]`); if (r) r.checked = true; }
    if (params.has('da-gui')) {               // FormSubmit chuyển về đây sau khi gửi thành công
      form.classList.add('is-sent');
      // Đếm 1 lượt gửi báo giá thành công (GTM → GA4: generate_lead), rồi bỏ ?da-gui để tải lại không đếm trùng
      (window.dataLayer = window.dataLayer || []).push({ event: 'generate_lead', form_name: 'nhan-bao-gia' });
      params.delete('da-gui');
      history.replaceState(null, '', location.pathname + (params.toString() ? '?' + params : '') + location.hash);
      setTimeout(() => form.parentElement.scrollIntoView({ block: 'center' }), 300);
    }
    const next = form.querySelector('input[name="_next"]');
    if (next) next.value = new URL('lien-he.html?da-gui=1', location.href).href;
    form.addEventListener('submit', e => {
      if (!form.reportValidity()) { e.preventDefault(); return; }
      const f = form.querySelector('input[type=file]');
      if (f && f.files[0] && f.files[0].size > 5 * 1024 * 1024) {
        e.preventDefault(); alert('Ảnh đính kèm tối đa 5MB. Bạn có thể gửi ảnh qua Zalo 0935 645 327.'); return;
      }
      const b = form.querySelector('button[type=submit]'); b.disabled = true; b.textContent = 'Đang gửi…';
    });
  }
  /* ── Mở trang có #mục: cuộn lại đúng chỗ sau khi ảnh tải xong (ảnh làm trang dịch chuyển) ── */
  if (location.hash.length > 1) {
    window.addEventListener('load', () => {
      const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
  }
})();
