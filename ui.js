(function () {
'use strict';
const WORKS = [{"file": "poster-chess-crown.jpg", "title": "Stunning graphic solutions", "cat": "posters", "sq": false}, {"file": "brand-aetheria.jpg", "title": "Aetheria identity", "cat": "identity", "sq": true}, {"file": "poster-loyalty-chess.jpg", "title": "Build strong customer loyalty", "cat": "posters", "sq": false}, {"file": "brand-cyto.jpg", "title": "Cyto Gurus logo", "cat": "identity", "sq": true}, {"file": "poster-creativity-redhat.jpg", "title": "Creativity", "cat": "posters", "sq": false}, {"file": "brand-void.jpg", "title": "Void Art identity", "cat": "identity", "sq": true}, {"file": "poster-frame-girl.jpg", "title": "Elevate your brand", "cat": "posters", "sq": false}, {"file": "brand-naqaa.jpg", "title": "Naqaa logo", "cat": "identity", "sq": true}, {"file": "poster-cheetah-brand.jpg", "title": "Unique branding identity", "cat": "posters", "sq": false}, {"file": "brand-hookah.jpg", "title": "Al-Shaalan logo", "cat": "identity", "sq": true}, {"file": "poster-dartboard.jpg", "title": "Creative design captures attention", "cat": "posters", "sq": false}, {"file": "brand-law.jpg", "title": "Law office logo", "cat": "identity", "sq": true}, {"file": "poster-what-reminds.jpg", "title": "What does this remind you of?", "cat": "posters", "sq": false}, {"file": "poster-jumaa-calligraphy.jpg", "title": "Friday greeting, calligraphy", "cat": "campaigns", "sq": false}, {"file": "poster-jumaa-mosque.jpg", "title": "Friday greeting, mosque", "cat": "campaigns", "sq": false}, {"file": "poster-mario-colors.jpg", "title": "Design tips: color perception", "cat": "posters", "sq": false}, {"file": "poster-warrior-didyouknow.jpg", "title": "Design facts series", "cat": "posters", "sq": false}, {"file": "poster-client-lens.jpg", "title": "Design tips: the client lens", "cat": "posters", "sq": false}, {"file": "poster-quality-problem.jpg", "title": "Design tips: quality problem", "cat": "posters", "sq": false}, {"file": "poster-employee-touch.jpg", "title": "Design tips: the extra touch", "cat": "posters", "sq": false}, {"file": "camp-finance-moneybag.jpg", "title": "Finance campaign: extra money", "cat": "campaigns", "sq": false}, {"file": "camp-finance-phone.jpg", "title": "Finance campaign: mobile", "cat": "campaigns", "sq": false}, {"file": "camp-finance-piggy.jpg", "title": "Finance campaign: budget", "cat": "campaigns", "sq": false}, {"file": "camp-logistics-returns.jpg", "title": "Logistics campaign: returns", "cat": "campaigns", "sq": false}, {"file": "camp-logistics-handshake.jpg", "title": "Logistics campaign: punctuality", "cat": "campaigns", "sq": false}, {"file": "camp-logistics-truck.jpg", "title": "Logistics campaign: fleet", "cat": "campaigns", "sq": false}, {"file": "camp-amarelo-heart.jpg", "title": "Awareness campaign: ribbon", "cat": "campaigns", "sq": false}, {"file": "camp-amarelo-bubble.jpg", "title": "Awareness campaign: talk", "cat": "campaigns", "sq": false}, {"file": "camp-amarelo-sunflower.jpg", "title": "Awareness campaign: hope", "cat": "campaigns", "sq": false}, {"file": "camp-amarelo-smile.jpg", "title": "Awareness campaign: support", "cat": "campaigns", "sq": false}, {"file": "poster-nordestino-1.jpg", "title": "Regional day campaign", "cat": "campaigns", "sq": false}, {"file": "poster-nordestino-2.jpg", "title": "Regional day: family", "cat": "campaigns", "sq": false}, {"file": "camp-nordestino-3.jpg", "title": "Regional day: warmth", "cat": "campaigns", "sq": false}];
const CALLOUTS = [["Brand identity with a point of view", "left", 38, 0.14, 0.27], ["Design that earns attention", "right", 58, 0.16, 0.27], ["Motion that gives ideas a pulse", "left", 60, 0.42, 0.55], ["Consistency across every channel", "right", 36, 0.43, 0.55], ["From first sketch to final launch", "left", 40, 0.7, 0.83], ["Six years. Five countries. One voice.", "right", 56, 0.71, 0.83]];
const MT = window.MT = { scroll: 0, target: 0, mx: 0, my: 0, tmx: 0, tmy: 0 };
const stage = document.getElementById('stage');
const isTouch = matchMedia('(pointer: coarse)').matches;

function splitTitlesIntoChars() {
  document.querySelectorAll('.slide-title').forEach(title => {
    let html = '', n = 0;
    title.innerHTML.split(/(<br\s*\/?>)/i).forEach(part => {
      if (part.toLowerCase().startsWith('<br')) { html += part; return; }
      for (const ch of part) {
        if (ch === ' ') html += ' ';
        else { html += `<span class="char" style="transition-delay: ${n * 0.035}s">${ch}</span>`; n++; }
      }
    });
    title.innerHTML = html;
  });
}

function updateGridDots(scroll) {
  document.querySelectorAll('.grid-dot').forEach((dot, i) => {
    const startY = (i * 17) % 80 + 10;
    let speed = 90 + (i * 55) % 180;
    if (i % 2 === 0) speed = -speed;
    let y = startY + scroll * speed;
    y = ((y % 100) + 100) % 100;
    dot.style.top = `${y}%`;
  });
}

function updateSlides(scroll) {
  const s = (id) => document.getElementById(id);
  for (let i = 1; i <= 4; i++) {
    const fill = s(`dash-fill-${i}`);
    if (fill) {
      const start = (i - 1) * 0.25, end = i * 0.25;
      const p = Math.max(0, Math.min(1, (scroll - start) / (end - start)));
      fill.style.height = `${p * 100}%`;
    }
  }
  const on = (v, a, b) => v >= a && v <= b;
  s('slide-1').classList.toggle('active', on(scroll, -0.10, 0.12));
  const a2 = on(scroll, 0.28, 0.40);
  s('slide-2').classList.toggle('active', a2);
  s('slide-2-img').classList.toggle('active', a2);
  s('slide-3').classList.toggle('active', on(scroll, 0.56, 0.68));
  s('slide-4').classList.toggle('active', on(scroll, 0.84, 1.05));
}

/* ---------- status pill (3D loading / errors) ---------- */
const statusEl = document.getElementById('status');
MT.status = (msg, bad) => { if (!statusEl) return; if (!msg) { statusEl.hidden = true; return; } statusEl.hidden = false; statusEl.textContent = msg; statusEl.classList.toggle('bad', !!bad); };

/* ---------- orbit phrases ---------- */
const callEls = [];
(function () {
  const wrap = document.getElementById('callouts');
  CALLOUTS.forEach(([text, side, top, a, b], i) => {
    const el = document.createElement('div');
    el.className = 'callout ' + side + (i % 2 ? ' b' : '');
    el.style.top = top + '%';
    const dot = document.createElement('span'); dot.className = 'dot';
    const line = document.createElement('span'); line.className = 'line';
    const p = document.createElement('p'); p.textContent = text;
    el.append(...(side === 'left' ? [p, line, dot] : [dot, line, p]));
    wrap.appendChild(el); callEls.push({ el, a, b });
  });
})();

/* ---------- gallery ---------- */
const grid = document.getElementById('gallery'), moreBtn = document.getElementById('more');
const dlg = document.getElementById('dlg'), bigImg = document.getElementById('big'), capEl = document.getElementById('cap');
const labels = { identity: 'Identity', campaigns: 'Campaign', posters: 'Poster' };
let filter = 'all', shown = 12, cur = 0;
const listWorks = () => WORKS.filter((w) => filter === 'all' || w.cat === filter);
function renderGallery() {
  const items = listWorks();
  grid.textContent = '';
  items.slice(0, shown).forEach((w, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'tile' + (w.sq ? ' sq' : ''); b.setAttribute('aria-label', w.title);
    const img = document.createElement('img');
    img.src = w.file; img.alt = w.title; img.loading = 'lazy'; img.decoding = 'async'; img.onerror = () => b.remove();
    const cap = document.createElement('span'); cap.className = 'cap';
    const sm = document.createElement('small'); sm.textContent = labels[w.cat];
    cap.append(sm, document.createTextNode(w.title));
    b.append(img, cap);
    b.addEventListener('click', () => openBox(i));
    grid.appendChild(b);
  });
  moreBtn.hidden = items.length <= shown;
}
function showBox(i) {
  const items = listWorks();
  cur = (i + items.length) % items.length;
  bigImg.src = items[cur].file; bigImg.alt = items[cur].title; capEl.textContent = items[cur].title;
}
function openBox(i) { showBox(i); dlg.showModal(); }
document.getElementById('prev').addEventListener('click', () => showBox(cur - 1));
document.getElementById('next').addEventListener('click', () => showBox(cur + 1));
document.getElementById('close').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', (e) => { if (!e.target.closest('img,button,p')) dlg.close(); });
window.addEventListener('keydown', (e) => {
  if (!dlg.open) return;
  if (e.key === 'ArrowRight') showBox(cur + 1);
  if (e.key === 'ArrowLeft') showBox(cur - 1);
});
let tx = 0;
bigImg.addEventListener('touchstart', (e) => { tx = e.changedTouches[0].clientX; }, { passive: true });
bigImg.addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) showBox(cur + (dx < 0 ? 1 : -1)); }, { passive: true });
document.querySelectorAll('.filters button').forEach((btn) => btn.addEventListener('click', () => {
  filter = btn.dataset.f; shown = 12;
  document.querySelectorAll('.filters button').forEach((x) => x.setAttribute('aria-pressed', x === btn));
  renderGallery();
}));
moreBtn.addEventListener('click', () => { shown += 12; renderGallery(); });
renderGallery();

