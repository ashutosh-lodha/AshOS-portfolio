// Small DOM helpers used by AshOS.

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Footer build stamp, e.g. "build a1b2c3d · 21 Nov 2026". */
export function buildStamp() {
  const d = new Date(__BUILD_TIME__).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  return `build ${__BUILD_SHA__} · ${d}`;
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
