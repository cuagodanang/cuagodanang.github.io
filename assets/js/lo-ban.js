/* Thước Lỗ Ban 52,2cm — khoảng thông thủy (cửa đi, cửa sổ, cửa cổng).
   8 cung lớn × 65,25mm, mỗi cung 5 cung nhỏ × 13,05mm, lặp mỗi 522mm.
   Mỗi .lb-dim gồm ô nhập (mm), dòng kết quả và cây thước vẽ bằng canvas, kéo được.
   Thước có data-huong="doc" nằm dọc (số lớn ở trên, như đo từ sàn lên).
   .lb-cua vẽ ô cửa theo đúng tỉ lệ rộng × cao thông thủy đang đo. */
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

  // Kích thước đang đo của cả hai chiều, để vẽ ô cửa
  const DO = {};
  const veCua = [];

  document.querySelectorAll('.lb-dim').forEach(dim => {
    const input = dim.querySelector('input');
    const kq = dim.querySelector('.lb-kq');
    const ruler = dim.querySelector('.lb-ruler');
    const doc = ruler.dataset.huong === 'doc';
    const cv = ruler.querySelector('canvas');
    const ctx = cv.getContext('2d');
    let val = clamp(+input.value || 810);

    function clamp(v) { return Math.min(MAX, Math.max(MIN, Math.round(v))); }
    // px mỗi mm
    const tile = () => doc ? (ruler.clientHeight < 440 ? 5 : 6) : (ruler.clientWidth < 600 ? 8 : 10);

    function draw() {
      const W = ruler.clientWidth, H = ruler.clientHeight, s = tile();
      const dpr = window.devicePixelRatio || 1;
      if (cv.width !== W * dpr || cv.height !== H * dpr) { cv.width = W * dpr; cv.height = H * dpr; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#FBF8F2'; ctx.fillRect(0, 0, W, H);

      // u: dọc theo thước (px), w: ngang qua thước (px)
      const L = doc ? H : W;
      const x0 = val - L / 2 / s, x1 = val + L / 2 / s;
      const U = mm => doc ? (x1 - mm) * s : (mm - x0) * s;           // dọc: số lớn ở trên
      const rect = (a, b, w, d) => {                                   // đoạn mm [a,b] × bề ngang [w, w+d]
        const ua = U(a), ub = U(b);
        return doc ? [w, Math.min(ua, ub), d, Math.abs(ub - ua)] : [ua, w, ub - ua, d];
      };
      const hep = W < 210;                                             // thước dọc trên điện thoại
      const wTick = doc ? (hep ? 40 : 50) : 38;                        // chỗ cho vạch chia + số
      const wLon = doc ? (hep ? 60 : 74) : 28, wNho = doc ? W - wTick - wLon - 6 : 30;
      const yLon = wTick, yNho = yLon + wLon, yDay = yNho + wNho;

      // Vạch chia mm + số mm mỗi 10mm
      ctx.strokeStyle = C.muc; ctx.fillStyle = C.xam; ctx.lineWidth = 1;
      ctx.font = `400 11px ${FONT}`;
      ctx.textAlign = doc ? 'left' : 'center'; ctx.textBaseline = doc ? 'middle' : 'alphabetic';
      for (let m = Math.floor(x0); m <= Math.ceil(x1); m++) {
        const p = Math.round(U(m)) + .5, h = m % 10 === 0 ? 14 : m % 5 === 0 ? 9 : 5;
        if (doc && s < 6 && m % 5 && m % 10) continue;                  // thước dọc nhỏ: bớt vạch lẻ
        ctx.globalAlpha = m % 10 === 0 ? .9 : .45;
        ctx.beginPath();
        if (doc) { ctx.moveTo(0, p); ctx.lineTo(h, p); } else { ctx.moveTo(p, 0); ctx.lineTo(p, h); }
        ctx.stroke();
        if (m % 10 === 0) { ctx.globalAlpha = 1; doc ? ctx.fillText(m, 16, p) : ctx.fillText(m, p, 29); }
      }
      ctx.globalAlpha = 1;

      // Dải cung: tên đặt giữa phần đang thấy để luôn đọc được
      function dai(a, b, w, d, c, ten, dam) {
        if (b < x0 || a > x1) return;
        const [rx, ry, rw, rh] = rect(a, b, w, d);
        ctx.fillStyle = c.tot ? C.camNhat : C.nen; ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeStyle = C.xamNhat; ctx.strokeRect(Math.round(rx) + .5, Math.round(ry) + .5, rw, rh);
        ctx.font = `${dam ? 500 : 400} ${s < 10 ? 11 : 13}px ${FONT}`;
        const tw = ctx.measureText(ten).width;
        // phần dải đang thấy theo chiều dọc thước
        const lo = doc ? Math.max(ry, 0) : Math.max(rx, 0), hi = doc ? Math.min(ry + rh, H) : Math.min(rx + rw, W);
        const can = doc ? 16 : tw + 8;                                 // dọc: chữ nằm ngang, cần cao ~16px
        if (hi - lo < can || (doc && d < tw + 8)) return;
        const a0 = doc ? ry : rx, a1 = doc ? ry + rh : rx + rw, nua = can / 2 - 2;
        const giua = Math.min(Math.max((lo + hi) / 2, a0 + nua + 4), a1 - nua - 4);
        ctx.fillStyle = c.tot ? C.cam : C.xam;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        doc ? ctx.fillText(ten, w + d / 2, giua + 1) : ctx.fillText(ten, giua, w + d / 2 + 1);
      }
      for (let k = Math.floor(x0 / CHU_KY); k * CHU_KY <= x1; k++) {
        CUNG.forEach((c, i) => {
          const a = k * CHU_KY + i * LON;
          dai(a, a + LON, yLon, wLon, c, c.ten, true);
          c.nho.forEach((t, j) => dai(a + j * NHO, a + (j + 1) * NHO, yNho, wNho, c, t, false));
          if (a + LON >= x0 && a <= x1) { ctx.fillStyle = c.tot ? C.cam : C.muc; ctx.fillRect(...rect(a, a + LON, yDay, 4)); }
        });
      }

      // Vạch đo ở giữa
      ctx.fillStyle = C.cam;
      if (doc) {
        const yc = Math.round(H / 2);
        ctx.fillRect(0, yc - 1, 15, 2);
        ctx.fillRect(yLon, yc - 1, W - yLon, 2);
        ctx.beginPath(); ctx.moveTo(0, yc - 6); ctx.lineTo(0, yc + 6); ctx.lineTo(8, yc); ctx.fill();
      } else {
        const xc = Math.round(W / 2);
        ctx.fillRect(xc - 1, 0, 2, 17);      // chừa chỗ cho số mm
        ctx.fillRect(xc - 1, yLon, 2, H - yLon);
        ctx.beginPath(); ctx.moveTo(xc - 6, 0); ctx.lineTo(xc + 6, 0); ctx.lineTo(xc, 8); ctx.fill();
      }
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
      DO[input.id] = val; veCua.forEach(f => f());
    }

    input.addEventListener('input', () => { const v = +input.value; if (v >= MIN && v <= MAX) dat(v, true); });
    input.addEventListener('change', () => dat(+input.value || val));
    kq.addEventListener('click', e => { const b = e.target.closest('.lb-nhay'); if (b) dat(+b.dataset.v); });

    // Kéo thước (chuột / cảm ứng). Thước dọc: kéo xuống thì số tăng (thấy phần phía trên).
    let keo = null;
    const toaDo = e => doc ? e.clientY : -e.clientX;
    ruler.addEventListener('pointerdown', e => { keo = { p: toaDo(e), v: val }; ruler.setPointerCapture(e.pointerId); ruler.classList.add('is-keo'); });
    ruler.addEventListener('pointermove', e => { if (keo) dat(keo.v + (toaDo(e) - keo.p) / tile()); });
    const tha = () => { keo = null; ruler.classList.remove('is-keo'); };
    ruler.addEventListener('pointerup', tha);
    ruler.addEventListener('pointercancel', tha);
    ruler.addEventListener('wheel', e => {
      // thước dọc chỉ nhận lăn chuột khi đang được chọn, để không chặn cuộn trang
      const d = doc ? (document.activeElement === ruler ? -e.deltaY : 0)
        : (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0));
      if (!d) return;
      e.preventDefault(); dat(val + d / tile());
    }, { passive: false });
    ruler.addEventListener('keydown', e => {
      const b = doc ? { ArrowDown: -1, ArrowUp: 1 }[e.key] : { ArrowLeft: -1, ArrowRight: 1 }[e.key];
      if (b) { e.preventDefault(); dat(val + b * (e.shiftKey ? 10 : 1)); }
    });

    new ResizeObserver(draw).observe(ruler);
    if (document.fonts) document.fonts.ready.then(draw);
    dat(val);
  });

  // Ô cửa minh hoạ: vẽ khung bao + khoảng thông thủy theo đúng tỉ lệ rộng × cao đang đo
  document.querySelectorAll('.lb-cua').forEach(hop => {
    const NS = 'http://www.w3.org/2000/svg';
    const VW = 300, VH = 420, KHUNG = 10;                 // khung bao vẽ dày 10 đơn vị
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${VW} ${VH}`);
    svg.setAttribute('role', 'img');
    hop.append(svg);
    const chu = document.querySelector('.lb-cua__ghi');

    function ve() {
      const r = DO['lb-rong'] || 810, c = DO['lb-cao'] || 2150;
      const tr = tra(r), tc = tra(c);
      // vừa khung vẽ: chừa lề trái cho đường kích thước cao, lề dưới cho kích thước rộng
      const maxW = VW - 90 - 2 * KHUNG, maxH = VH - 70 - KHUNG;
      const k = Math.min(maxW / r, maxH / c);
      const w = r * k, h = c * k;
      const x = 70 + KHUNG + (maxW - w) / 2, san = VH - 50, y = san - h;
      const mauR = tr.lon.tot ? C.cam : C.xam, mauC = tc.lon.tot ? C.cam : C.xam;
      const camTot = tr.lon.tot && tc.lon.tot;
      svg.setAttribute('aria-label', `Ô cửa thông thủy rộng ${r} mm, cao ${c} mm`);
      svg.innerHTML = `
        <line x1="20" y1="${san}" x2="${VW - 8}" y2="${san}" stroke="${C.muc}" stroke-width="1.5"/>
        <rect x="${x - KHUNG}" y="${y - KHUNG}" width="${w + 2 * KHUNG}" height="${h + KHUNG}" fill="${C.muc}"/>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${camTot ? C.camNhat : '#FBF8F2'}"/>
        <text x="${x + w / 2}" y="${y + h / 2 - 8}" text-anchor="middle" font-size="12" fill="${C.xam}">Thông thủy</text>
        <text x="${x + w / 2}" y="${y + h / 2 + 10}" text-anchor="middle" font-size="13" font-weight="500" fill="${C.muc}">${r} × ${c}</text>
        <g stroke="${mauC}" stroke-width="1.2">
          <line x1="44" y1="${y}" x2="44" y2="${san}"/>
          <line x1="38" y1="${y}" x2="${x - KHUNG - 4}" y2="${y}" stroke-dasharray="2 3"/>
          <line x1="38" y1="${y}" x2="50" y2="${y}"/><line x1="38" y1="${san}" x2="50" y2="${san}"/>
        </g>
        <text transform="translate(34 ${(y + san) / 2}) rotate(-90)" text-anchor="middle" font-size="12" font-weight="500" fill="${mauC}">Cao ${c} mm</text>
        <g stroke="${mauR}" stroke-width="1.2">
          <line x1="${x}" y1="${san + 22}" x2="${x + w}" y2="${san + 22}"/>
          <line x1="${x}" y1="${san + 16}" x2="${x}" y2="${san + 28}"/><line x1="${x + w}" y1="${san + 16}" x2="${x + w}" y2="${san + 28}"/>
        </g>
        <text x="${x + w / 2}" y="${san + 42}" text-anchor="middle" font-size="12" font-weight="500" fill="${mauR}">Rộng ${r} mm</text>`;
      svg.querySelectorAll('text').forEach(t => t.setAttribute('font-family', FONT));
      if (chu) chu.innerHTML =
        `Lọt lòng <strong>${r} × ${c} mm</strong>: rộng rơi cung <em>${tr.lon.ten} – ${tr.nho}</em> (${tr.lon.tot ? 'tốt' : 'xấu'}), ` +
        `cao rơi cung <em>${tc.lon.ten} – ${tc.nho}</em> (${tc.lon.tot ? 'tốt' : 'xấu'}). ` +
        (camTot ? 'Cả hai chiều đều đẹp.' : 'Nên chỉnh chiều đang xấu sang số gợi ý.') +
        ` Khung bao (phần đen) nằm ngoài khoảng này.`;
    }
    veCua.push(ve);
    ve();
  });
})();
