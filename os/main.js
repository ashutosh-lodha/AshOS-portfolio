import './style.css';
import { profile, projects, links, stats, chapters } from '../src/shared/content.js';
import { $, $$, copyButtons, buildStamp, reducedMotion } from '../src/shared/utils.js';

const mobile = () => innerWidth < 760;
const proj = Object.fromEntries(projects.map((p) => [p.id, p]));

/* ── Icons (chunky inline SVG) ───────────────────────────────── */
const I = {
  about: '<svg viewBox="0 0 48 48"><rect x="6" y="8" width="36" height="32" rx="6" fill="#fff6e0" stroke="#1b1530" stroke-width="3"/><circle cx="18" cy="22" r="6" fill="#ff8a65" stroke="#1b1530" stroke-width="3"/><path d="M10 36c2-6 14-6 16 0" fill="#ff8a65" stroke="#1b1530" stroke-width="3"/><path d="M29 18h8M29 25h8M29 32h5" stroke="#1b1530" stroke-width="3" stroke-linecap="round"/></svg>',
  folder: '<svg viewBox="0 0 48 48"><path d="M4 14a4 4 0 0 1 4-4h11l4 5h17a4 4 0 0 1 4 4v19a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" fill="#ffd166" stroke="#1b1530" stroke-width="3"/><path d="M4 20h40" stroke="#1b1530" stroke-width="3"/></svg>',
  terminal: '<svg viewBox="0 0 48 48"><rect x="4" y="8" width="40" height="32" rx="6" fill="#1b1530" stroke="#1b1530" stroke-width="3"/><path d="M12 18l7 6-7 6" fill="none" stroke="#7cf29c" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M23 31h12" stroke="#7cf29c" stroke-width="3.5" stroke-linecap="round"/></svg>',
  monitor: '<svg viewBox="0 0 48 48"><rect x="4" y="8" width="40" height="28" rx="5" fill="#bde0fe" stroke="#1b1530" stroke-width="3"/><path d="M10 28l7-8 6 5 7-10 8 8" fill="none" stroke="#1b1530" stroke-width="3" stroke-linejoin="round"/><path d="M18 42h12M24 36v6" stroke="#1b1530" stroke-width="3" stroke-linecap="round"/></svg>',
  mail: '<svg viewBox="0 0 48 48"><rect x="4" y="10" width="40" height="28" rx="5" fill="#ffafcc" stroke="#1b1530" stroke-width="3"/><path d="M6 13l18 14 18-14" fill="none" stroke="#1b1530" stroke-width="3" stroke-linejoin="round"/></svg>',
  trash: '<svg viewBox="0 0 48 48"><path d="M12 14h24l-2 28H14z" fill="#e2e2ea" stroke="#1b1530" stroke-width="3" stroke-linejoin="round"/><path d="M8 14h32M19 14v-4h10v4M20 20v16M28 20v16" stroke="#1b1530" stroke-width="3" stroke-linecap="round"/></svg>',
  app: (c, t) => `<svg viewBox="0 0 48 48"><rect x="5" y="5" width="38" height="38" rx="11" fill="${c}" stroke="#1b1530" stroke-width="3"/><text x="24" y="31" text-anchor="middle" font-family="Silkscreen, monospace" font-size="16" fill="#1b1530">${t}</text></svg>`,
  cert: '<svg viewBox="0 0 48 48"><path d="M24 4l17 10v20L24 44 7 34V14z" fill="#232f3e" stroke="#1b1530" stroke-width="3"/><text x="24" y="29" text-anchor="middle" font-family="Silkscreen, monospace" font-size="11" fill="#ffb547">AWS</text></svg>',
};
const short = { archboard: 'AB', datadrop: 'DD', uptimehq: 'UP', idp: 'K8', gate: 'RG' };

/* ── Apps ─────────────────────────────────────────────────────── */
const apps = {
  about: { title: 'About.txt', icon: I.about, w: 520, h: 560, render: aboutApp },
  projects: { title: 'Projects', icon: I.folder, w: 560, h: 380, render: projectsApp },
  terminal: { title: 'Terminal — ash@ashos', icon: I.terminal, w: 620, h: 420, render: terminalApp },
  monitor: { title: 'System Monitor', icon: I.monitor, w: 560, h: 470, render: monitorApp },
  mail: { title: 'Contact', icon: I.mail, w: 480, h: 520, render: mailApp },
  cert: { title: 'AWS Certificate', icon: I.cert, w: 400, h: 420, render: certApp },
  trash: { title: 'Trash', icon: I.trash, w: 420, h: 300, render: trashApp },
};
projects.forEach((p) => { apps[p.id] = { title: `${p.name}.app`, icon: I.app(p.color, short[p.id]), w: 640, h: 600, render: (el) => projectApp(el, p) }; });

