import './style.css';
import { projects, links } from '../src/shared/content.js';
import { $, $$, fillStats, livePings, copyButtons, buildStamp, reducedMotion, isTouch } from '../src/shared/utils.js';

fillStats();
const reduced = reducedMotion();

/* ── Kinetic name: per-letter width follows the cursor ──────── */
const letters = [];
$$('[data-kinetic]').forEach((row) => {
  row.innerHTML = [...row.textContent].map((c) => `<span class="k">${c}</span>`).join('');
  letters.push(...$$('.k', row));
});
let mx = innerWidth / 2, my = innerHeight / 3, active = false;
addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; active = true; }, { passive: true });
const cur = letters.map(() => ({ w: 100, g: 800 }));
function kinetic() {
  letters.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    const d = Math.hypot(mx - (r.left + r.width / 2), (my - (r.top + r.height / 2)) * 1.4);
    const k = active ? Math.max(0, 1 - d / Math.max(320, innerWidth * 0.3)) : 0;
    const tw = 62 + 63 * k;           // condensed → expanded under the cursor
    const tg = 700 + 200 * k;
    cur[i].w += (tw - cur[i].w) * 0.15;
    cur[i].g += (tg - cur[i].g) * 0.15;
    el.style.fontVariationSettings = `'wdth' ${cur[i].w.toFixed(1)}, 'wght' ${cur[i].g.toFixed(0)}`;
  });
  requestAnimationFrame(kinetic);
}
if (!reduced && !isTouch()) kinetic();
else letters.forEach((el, i) => { el.style.fontVariationSettings = `'wdth' 68, 'wght' 900`; });

/* ── Draggable stickers ───────────────────────────────────────── */
$$('.sticker').forEach((s) => {
  let sx, sy, ox, oy, on = false;
  s.addEventListener('pointerdown', (e) => {
    on = true; sx = e.clientX; sy = e.clientY; ox = s.offsetLeft; oy = s.offsetTop;
    s.setPointerCapture(e.pointerId); s.classList.add('is-drag');
    s.style.zIndex = String(Date.now() % 100000);
  });
  s.addEventListener('pointermove', (e) => {
    if (!on) return;
    s.style.left = `${ox + e.clientX - sx}px`;
    s.style.top = `${oy + e.clientY - sy}px`;
  });
  const end = () => { on = false; s.classList.remove('is-drag'); };
  s.addEventListener('pointerup', end); s.addEventListener('pointercancel', end);
});

/* ── Marquees ─────────────────────────────────────────────────── */
$$('[data-marquee]').forEach((m) => { m.innerHTML = `<span>${m.innerHTML.repeat(4)}</span><span>${m.innerHTML.repeat(4)}</span>`; });

/* ── Project index with cursor-follow preview ─────────────────── */
$('[data-index]').innerHTML = projects.map((p) => `
  <li class="row" style="--c:${p.color}" data-shot="${p.shot}" ${p.live ? `data-ping-url="${p.live}"` : ''}>
    <div class="row__head">
      <span class="row__no">${p.no}</span>
      <h3 class="row__name">${p.name.toUpperCase()}</h3>
      <span class="row__year">${p.year}</span>
      ${p.live ? '<span class="row__ping" data-ping><i></i><b>…</b></span>' : '<span class="row__ping row__ping--src">SOURCE</span>'}
    </div>
    <div class="row__body">
      <img class="row__shot" src="${p.shot}" alt="${p.name} screenshot" loading="lazy" />
      <div>
        <p class="row__lede">${p.lede}</p>
        <ul>${p.points.map((x) => `<li>${x}</li>`).join('')}</ul>
        <p class="row__stack">${p.stack.join(' / ')}</p>
        <div class="row__links">${p.live ? `<a href="${p.live}" target="_blank" rel="noopener">LIVE ↗</a>` : ''}<a href="${p.source}" target="_blank" rel="noopener">SOURCE ↗</a></div>
      </div>
    </div>
  </li>`).join('');

const peek = $('.peek');
let px = 0, py = 0, tx = 0, ty = 0;
$$('.row').forEach((row) => {
  row.addEventListener('pointerenter', () => { if (isTouch()) return; peek.src = row.dataset.shot; peek.classList.add('is-on'); peek.style.setProperty('--c', getComputedStyle(row).getPropertyValue('--c')); });
  row.addEventListener('pointerleave', () => peek.classList.remove('is-on'));
  $('.row__head', row).addEventListener('click', () => row.classList.toggle('is-open'));
});
addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
(function follow() { px += (tx - px) * 0.18; py += (ty - py) * 0.18; peek.style.transform = `translate(${px + 24}px, ${py - 120}px) rotate(${(tx - px) * 0.05}deg)`; requestAnimationFrame(follow); })();
$$('.row')[0]?.classList.add('is-open');

/* ── Footer ───────────────────────────────────────────────────── */
$('[data-links]').innerHTML = links.map((l) => `<a href="${l.url}" ${l.url.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${l.label.toUpperCase()} ↗</a>`).join('');
$('[data-year]').textContent = new Date().getFullYear();
$('[data-build]').textContent = buildStamp().toUpperCase();

livePings();
copyButtons('COPIED ✱ TALK SOON');
