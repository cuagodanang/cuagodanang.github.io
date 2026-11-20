/* Cửa Gỗ Đà Nẵng — JS dùng chung: header, menu, footer, hiệu ứng, dự án, sơ đồ cửa */
(function () {
  const HOTLINE = '0935 645 327';
  const TEL = 'tel:0935645327';
  const ZALO = 'https://zalo.me/0935645327';

  const NAV = [
    ['cua-chinh.html', 'Cửa chính'],
    ['du-an.html', 'Dự án'],
    ['nha-cung-cap.html', 'Nhà cung cấp'],
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
      ${NAV.map(([h, t]) => `<a href="${h}"${page === h || (h === 'du-an.html' && page === 'du-an-chi-tiet.html') || (h === 'nha-cung-cap.html' && page === 'phu-kien-cua.html') ? ' aria-current="page"' : ''}>${t}</a>`).join('')}
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
            <span style="display:block;padding:3px 0">Xưởng: 123 Dũng Sĩ Điện Ngọc, Điện Bàn, Đà Nẵng</span>
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
  fc.innerHTML = `<a href="${TEL}">Gọi ${HOTLINE}</a><a href="lien-he.html">Nhận báo giá</a>`;
  if (page !== 'lien-he.html') document.body.append(fc);

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
  window.projectCard = function (p, opts = {}) {
    const loc = p.loc || '';
    const tall = opts.tall || p.cat === 'cua-go';   // ảnh cửa chụp dọc → khung 3:4 để thấy trọn bộ cửa
    const pos = p.focus ? ` style="object-position:${p.focus}"` : '';
    const img = p.img
      ? `<div class="card__img${tall ? ' card__img--tall' : ''}"><img src="${p.img}" alt="${p.name}" loading="lazy"${pos}></div>`
      : `<div class="card__img card__img--placeholder${tall ? ' card__img--tall' : ''}"><img src="assets/img/logo-mark.png" alt=""><span>${p.name}</span></div>`;
    return `<a class="card reveal" href="du-an-chi-tiet.html?id=${p.id}">${img}
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
        grid.innerHTML = list.map(p => `<a href="du-an-chi-tiet.html?id=${p.id}"><span>${p.name}</span><span class="muted">${CATS[p.cat]}</span><span class="muted">${p.loc || '—'}</span><span class="muted">${p.year || ''}</span></a>`).join('');
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

  /* ── Trang chi tiết dự án ────────────────────── */
  const detail = document.getElementById('project-detail');
  if (detail && window.PROJECTS) {
    const id = new URLSearchParams(location.search).get('id');
    const idx = Math.max(0, PROJECTS.findIndex(p => p.id === id));
    const p = PROJECTS[idx];
    document.title = p.name + ' — Cửa Gỗ Đà Nẵng';
    const gal = p.gallery || (p.img ? [p.img] : []);
    const related = PROJECTS.filter(x => x.cat === p.cat && x.id !== p.id && x.img).slice(0, 3);
    detail.innerHTML = `
      <section class="page-hero wrap">
        <p class="label label--accent"><a href="du-an.html?loai=${p.cat}">${CATS[p.cat]}</a></p>
        <h1 class="display" style="margin-top:24px">${p.name}</h1>
      </section>
      <section class="wrap">
        <dl class="facts">
          <div><dt>Hạng mục</dt><dd>${CATS[p.cat]}</dd></div>
          <div><dt>Địa điểm</dt><dd>${p.loc || 'Đang cập nhật'}</dd></div>
          <div><dt>Năm</dt><dd>${p.year || 'Đang cập nhật'}</dd></div>
          <div><dt>Trạng thái</dt><dd>${p.status || 'Hoàn thành'}</dd></div>
        </dl>
        ${p.scope ? `<p class="lead" style="max-width:820px;margin-top:48px">${p.scope}</p>` : ''}
      </section>
      <section class="wrap section--tight">
        ${gal.length ? `<div class="gallery">${gal.map(g => `<figure class="reveal"><img src="${g}" alt="${p.name}" loading="lazy"></figure>`).join('')}</div>`
          : `<div class="card__img card__img--placeholder" style="aspect-ratio:21/9"><img src="assets/img/logo-mark.png" alt=""><span>Hình ảnh dự án đang được cập nhật</span></div>`}
      </section>
      ${related.length ? `<section class="wrap section--tight">
        <div class="sec-head"><p class="label">Dự án cùng hạng mục</p><div class="sec-head__body"></div></div>
        <div class="project-grid">${related.map(r => projectCard(r)).join('')}</div>
      </section>` : ''}
      <section class="wrap section--tight" style="display:flex;justify-content:space-between;gap:24px;border-top:1px solid var(--muc-tau);padding-top:24px">
        <a class="link-arrow" href="du-an.html">Tất cả dự án</a>
        <a class="link-arrow" href="du-an-chi-tiet.html?id=${PROJECTS[(idx + 1) % PROJECTS.length].id}">Dự án tiếp theo</a>
      </section>`;
    observeReveal(detail);
  }

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