const liveProjects = projects.filter((p) => p.live);
const desktopIcons = ['about', 'projects', ...liveProjects.map((p) => p.id), 'terminal', 'monitor', 'cert', 'mail', 'trash'];
const dockApps = ['about', 'projects', 'terminal', 'monitor', 'mail'];
const label = (id) => ({ about: 'About.txt', projects: 'Projects', terminal: 'Terminal', monitor: 'Monitor', mail: 'Contact', cert: 'AWS cert', trash: 'Trash' }[id] || apps[id].title);

$('[data-icons]').innerHTML = desktopIcons.map((id) => `<li><button class="icon" data-icon="${id}">${apps[id].icon}<span>${label(id)}</span></button></li>`).join('');
$('[data-dock]').innerHTML = dockApps.map((id) => `<button class="dock__app" data-open="${id}" title="${label(id)}">${apps[id].icon}<i></i></button>`).join('');

/* ── Window manager ───────────────────────────────────────────── */
const layer = $('[data-windows]');
const open = new Map();
let z = 10;
let cascade = 0;

function focusWin(win) {
  win.style.zIndex = ++z;
  $$('.win').forEach((w) => w.classList.toggle('is-focus', w === win));
}

function openApp(id) {
  const app = apps[id];
  if (!app) return;
  if (open.has(id)) {
    const w = open.get(id);
    w.classList.remove('is-min');
    focusWin(w);
    syncDock();
    return;
  }
  const win = document.createElement('section');
  win.className = 'win';
  win.setAttribute('role', 'dialog');
  win.setAttribute('aria-label', app.title);
  const dw = innerWidth, dh = innerHeight;
  const w = Math.min(app.w, dw - 40), h = Math.min(app.h, dh - 140);
  const x = Math.max(16, Math.min(dw - w - 16, dw * 0.3 + cascade * 34 - 120));
  const y = Math.max(52, Math.min(dh - h - 90, 70 + cascade * 30));
  cascade = (cascade + 1) % 6;
  Object.assign(win.style, { width: `${w}px`, height: `${h}px`, left: `${x}px`, top: `${y}px` });
  win.innerHTML = `<header class="win__bar"><div class="win__btns"><button class="b-close" aria-label="Close"></button><button class="b-min" aria-label="Minimise"></button><button class="b-max" aria-label="Maximise"></button></div><h2>${app.title}</h2><span class="win__grip"></span></header><div class="win__body"></div>`;
  layer.appendChild(win);
  app.render($('.win__body', win), win);
  open.set(id, win);
  focusWin(win);
  if (!reducedMotion()) win.animate([{ transform: 'scale(.92)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 260, easing: 'cubic-bezier(.19,1,.22,1)' });

  win.addEventListener('pointerdown', () => focusWin(win));
  $('.b-close', win).addEventListener('click', () => { win.remove(); open.delete(id); syncDock(); });
  $('.b-min', win).addEventListener('click', () => { win.classList.add('is-min'); syncDock(); });
  $('.b-max', win).addEventListener('click', () => win.classList.toggle('is-max'));
  $('.win__bar', win).addEventListener('dblclick', () => win.classList.toggle('is-max'));
  drag(win, $('.win__bar', win));
  syncDock();
}

function drag(win, handle) {
  let sx, sy, ox, oy, on = false;
  handle.addEventListener('pointerdown', (e) => {
    if (mobile() || e.target.closest('button') || win.classList.contains('is-max')) return;
    on = true; sx = e.clientX; sy = e.clientY; ox = win.offsetLeft; oy = win.offsetTop;
    handle.setPointerCapture(e.pointerId);
    win.classList.add('is-drag');
  });
  handle.addEventListener('pointermove', (e) => {
    if (!on) return;
    win.style.left = `${Math.max(-win.offsetWidth + 80, Math.min(innerWidth - 80, ox + e.clientX - sx))}px`;
    win.style.top = `${Math.max(36, Math.min(innerHeight - 60, oy + e.clientY - sy))}px`;
  });
  const end = () => { on = false; win.classList.remove('is-drag'); };
  handle.addEventListener('pointerup', end);
  handle.addEventListener('pointercancel', end);
}

function syncDock() {
  $$('.dock__app').forEach((b) => b.classList.toggle('is-open', open.has(b.dataset.open)));
}

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-open]');
  if (t) { e.preventDefault(); openApp(t.dataset.open); }
});
// icons: single click selects / double click opens (tap opens on touch)
$$('.icon').forEach((b) => {
  b.addEventListener('click', () => {
    if (mobile() || matchMedia('(pointer: coarse)').matches) return openApp(b.dataset.icon);
    $$('.icon').forEach((x) => x.classList.toggle('is-sel', x === b));
  });
  b.addEventListener('dblclick', () => openApp(b.dataset.icon));
  b.addEventListener('keydown', (e) => { if (e.key === 'Enter') openApp(b.dataset.icon); });
});

