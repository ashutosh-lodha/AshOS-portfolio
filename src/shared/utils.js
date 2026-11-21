// Small helpers shared by every design.
import { stats } from './content.js';

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isTouch = () => matchMedia('(hover: none), (pointer: coarse)').matches;

/** Fill [data-stat="leetcode.total"] style placeholders. */
export function fillStats(root = document) {
  const get = (p) => p.split('.').reduce((o, k) => (o == null ? o : o[k]), stats);
  $$('[data-stat]', root).forEach((el) => {
    const v = get(el.dataset.stat);
    if (v != null) el.textContent = v;
  });
}

/** Footer build stamp, e.g. "build a1b2c3d · 21 Nov 2026". */
export function buildStamp() {
  const d = new Date(__BUILD_TIME__).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  return `build ${__BUILD_SHA__} · ${d}`;
}

/** Measure round-trip latency to a live site from the visitor's browser. */
async function measure(url) {
  const t0 = performance.now();
  await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: AbortSignal.timeout(8000) });
  return Math.round(performance.now() - t0);
}

/** Live status for elements with [data-ping-url] that contain a [data-ping] badge. */
export function livePings(onResult) {
  $$('[data-ping-url]').forEach((card) => {
    const url = card.dataset.pingUrl;
    const badge = $('[data-ping]', card);
    let timer = 0;
    const run = async () => {
      let ms = null;
      try {
        await measure(url).catch(() => 0);
        ms = await measure(url);
      } catch { ms = null; }
      if (badge) {
        badge.classList.toggle('is-up', ms != null);
        badge.classList.toggle('is-down', ms == null);
        const label = $('b', badge) || badge;
        label.textContent = ms != null ? `live · ${ms} ms` : 'unreachable';
      }
      onResult?.(url, ms);
    };
    new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) { run(); timer = setInterval(run, 20000); }
    }, { rootMargin: '200px' }).observe(card);
  });
}

/** Click-to-copy for [data-copy]; shows text in a .toast element if present. */
export function copyButtons(message = 'Email copied — talk soon ✦') {
  const toast = $('.toast');
  let t;
  $$('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
      } catch {
        window.location.href = `mailto:${btn.dataset.copy}`;
        return;
      }
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add('is-on');
      clearTimeout(t);
      t = setTimeout(() => toast.classList.remove('is-on'), 2400);
    });
  });
}
