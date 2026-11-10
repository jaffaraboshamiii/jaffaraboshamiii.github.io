(function () {
'use strict';
const SECTIONS = [{"key": "covers", "grp": "covers", "title": "Signature Covers", "sub": "Bold openers from my portfolio"}, {"key": "fantasy", "grp": "characters", "title": "Characters & Fantasy", "sub": "Game heroes, dragons and mythic worlds"}, {"key": "auto", "grp": "auto", "title": "Automotive", "sub": "Cars shown with speed, light and attitude"}, {"key": "luxury", "grp": "products", "title": "Luxury & Products", "sub": "Perfume and watches with a premium feel"}, {"key": "food", "grp": "food", "title": "Food & Restaurants", "sub": "Menus and ads that make you hungry"}, {"key": "sweets", "grp": "food", "title": "Halawanji Sweets", "sub": "Arabic desserts framed like gallery pieces"}, {"key": "tfaseel", "grp": "campaigns", "title": "Tfaseel Agency", "sub": "Social ads for every season and service"}, {"key": "mila", "grp": "campaigns", "title": "Milaknight", "sub": "Marketing posts for the Saudi market"}, {"key": "friday", "grp": "campaigns", "title": "Friday Greetings", "sub": "Weekly blessings with calligraphy"}, {"key": "posters", "grp": "posters", "title": "Creative Posters", "sub": "Ideas that stop the scroll"}, {"key": "tips", "grp": "posters", "title": "Design Tips & Facts", "sub": "A series that teaches while it looks good"}, {"key": "shaalan", "grp": "identity", "title": "Al-Shaalan", "sub": "Hookah and tobacco identity"}, {"key": "saja", "grp": "identity", "title": "Saja Nails", "sub": "A playful identity in soft pink"}, {"key": "law", "grp": "identity", "title": "Law Office", "sub": "Calm, trusted and built on Arabic calligraphy"}, {"key": "cute", "grp": "identity", "title": "Cute Animal", "sub": "Identity for an animal-help brand"}, {"key": "cyto", "grp": "identity", "title": "Cyto Gurus", "sub": "A science brand with a DNA twist"}, {"key": "naqaa", "grp": "identity", "title": "Naqaa", "sub": "Modern modest fashion identity"}, {"key": "more", "grp": "identity", "title": "More Identities", "sub": "Aetheria and Void Art"}];
const WORKS = [{"file": "cover-scorpion.jpg", "title": "My designs: Scorpion", "sec": "covers", "ar": 0.8003}, {"file": "cover-chess-king.jpg", "title": "My designs: the chess king", "sec": "covers", "ar": 0.8003}, {"file": "cover-pharaoh.jpg", "title": "My design: the golden pharaoh", "sec": "covers", "ar": 0.8003}, {"file": "cover-archer.jpg", "title": "My design: the archer", "sec": "covers", "ar": 0.8003}, {"file": "cover-pirate.jpg", "title": "My work: the pirate", "sec": "covers", "ar": 0.8003}, {"file": "cover-who-i-am.jpg", "title": "Who I am?", "sec": "covers", "ar": 0.8003}, {"file": "poster-red-hat.jpg", "title": "Design is more than looking good", "sec": "covers", "ar": 0.8003}, {"file": "fan-subzero.jpg", "title": "Sub-Zero", "sec": "fantasy", "ar": 0.8003}, {"file": "fan-slifer.jpg", "title": "Slifer the Sky Dragon", "sec": "fantasy", "ar": 0.8003}, {"file": "fan-ra.jpg", "title": "Winged Dragon of Ra", "sec": "fantasy", "ar": 0.8003}, {"file": "fan-desert-queen.jpg", "title": "Desert queen, calligraphy", "sec": "fantasy", "ar": 0.8003}, {"file": "auto-range-rover.jpg", "title": "Range Rover", "sec": "auto", "ar": 0.8003}, {"file": "auto-mustang.jpg", "title": "Ford Mustang", "sec": "auto", "ar": 0.8003}, {"file": "auto-porsche.jpg", "title": "Porsche GT3 RS", "sec": "auto", "ar": 0.8003}, {"file": "auto-amg.jpg", "title": "Mercedes AMG", "sec": "auto", "ar": 0.8003}, {"file": "lux-saja-perfume.jpg", "title": "Saja perfume", "sec": "luxury", "ar": 0.8003}, {"file": "lux-verutti-wrist.jpg", "title": "Verutti on the wrist", "sec": "luxury", "ar": 0.8}, {"file": "lux-verutti-design.jpg", "title": "Verutti Italian design", "sec": "luxury", "ar": 0.8}, {"file": "lux-verutti-dial.jpg", "title": "Verutti dial detail", "sec": "luxury", "ar": 0.8}, {"file": "food-akroshka.jpg", "title": "Akroshka", "sec": "food", "ar": 0.8003}, {"file": "food-green-soup.jpg", "title": "Amo Sami: green soup", "sec": "food", "ar": 0.8003}, {"file": "food-crispy.jpg", "title": "Amo Sami: crispy chicken", "sec": "food", "ar": 0.8003}, {"file": "food-pizza-frame.jpg", "title": "Amo Sami: pizza", "sec": "food", "ar": 0.8003}, {"file": "food-pizza-special.jpg", "title": "Amo Sami: special pizza", "sec": "food", "ar": 0.8003}, {"file": "food-shawarma.jpg", "title": "Delicious shawarma", "sec": "food", "ar": 0.8003}, {"file": "sweet-kunafa-cheese.jpg", "title": "Kunafa with cheese", "sec": "sweets", "ar": 0.8003}, {"file": "sweet-harissa.jpg", "title": "Harissa with walnuts", "sec": "sweets", "ar": 0.8003}, {"file": "sweet-kunafa-marble.jpg", "title": "Kunafa Halawanji", "sec": "sweets", "ar": 0.8003}, {"file": "sweet-pistachio-ice.jpg", "title": "Pistachio ice cream", "sec": "sweets", "ar": 0.8003}, {"file": "tf-winter-burger.jpg", "title": "Winter is coming", "sec": "tfaseel", "ar": 0.8003}, {"file": "tf-teeth.jpg", "title": "Just whitened your teeth?", "sec": "tfaseel", "ar": 0.8003}, {"file": "tf-persil.jpg", "title": "Softer than silk", "sec": "tfaseel", "ar": 0.8003}, {"file": "tf-kids.jpg", "title": "Understanding your child", "sec": "tfaseel", "ar": 0.8003}, {"file": "mila-trust.jpg", "title": "Value and trust", "sec": "mila", "ar": 0.8003}, {"file": "mila-edge.jpg", "title": "The competitive edge", "sec": "mila", "ar": 0.8003}, {"file": "poster-jumaa-calligraphy.jpg", "title": "Friday greeting, calligraphy", "sec": "friday", "ar": 0.8}, {"file": "poster-jumaa-mosque.jpg", "title": "Friday greeting, mosque", "sec": "friday", "ar": 0.8006}, {"file": "poster-chess-crown.jpg", "title": "Stunning graphic solutions", "sec": "posters", "ar": 0.8006}, {"file": "poster-loyalty-chess.jpg", "title": "Build strong customer loyalty", "sec": "posters", "ar": 0.8006}, {"file": "poster-creativity-redhat.jpg", "title": "Creativity", "sec": "posters", "ar": 0.8006}, {"file": "poster-frame-girl.jpg", "title": "Elevate your brand", "sec": "posters", "ar": 0.8006}, {"file": "poster-cheetah-brand.jpg", "title": "Unique branding identity", "sec": "posters", "ar": 0.8006}, {"file": "poster-dartboard.jpg", "title": "Creative design captures attention", "sec": "posters", "ar": 0.8006}, {"file": "poster-what-reminds.jpg", "title": "What does this remind you of?", "sec": "posters", "ar": 0.8006}, {"file": "poster-mario-colors.jpg", "title": "Design tips: color perception", "sec": "tips", "ar": 0.8}, {"file": "poster-client-lens.jpg", "title": "Design tips: the client lens", "sec": "tips", "ar": 0.8006}, {"file": "poster-quality-problem.jpg", "title": "Design tips: quality problem", "sec": "tips", "ar": 0.8006}, {"file": "poster-employee-touch.jpg", "title": "Design tips: the extra touch", "sec": "tips", "ar": 0.8006}, {"file": "poster-warrior-didyouknow.jpg", "title": "Design facts series", "sec": "tips", "ar": 0.8006}, {"file": "brand-hookah.jpg", "title": "Al-Shaalan logo", "sec": "shaalan", "ar": 1.0}, {"file": "sh-logo.jpg", "title": "Al-Shaalan logo", "sec": "shaalan", "ar": 0.8}, {"file": "sh-billboard.jpg", "title": "Billboard", "sec": "shaalan", "ar": 0.8}, {"file": "sh-shopfront.jpg", "title": "Shop sign", "sec": "shaalan", "ar": 0.8}, {"file": "sh-frame.jpg", "title": "Framed print", "sec": "shaalan", "ar": 0.8}, {"file": "sh-packaging.jpg", "title": "Bag and packaging", "sec": "shaalan", "ar": 0.8}, {"file": "sh-cards.jpg", "title": "Business cards", "sec": "shaalan", "ar": 0.8}, {"file": "sh-board.jpg", "title": "Street sign", "sec": "shaalan", "ar": 0.8}, {"file": "sh-card-metal.jpg", "title": "Card on metal", "sec": "shaalan", "ar": 0.8}, {"file": "saja-logo.jpg", "title": "Saja Nails logo", "sec": "saja", "ar": 0.8}, {"file": "saja-billboard.jpg", "title": "Billboard", "sec": "saja", "ar": 0.8008}, {"file": "saja-tote.jpg", "title": "Tote bag", "sec": "saja", "ar": 0.8008}, {"file": "saja-frame.jpg", "title": "Framed print", "sec": "saja", "ar": 0.8008}, {"file": "saja-notebook.jpg", "title": "Notebook", "sec": "saja", "ar": 0.8008}, {"file": "saja-tshirt.jpg", "title": "T-shirt", "sec": "saja", "ar": 0.8008}, {"file": "saja-cup.jpg", "title": "Cup and coffee mug", "sec": "saja", "ar": 0.8008}, {"file": "saja-bag-box.jpg", "title": "Bag and gift box", "sec": "saja", "ar": 0.8008}, {"file": "saja-cards.jpg", "title": "Business cards", "sec": "saja", "ar": 0.8008}, {"file": "saja-folder.jpg", "title": "Folder set", "sec": "saja", "ar": 0.8008}, {"file": "brand-law.jpg", "title": "Law office logo", "sec": "law", "ar": 1.0}, {"file": "law-logo.jpg", "title": "Law office logo", "sec": "law", "ar": 0.8}, {"file": "law-shelf.jpg", "title": "Framed on a shelf", "sec": "law", "ar": 0.8}, {"file": "law-frame.jpg", "title": "Wooden frame", "sec": "law", "ar": 0.8}, {"file": "law-brick.jpg", "title": "Wall sign", "sec": "law", "ar": 0.8}, {"file": "law-metal.jpg", "title": "Metal surface", "sec": "law", "ar": 0.8}, {"file": "cute-logo.jpg", "title": "Cute Animal logo", "sec": "cute", "ar": 0.8}, {"file": "cute-sign.jpg", "title": "Hanging sign", "sec": "cute", "ar": 0.8008}, {"file": "cute-thermos.jpg", "title": "Thermos", "sec": "cute", "ar": 0.8008}, {"file": "cute-tshirt.jpg", "title": "T-shirt", "sec": "cute", "ar": 0.8008}, {"file": "cute-dark.jpg", "title": "Dark version", "sec": "cute", "ar": 0.8}, {"file": "cute-cards.jpg", "title": "Business cards", "sec": "cute", "ar": 0.8008}, {"file": "cute-plaque.jpg", "title": "Brass plaque", "sec": "cute", "ar": 0.8008}, {"file": "brand-cyto.jpg", "title": "Cyto Gurus logo", "sec": "cyto", "ar": 1.0}, {"file": "cyto-logo.jpg", "title": "Cyto Gurus on cyan", "sec": "cyto", "ar": 0.8}, {"file": "cyto-dark.jpg", "title": "Dark version", "sec": "cyto", "ar": 0.8}, {"file": "cyto-billboard.jpg", "title": "Street billboard", "sec": "cyto", "ar": 0.8}, {"file": "cyto-phone.jpg", "title": "On the phone", "sec": "cyto", "ar": 0.8}, {"file": "cyto-cards.jpg", "title": "Business cards", "sec": "cyto", "ar": 0.8}, {"file": "brand-naqaa.jpg", "title": "Naqaa logo", "sec": "naqaa", "ar": 1.0}, {"file": "naqaa-logo.jpg", "title": "Naqaa logo", "sec": "naqaa", "ar": 0.8}, {"file": "naqaa-pack.jpg", "title": "Bag and box", "sec": "naqaa", "ar": 0.8}, {"file": "naqaa-label.jpg", "title": "Leather label", "sec": "naqaa", "ar": 0.8}, {"file": "naqaa-shirt.jpg", "title": "Embroidered shirt", "sec": "naqaa", "ar": 0.8}, {"file": "naqaa-thobe.jpg", "title": "Signature thobe", "sec": "naqaa", "ar": 0.8}, {"file": "brand-aetheria.jpg", "title": "Aetheria identity", "sec": "more", "ar": 1.0}, {"file": "brand-void.jpg", "title": "Void Art identity", "sec": "more", "ar": 1.0}];
const CALLOUTS = [["Brand identity with a point of view", "left", 38, 0.19, 0.27], ["Design that earns attention", "right", 58, 0.2, 0.27], ["Motion that gives ideas a pulse", "left", 60, 0.48, 0.56], ["Consistency across every channel", "right", 36, 0.49, 0.56], ["From first sketch to final launch", "left", 40, 0.77, 0.84], ["Six years. Five countries. One voice.", "right", 56, 0.78, 0.84]];
const MT = window.MT = { scroll: 0, target: 0, vel: 0, mx: 0, my: 0, tmx: 0, tmy: 0 };
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

function updateSlides(s) {
  const bounds = [0, 0.28, 0.57, 0.85, 1];
  for (let i = 1; i <= 4; i++) {
    const fill = document.getElementById('dash-fill-' + i);
    if (fill) fill.style.height = (Math.max(0, Math.min(1, (s - bounds[i - 1]) / (bounds[i] - bounds[i - 1]))) * 100) + '%';
  }
  for (let i = 1; i <= 4; i++) document.getElementById('slide-' + i).classList.toggle('active', chap === i - 1);
}

/* reveal-on-scroll for headings, glass cards, highlights and gallery tiles */
const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => {
  es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }) : null;
function reveal(el, delay) { if (!io) { el.classList.add('in'); return; } if (delay) el.style.transitionDelay = delay + 'ms'; io.observe(el); }
document.querySelectorAll('.rv, .hl').forEach((el) => reveal(el, 0));

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

/* ---------- gallery (sections) ---------- */
const grid = document.getElementById('gallery');
const dlg = document.getElementById('dlg'), bigImg = document.getElementById('big');
const capEl = document.getElementById('cap'), catEl = document.getElementById('cat'), cntEl = document.getElementById('cnt');
const secOf = (k) => SECTIONS.find((s) => s.key === k);
let filter = 'all', cur = 0, list = [];
function renderGallery() {
  list = SECTIONS.flatMap((s) => WORKS.filter((w) => w.sec === s.key && (filter === 'all' || s.grp === filter)));
  grid.textContent = '';
  SECTIONS.forEach((sec) => {
    const items = list.filter((w) => w.sec === sec.key);
    if (!items.length) return;
    const wrap = document.createElement('div'); wrap.className = 'gsec';
    const head = document.createElement('div'); head.className = 'ghead rv';
    const h = document.createElement('h3'); h.textContent = sec.title;
    const p = document.createElement('p'); p.textContent = sec.sub;
    const c = document.createElement('span'); c.className = 'gcount'; c.textContent = items.length + (items.length === 1 ? ' work' : ' works');
    head.append(h, p, c); wrap.appendChild(head); reveal(head, 0);
    const g = document.createElement('div'); g.className = 'gallery';
    items.forEach((w, j) => {
      const idx = list.indexOf(w);
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'tile rv'; b.style.setProperty('--ar', w.ar); b.setAttribute('aria-label', w.title);
      const img = document.createElement('img');
      img.src = w.file; img.alt = w.title; img.loading = 'lazy'; img.decoding = 'async'; img.onerror = () => b.remove();
      const cap = document.createElement('span'); cap.className = 'cap';
      const sm = document.createElement('small'); sm.textContent = sec.title;
      cap.append(sm, document.createTextNode(w.title));
      b.append(img, cap);
      b.addEventListener('click', () => openBox(idx));
      g.appendChild(b); reveal(b, (j % 4) * 90);
    });
    wrap.appendChild(g); grid.appendChild(wrap);
  });
}
function showBox(i) {
  cur = (i + list.length) % list.length;
  bigImg.classList.remove('swap'); void bigImg.offsetWidth; bigImg.classList.add('swap');
  bigImg.src = list[cur].file; bigImg.alt = list[cur].title;
  capEl.textContent = list[cur].title; catEl.textContent = secOf(list[cur].sec).title;
  cntEl.textContent = String(cur + 1).padStart(2, '0') + ' / ' + String(list.length).padStart(2, '0');
}
function openBox(i) { showBox(i); dlg.showModal(); }
document.getElementById('prev').addEventListener('click', (e) => { e.stopPropagation(); showBox(cur - 1); });
document.getElementById('next').addEventListener('click', (e) => { e.stopPropagation(); showBox(cur + 1); });
document.getElementById('close').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', (e) => { if (!e.target.closest('img,button,figcaption')) dlg.close(); });
window.addEventListener('keydown', (e) => {
  if (!dlg.open) return;
  if (e.key === 'ArrowRight') showBox(cur + 1);
  if (e.key === 'ArrowLeft') showBox(cur - 1);
});
let tx = 0;
bigImg.addEventListener('touchstart', (e) => { tx = e.changedTouches[0].clientX; }, { passive: true });
bigImg.addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) showBox(cur + (dx < 0 ? 1 : -1)); }, { passive: true });
document.querySelectorAll('.filters button').forEach((btn) => btn.addEventListener('click', () => {
  filter = btn.dataset.f;
  document.querySelectorAll('.filters button').forEach((x) => x.setAttribute('aria-pressed', x === btn));
  renderGallery();
}));
renderGallery();