/* ── App renderers ───────────────────────────────────────────── */
function aboutApp(el) {
  el.classList.add('doc');
  el.innerHTML = `
    <h3 class="doc__title">Ashutosh Lodha</h3>
    <p class="doc__sub">Software Engineer · AWS Certified Solutions Architect</p>
    <p>${profile.tagline}</p>
    <p>I like systems that stay up — ones that scale quietly, fail loudly, and tell you exactly why.</p>
    <h4>Path</h4>
    <ul class="tl">
      <li><b>2024–25</b> Research Analyst · Copperpod IP — source code review, infringement &amp; prior-art claim charts</li>
      <li><b>2023</b> Python Developer Intern · HERE Technologies — Scrapy geolocation pipelines → GeoJSON</li>
      <li><b>2022</b> Summer Intern · GAIL (India) — built Tourney, an event registration platform</li>
      <li><b>2020–24</b> B.Tech CSE, Cloud Computing &amp; Virtualization · UPES Dehradun — CGPA 8.35</li>
    </ul>
    <h4>Now</h4>
    <p>${profile.status}.</p>
    <div class="row"><button class="btn" data-open="projects">Open Projects</button><button class="btn btn--ghost" data-open="mail">Say hi</button></div>`;
}

function projectsApp(el) {
  el.classList.add('folder');
  el.innerHTML = `<ul class="grid">${projects.map((p) => `<li><button class="icon icon--dark" data-open="${p.id}">${apps[p.id].icon}<span>${p.name}.app</span></button></li>`).join('')}</ul>
    <p class="folder__foot">${projects.length} items · click to open</p>`;
}

function projectApp(el, p) {
  el.classList.add('doc', 'doc--project');
  el.style.setProperty('--accent', p.color);
  el.innerHTML = `
    <img class="shot" src="${p.shot}" alt="${p.name} screenshot" />
    <div class="doc__head"><h3 class="doc__title">${p.name}</h3>${p.live ? '<span class="ping" data-pingme><i></i><b>pinging…</b></span>' : ''}</div>
    <p class="doc__sub">${p.year} · ${p.role}</p>
    <p class="lede">${p.lede}</p>
    <ul class="pts">${p.points.map((x) => `<li>${x}</li>`).join('')}</ul>
    <p class="chips">${p.stack.map((s) => `<span>${s}</span>`).join('')}</p>
    <div class="row">${p.live ? `<a class="btn" href="${p.live}" target="_blank" rel="noopener">Open live ↗</a>` : ''}<a class="btn btn--ghost" href="${p.source}" target="_blank" rel="noopener">Source ↗</a></div>`;
  if (p.live) {
    const badge = $('[data-pingme]', el);
    ping(p.live).then((ms) => { badge.classList.add(ms != null ? 'is-up' : 'is-down'); $('b', badge).textContent = ms != null ? `live · ${ms} ms` : 'unreachable'; });
  }
}

function certApp(el) {
  el.classList.add('doc', 'doc--center');
  el.innerHTML = `<img src="${profile.cert.img}" alt="AWS Certified Solutions Architect – Associate badge" width="180" height="180" />
    <h3 class="doc__title">${profile.cert.name}</h3>
    <a class="btn" href="${profile.cert.url}" target="_blank" rel="noopener">Verify on Credly ↗</a>`;
}

function trashApp(el) {
  el.classList.add('doc', 'mono');
  el.innerHTML = `<p><b>bugs.log</b> — 0 bytes</p><p>All bugs found in production have been fixed, tested and thrown away here.</p><p>Empty trash? <button class="btn btn--ghost" data-empty>Yes</button></p>`;
  $('[data-empty]', el).addEventListener('click', (e) => { e.target.closest('p').textContent = 'Trash emptied. Nothing to see. ✓'; });
}