/* ---------- navigation ---------- */
(function () {
  const targets = [0.0, 0.34, 0.62];
  document.querySelectorAll('.nav-link').forEach((link, i) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (i === 3) { document.getElementById('work').scrollIntoView({ behavior: 'smooth' }); return; }
      window.scrollTo({ top: (stage.offsetHeight - innerHeight) * targets[i], behavior: 'smooth' });
    });
  });
  const cb = document.querySelector('.contact-btn');
  if (cb) cb.addEventListener('click', (e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }); });
})();

/* ---------- pointer + cursor ---------- */
let cursorX = innerWidth / 2, cursorY = innerHeight / 2, outerX = cursorX, outerY = cursorY;
const curIn = document.querySelector('.cursor-inner'), curOut = document.querySelector('.cursor-outer');
window.addEventListener('mousemove', (e) => {
  cursorX = e.clientX; cursorY = e.clientY;
  if (curIn) { curIn.style.left = cursorX + 'px'; curIn.style.top = cursorY + 'px'; }
  MT.tmx = (e.clientX / innerWidth) * 2 - 1;
  MT.tmy = (e.clientY / innerHeight) * 2 - 1;
});

/* ---------- scroll-driven music ---------- */
const snd = document.getElementById('snd');
let enabled = true;
try { enabled = localStorage.getItem('mt-sound') !== 'off'; } catch (e) {}
let ctx = null, gain = null, buf = null, src = null, loading = false;
let playing = false, startedAt = 0, offset = 0, stopTimer = 0, lastTarget = -1, lastScrollT = 0, unlocked = false;
function paintBtn() {
  if (!snd) return;
  snd.classList.toggle('on', enabled && unlocked && playing);
  snd.classList.toggle('attn', enabled && !unlocked);
  snd.setAttribute('aria-pressed', String(enabled));
  snd.querySelector('.lbl').textContent = !enabled ? 'Sound off' : (unlocked ? 'Sound on' : 'Tap for sound');
}
function ensureCtx() {
  if (ctx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  gain = ctx.createGain(); gain.gain.value = 0; gain.connect(ctx.destination);
}
function loadBuf() {
  if (buf || loading || !ctx) return;
  loading = true;
  fetch('music.m4a').then((r) => r.arrayBuffer())
    .then((ab) => new Promise((res, rej) => ctx.decodeAudioData(ab, res, rej)))
    .then((b) => { buf = b; }).catch((e) => console.warn('audio', e)).finally(() => { loading = false; });
}
function unlock() {
  if (!enabled) return;
  ensureCtx();
  if (!ctx) return;
  ctx.resume().then(() => { unlocked = true; loadBuf(); paintBtn(); }).catch(() => {});
}
['pointerup', 'touchend', 'click', 'keydown'].forEach((ev) => window.addEventListener(ev, () => { if (!unlocked) unlock(); }, { passive: true }));
if (snd) snd.addEventListener('click', (e) => {
  e.stopPropagation();
  enabled = !enabled;
  try { localStorage.setItem('mt-sound', enabled ? 'on' : 'off'); } catch (err) {}
  if (enabled) { unlock(); } else if (gain) { gain.gain.setTargetAtTime(0, ctx.currentTime, 0.15); }
  paintBtn();
});
function startMusic() {
  if (playing || !buf || !ctx) return;
  src = ctx.createBufferSource(); src.buffer = buf; src.loop = true; src.connect(gain);
  src.start(0, offset % buf.duration); startedAt = ctx.currentTime; playing = true;
  paintBtn();
}
function stopMusic() {
  if (!playing) return;
  offset = (offset + ctx.currentTime - startedAt) % buf.duration;
  try { src.stop(); } catch (e) {}
  playing = false; paintBtn();
}
function musicTick(vel) {
  if (!ctx || !unlocked || !buf) return;
  const active = enabled && performance.now() - lastScrollT < 280;
  if (active) {
    clearTimeout(stopTimer); stopTimer = 0;
    startMusic();
    const target = 0.2 + Math.min(1, vel / 30) * 0.45;      // faster scroll = a little louder
    if (Math.abs(target - lastTarget) > 0.03) { gain.gain.setTargetAtTime(target, ctx.currentTime, 0.25); lastTarget = target; }
  } else if (playing && !stopTimer) {
    gain.gain.setTargetAtTime(0, ctx.currentTime, 0.3); lastTarget = 0;   // soft fade out
    stopTimer = setTimeout(() => { stopTimer = 0; stopMusic(); }, 1500);
  }
}
window.addEventListener('scroll', () => { lastScrollT = performance.now(); }, { passive: true });
document.addEventListener('visibilitychange', () => { if (document.hidden && ctx) { lastScrollT = 0; } });
paintBtn();

/* ---------- main UI loop ---------- */
const hint = document.getElementById('hint');
let lastY = scrollY, vel = 0;
splitTitlesIntoChars();
function loop() {
  requestAnimationFrame(loop);
  const maxScroll = stage.offsetHeight - innerHeight;
  MT.target = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
  MT.scroll += (MT.target - MT.scroll) * 0.025;
  MT.mx += (MT.tmx - MT.mx) * 0.05;
  MT.my += (MT.tmy - MT.my) * 0.05;
  vel += (Math.abs(scrollY - lastY) - vel) * 0.2; lastY = scrollY;
  outerX += (cursorX - outerX) * 0.2; outerY += (cursorY - outerY) * 0.2;
  if (curOut && !isTouch) { curOut.style.left = outerX + 'px'; curOut.style.top = outerY + 'px'; }
  updateSlides(MT.scroll);
  updateGridDots(MT.scroll);
  callEls.forEach((c) => c.el.classList.toggle('active', MT.scroll >= c.a && MT.scroll <= c.b));
  if (hint) hint.classList.toggle('gone', scrollY > 40);
  musicTick(vel);
}
loop();
})();