/* ---------- one swipe = one chapter (dragon moves + text appears) ---------- */
const ANCH = [0, 0.33, 0.62, 0.93];
let chap = 0, anim = false, coolUntil = 0, txtT = 0, snapT = 0;
const maxS = () => Math.max(1, stage.offsetHeight - innerHeight);
const px = (i) => ANCH[i] * maxS();
const inStage = () => scrollY <= maxS() + 4;
function nearest() {
  const f = scrollY / maxS(); let k = 0;
  ANCH.forEach((a, i) => { if (Math.abs(a - f) < Math.abs(ANCH[k] - f)) k = i; });
  return k;
}
function goTo(i, dur) {
  i = Math.max(0, Math.min(ANCH.length - 1, i));
  const y0 = scrollY, y1 = px(i), near = Math.abs(y1 - y0) < maxS() * 0.02;
  const D = near ? 500 : (dur || 2600), t0 = performance.now();
  anim = true; chap = -1; clearTimeout(txtT);
  txtT = setTimeout(() => { chap = i; }, near ? 80 : D * 0.68);   // text arrives while the dragon is landing
  (function step(now) {
    const t = Math.min(1, (now - t0) / D), e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    window.scrollTo({ top: y0 + (y1 - y0) * e, behavior: 'instant' });
    if (t < 1) requestAnimationFrame(step);
    else { chap = i; anim = false; coolUntil = performance.now() + 450; }
  })(t0);
}
function handles(dir) {
  if (anim || performance.now() < coolUntil) return inStage();
  const i = chap < 0 ? nearest() : chap;
  return dir > 0 ? i < ANCH.length - 1 : inStage();
}
function stepDir(dir) {
  if (!handles(dir)) return false;
  if (anim || performance.now() < coolUntil) return true;
  const i = chap < 0 ? nearest() : chap;
  if (dir > 0) goTo(i + 1); else if (i > 0) goTo(i - 1);
  return true;
}
window.addEventListener('wheel', (e) => {
  if (dlg.open || e.ctrlKey || Math.abs(e.deltaY) < 3) return;
  if (handles(Math.sign(e.deltaY))) { e.preventDefault(); stepDir(Math.sign(e.deltaY)); }
}, { passive: false });
let ty0 = 0, tMode = 0, tFired = false;       // tMode: 0 undecided, 1 we handle, 2 native scroll
window.addEventListener('touchstart', (e) => { ty0 = e.touches[0].clientY; tMode = 0; tFired = false; }, { passive: true });
window.addEventListener('touchmove', (e) => {
  if (dlg.open || e.touches.length > 1) return;
  const dy = ty0 - e.touches[0].clientY;
  if (tMode === 0 && Math.abs(dy) > 1) tMode = handles(Math.sign(dy)) ? 1 : 2;
  if (tMode !== 1) return;
  if (e.cancelable) e.preventDefault();
  if (!tFired && Math.abs(dy) > 26) { tFired = true; stepDir(Math.sign(dy)); }
}, { passive: false });
window.addEventListener('keydown', (e) => {
  if (dlg.open || /INPUT|TEXTAREA|SELECT|BUTTON/.test(e.target.tagName)) return;
  const d = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 }[e.key];
  if (d && handles(d)) { e.preventDefault(); stepDir(d); }
});
window.addEventListener('scroll', () => {            // scrollbar drag etc.: settle on the nearest chapter
  if (anim) return;
  clearTimeout(snapT);
  snapT = setTimeout(() => {
    if (anim) return;
    if (scrollY > px(ANCH.length - 1) - 8) { chap = ANCH.length - 1; return; }
    const i = nearest();
    if (Math.abs(scrollY - px(i)) > 6) goTo(i, 1400); else chap = i;
  }, 220);
}, { passive: true });
chap = nearest();
(function () {
  document.querySelectorAll('.nav-link').forEach((link, i) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (i === 3) { document.getElementById('work').scrollIntoView({ behavior: 'smooth' }); return; }
      goTo(i);
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

/* ---------- touch-driven music: soft fade-in while you swipe or touch, settles, fades out when you let go ---------- */
const MUSIC_VOL = 0.5, MUSIC_START = 0.04;
let ctx = null, gain = null, buf = null, src = null, loading = false;
let playing = false, startedAt = 0, offset = 0, stopTimer = 0, holdTimer = 0, unlocked = false, held = false, lastTouchAt = 0;
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
    .then((b) => { buf = b; if (held) beginMusic(); }).catch((e) => console.warn('audio', e)).finally(() => { loading = false; });
}
function unlock() {
  ensureCtx();
  if (!ctx) return;
  ctx.resume().then(() => { unlocked = true; loadBuf(); if (held) beginMusic(); }).catch(() => {});
}
function beginMusic() {
  if (!ctx || !buf || !unlocked) return;
  clearTimeout(stopTimer); stopTimer = 0;
  const t = ctx.currentTime;
  if (!playing) {
    src = ctx.createBufferSource(); src.buffer = buf; src.loop = true; src.connect(gain);
    src.start(0, offset % buf.duration); startedAt = t; playing = true;
    gain.gain.cancelScheduledValues(t); gain.gain.setValueAtTime(MUSIC_START, t);
  } else { gain.gain.cancelScheduledValues(t); gain.gain.setValueAtTime(gain.gain.value, t); }
  gain.gain.setTargetAtTime(MUSIC_VOL, t, 0.7);        // quiet at first, then settles at a comfortable level
}
function endMusic() {
  if (!playing || stopTimer) return;
  const t = ctx.currentTime;
  gain.gain.cancelScheduledValues(t); gain.gain.setValueAtTime(gain.gain.value, t);
  gain.gain.setTargetAtTime(0, t, 0.55);               // calm fade-out
  stopTimer = setTimeout(() => {
    stopTimer = 0; if (held || !playing) return;
    offset = (offset + ctx.currentTime - startedAt) % buf.duration;
    try { src.stop(); } catch (e) {}
    playing = false;
  }, 2600);
}
function press() {
  held = true; clearTimeout(holdTimer);
  if (!unlocked) unlock(); else if (!ctx || ctx.state !== 'running') unlock();
  loadBuf(); beginMusic();
}
function lift() { held = false; clearTimeout(holdTimer); endMusic(); }
function pulse(ms) { press(); clearTimeout(holdTimer); holdTimer = setTimeout(lift, ms); }   // wheel / keys: no "release" event, so fade out shortly after the last one
window.addEventListener('touchstart', () => { lastTouchAt = Date.now(); press(); }, { passive: true });
['touchend', 'touchcancel'].forEach((ev) => window.addEventListener(ev, (e) => {
  lastTouchAt = Date.now();
  if (!unlocked) unlock();
  if (!e.touches || e.touches.length === 0) lift();
}, { passive: true }));
window.addEventListener('mousedown', () => { if (Date.now() - lastTouchAt > 700) press(); });
window.addEventListener('mouseup', () => { if (Date.now() - lastTouchAt > 700) { if (!unlocked) unlock(); lift(); } });
window.addEventListener('wheel', () => pulse(900), { passive: true });
window.addEventListener('keydown', () => pulse(900));
document.addEventListener('visibilitychange', () => { if (document.hidden) lift(); });

/* ---------- main UI loop ---------- */
const hint = document.getElementById('hint');
let lastY = scrollY, vel = 0;
splitTitlesIntoChars();
function loop() {
  requestAnimationFrame(loop);
  const maxScroll = stage.offsetHeight - innerHeight;
  MT.target = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
  MT.scroll += (MT.target - MT.scroll) * 0.04;
  MT.mx += (MT.tmx - MT.mx) * 0.05;
  MT.my += (MT.tmy - MT.my) * 0.05;
  vel += (Math.abs(scrollY - lastY) - vel) * 0.2; lastY = scrollY; MT.vel = vel;
  outerX += (cursorX - outerX) * 0.2; outerY += (cursorY - outerY) * 0.2;
  if (curOut && !isTouch) { curOut.style.left = outerX + 'px'; curOut.style.top = outerY + 'px'; }
  updateSlides(MT.scroll);
  updateGridDots(MT.scroll);
  const landed = MT.land === undefined ? 1 : MT.land;   // side phrases only appear once the dragon has landed
  callEls.forEach((c) => c.el.classList.toggle('active', MT.scroll >= c.a && MT.scroll <= c.b && landed > 0.55));
  if (hint) hint.classList.toggle('gone', scrollY > 40);
}
loop();
})();
