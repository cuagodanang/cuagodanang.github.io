/* Thước Lỗ Ban 52,2cm — khoảng thông thủy (cửa đi, cửa sổ, cửa cổng).
   8 cung lớn × 65,25mm, mỗi cung 5 cung nhỏ × 13,05mm, lặp mỗi 522mm.
   Mỗi .lb-dim gồm ô nhập (mm), dòng kết quả và cây thước vẽ bằng canvas, kéo được. */
(function () {
  const CHU_KY = 522, LON = 65.25, NHO = 13.05; // mm
  const MIN = 100, MAX = 10000;
  const CUNG = [
    ['Quý nhân', true, 'Quyền lộc · Trung tín · Tác quan · Phát đạt · Thông minh'],
    ['Hiểm họa', false, 'Án thành · Hỗn nhân · Thất hiếu · Tai họa · Trường bệnh'],
    ['Thiên tai', false, 'Hoàn tử · Quan tài · Thân tàn · Thất tài · Hệ quả'],
    ['Thiên tài', true, 'Thi thơ · Văn học · Thanh quý · Tác lộc · Thiên lộc'],
    ['Nhân lộc', true, 'Trí tồn · Phú quý · Tiến bửu · Thập thiện · Văn chương'],
    ['Cô độc', false, 'Bạc nghịch · Vô vọng · Ly tán · Tửu thục · Dâm dục'],
    ['Thiên tặc', false, 'Phong bệnh · Chiêu ôn · Ôn tài · Ngục tù · Quang tài'],
    ['Tể tướng', true, 'Đại tài · Thi thơ · Hoạch tài · Hiếu tử · Quý nhân']
  ].map(([ten, tot, nho]) => ({ ten, tot, nho: nho.split(' · ') }));

  const so = mm => mm.toLocaleString('vi-VN', { maximumFractionDigits: 2 });

  // Tra cung (tính theo 0,1mm để tránh sai số số thực)
  function tra(mm) {
    const du = ((Math.round(mm * 10) % 5220) + 5220) % 5220;
    const i = Math.min(7, Math.floor(du / 652.5));
    const j = Math.min(4, Math.floor((du - i * 652.5) / 130.5));
    return { lon: CUNG[i], nho: CUNG[i].nho[j] };
  }

  // Số mm gần nhất về một phía rơi vào cung tốt, cách mép cung nhỏ ≥ 1,5mm
  function soDep(mm, buoc) {
    for (let v = mm + buoc; v >= MIN && v <= MAX && Math.abs(v - mm) <= 300; v += buoc) {
      const le = ((v * 10) % 5220 + 5220) % 5220 % 130.5;
      if (tra(v).lon.tot && le >= 15 && le <= 115.5) return v;
    }
    return null;
  }

  // Bảng 8 cung
  const bang = document.getElementById('lb-bang');
  if (bang) bang.innerHTML = CUNG.map((c, i) =>
    `<tr class="${c.tot ? 'lb-tot' : ''}"><td>${c.ten} <span class="lb-tag">${c.tot ? 'Tốt' : 'Xấu'}</span></td>` +
    `<td>${so(i * LON)} – ${so((i + 1) * LON)} mm</td><td>${c.nho.join(' · ')}</td></tr>`).join('');

  // Màu lấy từ biến thương hiệu
  const css = getComputedStyle(document.documentElement);
  const mau = k => css.getPropertyValue(k).trim();
  const C = {
    nen: mau('--giay-moc') || '#F3EEE3', muc: mau('--muc-tau') || '#111',
    cam: mau('--dat-nung') || '#D9541E', camNhat: mau('--cam-15') || '#EFD7C5',
    xam: mau('--xam-70') || '#555350', xamVua: mau('--xam-40') || '#99968F', xamNhat: mau('--xam-15') || '#D1CDC4'
  };
  const FONT = getComputedStyle(document.body).fontFamily;

  document.querySelectorAll('.lb-dim').forEach(dim => {
    const input = dim.querySelector('input');
    const kq = dim.querySelector('.lb-kq');
    const ruler = dim.querySelector('.lb-ruler');
    const cv = ruler.querySelector('canvas');
    const ctx = cv.getContext('2d');
    let val = clamp(+input.value || 810);

    function clamp(v) { return Math.min(MAX, Math.max(MIN, Math.round(v))); }
    const tile = () => (ruler.clientWidth < 600 ? 8 : 10); // px mỗi mm

    function draw() {
      const W = ruler.clientWidth, H = ruler.clientHeight, s = tile();
      const dpr = window.devicePixelRatio || 1;
      if (cv.width !== W * dpr || cv.height !== H * dpr) { cv.width = W * dpr; cv.height = H * dpr; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#FBF8F2'; ctx.fillRect(0, 0, W, H);

      const x0 = val - W / 2 / s, x1 = val + W / 2 / s;
      const X = mm => (mm - x0) * s;
      const yLon = 38, hLon = 28, yNho = yLon + hLon, hNho = 30, yDay = yNho + hNho;

      // Vạch chia mm + số mm mỗi 10mm
      ctx.strokeStyle = C.muc; ctx.fillStyle = C.xam; ctx.lineWidth = 1;
      ctx.font = `400 11px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      for (let m = Math.floor(x0); m <= Math.ceil(x1); m++) {
        const x = Math.round(X(m)) + .5, h = m % 10 === 0 ? 14 : m % 5 === 0 ? 9 : 5;
        ctx.globalAlpha = m % 10 === 0 ? .9 : .45;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        if (m % 10 === 0) { ctx.globalAlpha = 1; ctx.fillText(m, x, 29); }
      }
      ctx.globalAlpha = 1;

      // Dải cung: tên đặt giữa phần đang thấy để luôn đọc được
      function dai(a, b, y, h, c, ten, dam) {
        if (b < x0 || a > x1) return;
        const xa = X(a), xb = X(b);
        ctx.fillStyle = c.tot ? C.camNhat : C.nen; ctx.fillRect(xa, y, xb - xa, h);
        ctx.strokeStyle = C.xamNhat; ctx.strokeRect(Math.round(xa) + .5, y + .5, xb - xa, h);
        const va = Math.max(xa, 0), vb = Math.min(xb, W);
        ctx.font = `${dam ? 500 : 400} ${s < 10 ? 11 : 13}px ${FONT}`;
        const tw = ctx.measureText(ten).width;
        if (vb - va < tw + 8) return;
        ctx.fillStyle = c.tot ? C.cam : C.xam;
        ctx.textBaseline = 'middle';
        ctx.fillText(ten, Math.min(Math.max((va + vb) / 2, xa + tw / 2 + 6), xb - tw / 2 - 6), y + h / 2 + 1);
      }
      for (let k = Math.floor(x0 / CHU_KY); k * CHU_KY <= x1; k++) {
        CUNG.forEach((c, i) => {
          const a = k * CHU_KY + i * LON;
          dai(a, a + LON, yLon, hLon, c, c.ten, true);
          c.nho.forEach((t, j) => dai(a + j * NHO, a + (j + 1) * NHO, yNho, hNho, c, t, false));
          if (a + LON >= x0 && a <= x1) { ctx.fillStyle = c.tot ? C.cam : C.muc; ctx.fillRect(X(a), yDay, X(a + LON) - X(a), 4); }
        });
      }

      // Vạch đo ở giữa
      const xc = Math.round(W / 2);
      ctx.fillStyle = C.cam;
      ctx.fillRect(xc - 1, 0, 2, 17);      // chừa chỗ cho số mm
      ctx.fillRect(xc - 1, yLon, 2, H - yLon);
      ctx.beginPath(); ctx.moveTo(xc - 6, 0); ctx.lineTo(xc + 6, 0); ctx.lineTo(xc, 8); ctx.fill();
    }

    function ketQua() {
      const r = tra(val);
      const nut = v => v ? `<button type="button" class="lb-nhay" data-v="${v}">${v} mm</button> <span class="muted">${tra(v).lon.ten} – ${tra(v).nho}</span>` : '';
      const goiY = r.lon.tot ? '' :
        `<p class="lb-goiy">Gần nhất: ${[nut(soDep(val, -1)), nut(soDep(val, 1))].filter(Boolean).join(' &nbsp;hoặc&nbsp; ')}</p>`;
      kq.className = 'lb-kq ' + (r.lon.tot ? 'is-tot' : 'is-xau');
      kq.innerHTML = `<p class="lb-cung">${r.lon.ten} – ${r.nho} <span class="lb-tag">${r.lon.tot ? 'Tốt' : 'Xấu'}</span></p>${goiY}`;
      ruler.setAttribute('aria-valuenow', val);
      ruler.setAttribute('aria-valuetext', `${val} mm, ${r.lon.ten} – ${r.nho}`);
    }

    let hen = 0;
    function dat(v, tuInput) {
      val = clamp(v);
      if (!tuInput) input.value = val;
      cancelAnimationFrame(hen); hen = requestAnimationFrame(draw);
      ketQua();
    }

    input.addEventListener('input', () => { const v = +input.value; if (v >= MIN && v <= MAX) dat(v, true); });
    input.addEventListener('change', () => dat(+input.value || val));
    kq.addEventListener('click', e => { const b = e.target.closest('.lb-nhay'); if (b) dat(+b.dataset.v); });

    // Kéo thước (chuột / cảm ứng)
    let keo = null;
    ruler.addEventListener('pointerdown', e => { keo = { x: e.clientX, v: val }; ruler.setPointerCapture(e.pointerId); ruler.classList.add('is-keo'); });
    ruler.addEventListener('pointermove', e => { if (keo) dat(keo.v - (e.clientX - keo.x) / tile()); });
    const tha = () => { keo = null; ruler.classList.remove('is-keo'); };
    ruler.addEventListener('pointerup', tha);
    ruler.addEventListener('pointercancel', tha);
    ruler.addEventListener('wheel', e => {
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
      if (!d) return;
      e.preventDefault(); dat(val + d / tile());
    }, { passive: false });
    ruler.addEventListener('keydown', e => {
      const b = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
      if (b) { e.preventDefault(); dat(val + b * (e.shiftKey ? 10 : 1)); }
    });

    new ResizeObserver(draw).observe(ruler);
    if (document.fonts) document.fonts.ready.then(draw);
    dat(val);
  });
})();