function mailApp(el) {
  el.classList.add('doc', 'mail');
  el.innerHTML = `
    <label>To <input value="${profile.email}" readonly /></label>
    <label>Subject <input name="s" value="Hello from your portfolio" /></label>
    <label class="grow">Message <textarea name="m" placeholder="Hi Ashutosh, we'd love to talk about…"></textarea></label>
    <div class="row"><button class="btn" data-send>Send ↗</button><button class="btn btn--ghost" data-copy="${profile.email}">Copy address</button></div>
    <p class="links">${links.filter((l) => l.label !== 'Email').map((l) => `<a href="${l.url}" target="_blank" rel="noopener">${l.label} ↗</a>`).join('')}</p>`;
  $('[data-send]', el).addEventListener('click', () => {
    const s = encodeURIComponent($('[name=s]', el).value);
    const m = encodeURIComponent($('[name=m]', el).value);
    window.location.href = `mailto:${profile.email}?subject=${s}&body=${m}`;
  });
  copyButtons('Address copied ✦');
}

async function ping(url) {
  try {
    const t0 = performance.now();
    await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: AbortSignal.timeout(8000) });
    const t1 = performance.now();
    await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: AbortSignal.timeout(8000) });
    return Math.round(Math.min(t1 - t0, performance.now() - t1));
  } catch { return null; }
}

function monitorApp(el, win) {
  el.classList.add('doc', 'monitor');
  const L = stats.leetcode;
  const live = liveProjects;
  el.innerHTML = `
    <h4>Network · live latency from your browser</h4>
    ${live.map((p) => `<div class="net" data-net="${p.id}"><div class="net__head"><span><i style="background:${p.color}"></i>${p.name}</span><b>—</b></div><canvas width="480" height="70"></canvas></div>`).join('')}
    <h4>Processes · LeetCode</h4>
    <div class="bars">
      ${[['easy', L.easy, '#2fb36b'], ['medium', L.medium, '#ff9f0a'], ['hard', L.hard, '#e8332a']].map(([n, v, c]) => `<div class="bar"><span>${n}</span><i><b style="width:${(v / L.total) * 100}%;background:${c}"></b></i><em>${v}</em></div>`).join('')}
      <p class="total">${L.total} solved · 200-day streak badge</p>
    </div>`;
  const series = Object.fromEntries(live.map((p) => [p.id, []]));
  const draw = (id, color) => {
    const c = $(`[data-net="${id}"] canvas`, el);
    const g = c.getContext('2d');
    const s = series[id];
    g.clearRect(0, 0, c.width, c.height);
    g.strokeStyle = 'rgba(27,21,48,.12)';
    for (let y = 0; y < c.height; y += 14) { g.beginPath(); g.moveTo(0, y); g.lineTo(c.width, y); g.stroke(); }
    if (s.length < 2) return;
    const max = Math.max(200, ...s.filter((v) => v != null));
    g.beginPath();
    s.forEach((v, i) => { const x = (i / 29) * c.width; const y = c.height - ((v ?? max) / max) * (c.height - 8) - 4; i ? g.lineTo(x, y) : g.moveTo(x, y); });
    g.strokeStyle = color; g.lineWidth = 3; g.stroke();
    g.lineTo(((s.length - 1) / 29) * c.width, c.height); g.lineTo(0, c.height); g.closePath();
    g.fillStyle = color + '33'; g.fill();
  };
  const tickNet = async () => {
    if (!document.body.contains(win)) return clearInterval(timer);
    for (const p of live) {
      const ms = await ping(p.live);
      const s = series[p.id]; s.push(ms); if (s.length > 30) s.shift();
      $(`[data-net="${p.id}"] b`, el).textContent = ms != null ? `${ms} ms` : 'down';
      draw(p.id, p.color);
    }
  };
  tickNet();
  const timer = setInterval(tickNet, 4000);
}

/* ── Terminal ─────────────────────────────────────────────────── */
function terminalApp(el) {
  el.classList.add('term');
  el.innerHTML = '<div class="term__out" aria-live="polite"></div><form class="term__line"><label>ash@ashos:~$</label><input autocomplete="off" spellcheck="false" aria-label="Terminal input" /></form>';
  const out = $('.term__out', el), input = $('input', el), form = $('form', el);
  const hist = []; let hi = 0;
  const print = (html, cls = '') => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; out.appendChild(d); el.scrollTop = el.scrollHeight; };
  const cmds = {
    help: () => 'commands: <b>whoami</b> <b>about</b> <b>projects</b> <b>open &lt;name&gt;</b> <b>skills</b> <b>experience</b> <b>leetcode</b> <b>contact</b> <b>neofetch</b> <b>clear</b> <b>sudo hire-me</b>',
    whoami: () => `${profile.name} — ${profile.role}. ${profile.tagline}`,
    about: () => { openApp('about'); return 'opening About.txt…'; },
    ls: () => ['About.txt', 'Projects/', ...projects.map((p) => `${p.name}.app`), 'bugs.log'].join('  '),
    projects: () => projects.map((p) => `<b>${p.name.padEnd(10)}</b> ${p.lede}`).join('<br>'),
    open: (a) => {
      const q = (a || '').toLowerCase().replace(/\s|\.app/g, '');
      const hit = projects.find((p) => p.name.toLowerCase().replace(/\s/g, '').startsWith(q) || p.id.startsWith(q));
      if (!q) return `usage: open &lt;${projects.map((p) => p.id).join('|')}&gt;`;
      if (!hit) return `open: ${a}: no such app`;
      openApp(hit.id); return `launching ${hit.name}.app…`;
    },
    skills: () => chapters.find((c) => c.id === 'cloud').tools.join(' · '),
    experience: () => '2024–25 Research Analyst @ Copperpod IP<br>2023 Python Intern @ HERE Technologies<br>2022 Summer Intern @ GAIL (India)<br>2020–24 B.Tech CSE (Cloud) @ UPES · 8.35',
    leetcode: () => `${stats.leetcode.total} solved — easy ${stats.leetcode.easy} · medium ${stats.leetcode.medium} · hard ${stats.leetcode.hard}`,
    contact: () => `${profile.email}<br>${links.filter((l) => l.url.startsWith('http')).map((l) => `<a href="${l.url}" target="_blank" rel="noopener">${l.url.replace('https://', '')}</a>`).join('<br>')}`,
    neofetch: () => `<pre class="neo"><span class="c">   ▄▄▄▄▄▄   </span>  <b>ash</b>@<b>ashos</b>
<span class="c">  █▀    ▀█  </span>  ----------------
<span class="c">  █  ◐   █  </span>  <b>OS</b>: AshOS 26.11
<span class="c">  █▄    ▄█  </span>  <b>Role</b>: Software Engineer
<span class="c">   ▀▀▀▀▀▀   </span>  <b>Cert</b>: AWS SA — Associate
              <b>Shell</b>: Go, TypeScript, Python
              <b>Uptime</b>: ${liveProjects.map((p) => p.name).join(', ')}
              <b>LeetCode</b>: ${stats.leetcode.total} solved</pre>`,
    'sudo': (a) => (a === 'hire-me' ? (openApp('mail'), '[sudo] permission granted. opening Contact… 🎉') : 'sudo: try <b>sudo hire-me</b>'),
    clear: () => { out.innerHTML = ''; return null; },
  };
  print('AshOS terminal 26.11 — type <b>help</b> to begin.', 'dim');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = input.value.trim();
    input.value = '';
    print(`<span class="p">ash@ashos:~$</span> ${raw.replace(/</g, '&lt;')}`);
    if (!raw) return;
    hist.push(raw); hi = hist.length;
    const [c, ...rest] = raw.split(/\s+/);
    const fn = cmds[c.toLowerCase()];
    const res = fn ? fn(rest.join(' ')) : `${c}: command not found — try <b>help</b>`;
    if (res) print(res);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') { hi = Math.max(0, hi - 1); input.value = hist[hi] || ''; e.preventDefault(); }
    if (e.key === 'ArrowDown') { hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ''; e.preventDefault(); }
  });
  el.addEventListener('click', () => input.focus());
  setTimeout(() => input.focus({ preventScroll: true }), 50);
}

/* ── Clock ────────────────────────────────────────────────────── */
const clock = $('[data-clock]');
const tick = () => { clock.textContent = new Date().toLocaleString('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }) + ' IST'; };
tick(); setInterval(tick, 15000);

/* ── Boot ─────────────────────────────────────────────────────── */
const boot = $('.boot');
const log = $('.boot__log');
const lines = [
  'AshOS 26.11 — booting',
  `[  ok  ] mounting /home/ashutosh`,
  `[  ok  ] loading cloud drivers: aws, kubernetes, docker`,
  `[  ok  ] starting services: ${liveProjects.map((p) => p.id).join(', ')}`,
  `[  ok  ] leetcode daemon: ${stats.leetcode.total} solved`,
  `[  ok  ] ${buildStamp()}`,
  'welcome.',
];
function finishBoot() {
  boot.classList.add('is-done');
  setTimeout(() => boot.remove(), 600);
  if (!mobile()) { openApp('about'); }
}
if (reducedMotion() || sessionStorage.getItem('ashos-booted')) { boot.remove(); if (!mobile()) openApp('about'); }
else {
  sessionStorage.setItem('ashos-booted', '1');
  let i = 0;
  const step = () => { if (i < lines.length) { log.textContent += lines[i++] + '\n'; setTimeout(step, 170); } else setTimeout(finishBoot, 300); };
  step();
  boot.addEventListener('click', finishBoot, { once: true });
}

