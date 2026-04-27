/* ============================================================
   PLATINUM AUTOSERVICIOS — js/main.js
   Todo el JavaScript: UI, Animaciones, QR, Formularios,
   Sistema de Facturación completo
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────────────────────────
   CONFIGURACIÓN — Edita estos valores
   ───────────────────────────────────────────────────────────── */
const CONFIG = {
  pin:        '1922',                     // ← CAMBIA LA CLAVE DEL PANEL
  phone:      '18493417621',
  whatsapp:   'https://wa.me/18493417621',
  banco1:     { name: 'Banco Popular',  tipo: 'Cuenta Corriente', num: '828-283-796' },
  banco2:     { name: 'Banco BHD León', tipo: 'Cuenta de Ahorros', num: '41098220018' },
  titular:    'Starlyn Astacio',
  titularCed: '402-2646104-0',
};

/* ─────────────────────────────────────────────────────────────
   HELPER: formatear pesos dominicanos
   ───────────────────────────────────────────────────────────── */
function fmt(n) {
  return 'RD$ ' + Number(n).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(dt) {
  if (!dt) return '—';
  const [y, m, d] = dt.split('-');
  return `${d} / ${m} / ${y}`;
}

/* ─────────────────────────────────────────────────────────────
   1. MODO OSCURO / CLARO
   ───────────────────────────────────────────────────────────── */
const html = document.documentElement;
const savedTheme = localStorage.getItem('platinum-theme') ||
  (matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
html.setAttribute('data-theme', savedTheme);

document.getElementById('theme-toggle').addEventListener('click', () => {
  const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('platinum-theme', next);
});

/* ─────────────────────────────────────────────────────────────
   2. STICKY BANNER
   ───────────────────────────────────────────────────────────── */
const sBanner = document.getElementById('sticky-banner');

if (sessionStorage.getItem('banner-off')) {
  sBanner.classList.add('hidden');
} else {
  document.body.classList.add('has-banner');
}

document.getElementById('sticky-banner-close').addEventListener('click', () => {
  sBanner.classList.add('hidden');
  document.body.classList.remove('has-banner');
  sessionStorage.setItem('banner-off', '1');
});

/* ─────────────────────────────────────────────────────────────
   3. NAVBAR
   ───────────────────────────────────────────────────────────── */
const header     = document.getElementById('header');
const navToggle  = document.getElementById('nav-toggle');
const navMenu    = document.getElementById('nav-menu');
const navOverlay = document.getElementById('nav-overlay');

function closeNav() {
  navMenu.classList.remove('open');
  navToggle.classList.remove('active');
  navOverlay.classList.remove('active');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('active');
  navOverlay.classList.toggle('active');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});
navOverlay.addEventListener('click', closeNav);
navMenu.querySelectorAll('.nav__link').forEach(l => l.addEventListener('click', closeNav));

/* Scroll: header sombra + back-top + progreso + active link */
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', scrollY > 50);
  document.getElementById('back-top').hidden = scrollY < 400;

  const p = scrollY / (document.documentElement.scrollHeight - innerHeight) * 100;
  document.getElementById('scroll-progress').style.width = p + '%';

  document.querySelectorAll('section[id]').forEach(sec => {
    const link = navMenu.querySelector(`[href="#${sec.id}"]`);
    if (!link) return;
    const top = sec.offsetTop - 110;
    link.classList.toggle('active', scrollY >= top && scrollY < top + sec.offsetHeight);
  });
}, { passive: true });

document.getElementById('back-top').addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })
);

/* Smooth scroll en todos los anchor links */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - header.offsetHeight, behavior: 'smooth' });
  });
});

/* ─────────────────────────────────────────────────────────────
   4. MULTI-IDIOMA
   ───────────────────────────────────────────────────────────── */
const TRANSLATIONS = {
  es: {
    'hero-top':   'PLATINUM',
    'hero-sub':   'Servicio Automotriz & Mecánica General',
    'hero-desc':  'Más de 6 años brindando soluciones mecánicas de calidad en Barrio Ensanche Sinaí. Tu vehículo merece el mejor cuidado.',
    'btn-cita':   'Agendar Cita',
    'btn-call':   'Llamar',
    'about-tag':  'Sobre Nosotros',
    'about-title':'Tu taller de confianza en Ensanche Sinaí',
    'svc-tag':    'Lo Que Hacemos',
    'svc-title':  'Nuestros Servicios',
  },
  en: {
    'hero-top':   'PLATINUM',
    'hero-sub':   'Automotive Service & General Mechanics',
    'hero-desc':  'Over 6 years delivering quality mechanical solutions in Barrio Ensanche Sinaí. Your vehicle deserves the best care.',
    'btn-cita':   'Book Appointment',
    'btn-call':   'Call Us',
    'about-tag':  'About Us',
    'about-title':'Your trusted shop in Ensanche Sinaí',
    'svc-tag':    'What We Do',
    'svc-title':  'Our Services',
  }
};

let currentLang = localStorage.getItem('platinum-lang') || 'es';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('platinum-lang', lang);
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-t]').forEach(el => {
    const val = TRANSLATIONS[lang]?.[el.dataset.t];
    if (val) el.textContent = val;
  });
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
  });
}

document.querySelector('.lang-switcher').addEventListener('click', e => {
  const btn = e.target.closest('.lang-btn');
  if (!btn || btn.dataset.lang === currentLang) return;
  applyLang(btn.dataset.lang);
});
applyLang(currentLang);

/* ─────────────────────────────────────────────────────────────
   5. PARTÍCULAS HERO + SPEEDLINES
   ───────────────────────────────────────────────────────────── */
if (!matchMedia('(prefers-reduced-motion:reduce)').matches) {
  /* Partículas */
  const pc = document.getElementById('particles');
  for (let i = 0; i < (innerWidth < 640 ? 6 : 12); i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const s = Math.random() * 6 + 2;
    p.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;animation-duration:${Math.random()*15+10}s;animation-delay:${Math.random()*10}s`;
    pc.appendChild(p);
  }
  /* Speedlines */
  const sl = document.getElementById('speedlines');
  for (let i = 0; i < 10; i++) {
    const l = document.createElement('div');
    l.className = 'speedline';
    l.style.cssText = `top:${Math.random()*100}%;width:${Math.random()*30+20}%;animation-duration:${Math.random()*4+3}s;animation-delay:${Math.random()*5}s`;
    sl.appendChild(l);
  }
  /* Typing effect en hero subtitle */
  const sub  = document.getElementById('hero-sub');
  const orig = sub.textContent.trim();
  sub.textContent = '';
  sub.style.borderRight = '2px solid var(--pri)';
  setTimeout(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < orig.length) { sub.textContent += orig[i++]; }
      else { clearInterval(timer); setTimeout(() => sub.style.borderRight = 'none', 3000); }
    }, 55);
  }, 900);
}

/* ─────────────────────────────────────────────────────────────
   6. SCROLL REVEAL
   ───────────────────────────────────────────────────────────── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ─────────────────────────────────────────────────────────────
   7. CONTADORES ANIMADOS
   ───────────────────────────────────────────────────────────── */
function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.target, dur = 2000, start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(easeOutQuart(p) * target);
      if (p < 1) requestAnimationFrame(tick);
    })(start);
    cntObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => cntObs.observe(el));

/* ─────────────────────────────────────────────────────────────
   8. GALERÍA LIGHTBOX
   ───────────────────────────────────────────────────────────── */
const lb      = document.getElementById('lightbox');
const lbImg   = document.getElementById('lb-img');
const lbCap   = document.getElementById('lb-cap');
const galItems = [...document.querySelectorAll('.gallery__expand')].map(b => ({
  src: b.dataset.img, cap: b.dataset.cap
}));
let curGal = 0;

function openLB(i) {
  curGal = i;
  lbImg.src = galItems[i].src;
  lbImg.alt = galItems[i].cap;
  lbCap.textContent = galItems[i].cap;
  lb.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}
function closeLB() {
  lb.setAttribute('hidden', '');
  document.body.style.overflow = '';
}
function navLB(dir) {
  curGal = (curGal + dir + galItems.length) % galItems.length;
  lbImg.src = galItems[curGal].src;
  lbImg.alt = galItems[curGal].cap;
  lbCap.textContent = galItems[curGal].cap;
}

document.querySelectorAll('.gallery__expand').forEach((b, i) => b.addEventListener('click', () => openLB(i)));
document.querySelectorAll('.gallery__item').forEach((item, i) => {
  item.addEventListener('click', e => { if (!e.target.closest('.gallery__expand')) openLB(i); });
});
document.getElementById('lb-close').addEventListener('click', closeLB);
document.getElementById('lb-prev').addEventListener('click', () => navLB(-1));
document.getElementById('lb-next').addEventListener('click', () => navLB(1));
lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape')      closeLB();
  if (e.key === 'ArrowLeft')   navLB(-1);
  if (e.key === 'ArrowRight')  navLB(1);
});

/* ─────────────────────────────────────────────────────────────
   9. QR CODE
   ───────────────────────────────────────────────────────────── */
function genQR(url) {
  const c = document.getElementById('qr-container');
  c.innerHTML = '';
  if (typeof QRCode === 'undefined') return;
  new QRCode(c, { text: url, width: 140, height: 140, colorDark: '#1a6fd4', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.H });
}
window.addEventListener('load', () => genQR(CONFIG.whatsapp));
document.querySelectorAll('.qr-tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.qr-tab').forEach(x => { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
    t.classList.add('active'); t.setAttribute('aria-pressed', 'true');
    genQR(t.dataset.url);
  });
});

/* ─────────────────────────────────────────────────────────────
   10. POP-UP OFERTA CON COUNTDOWN
   ───────────────────────────────────────────────────────────── */
const popup = document.getElementById('promo-popup');
const lastClosed = localStorage.getItem('popup-closed');

if (!lastClosed || Date.now() - +lastClosed > 86400000) {
  let cdInterval;
  const popupTimer = setTimeout(() => {
    popup.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    startCountdown();
  }, 4500);

  function startCountdown() {
    function tick() {
      const now = new Date(), end = new Date();
      end.setHours(19, 0, 0, 0);
      if (end < now) end.setDate(end.getDate() + 1);
      const diff = end - now;
      const pad = n => String(n).padStart(2, '0');
      document.getElementById('cd-h').textContent = pad(Math.floor(diff / 3600000));
      document.getElementById('cd-m').textContent = pad(Math.floor(diff % 3600000 / 60000));
      document.getElementById('cd-s').textContent = pad(Math.floor(diff % 60000 / 1000));
    }
    tick();
    cdInterval = setInterval(tick, 1000);
  }

  function closePopup() {
    popup.setAttribute('hidden', '');
    document.body.style.overflow = '';
    localStorage.setItem('popup-closed', String(Date.now()));
    clearInterval(cdInterval);
    clearTimeout(popupTimer);
  }

  document.getElementById('popup-close').addEventListener('click', closePopup);
  document.getElementById('popup-dismiss').addEventListener('click', closePopup);
  document.getElementById('popup-backdrop').addEventListener('click', closePopup);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !popup.hidden) closePopup();
  });
}

/* ─────────────────────────────────────────────────────────────
   11. FORMULARIOS (Cita + Contacto)
   ───────────────────────────────────────────────────────────── */
/* Fecha mínima: hoy */
const apptDate = document.getElementById('ad');
if (apptDate) apptDate.min = new Date().toISOString().split('T')[0];

/* Botón WhatsApp cita: arma el mensaje con los datos del formulario */
document.getElementById('appt-wa-btn').addEventListener('click', () => {
  const fields = ['an', 'ap', 'ad', 'at', 'as', 'av', 'am'].map(id => document.getElementById(id)?.value || '');
  const msg = [
    '🔧 *Solicitud de Cita — Platinum Autoservicios*',
    `👤 Nombre:   ${fields[0]}`,
    `📞 Teléfono: ${fields[1]}`,
    fields[2] ? `📅 Fecha: ${fields[2]}` : '',
    fields[3] ? `🕐 Hora:  ${fields[3]}` : '',
    fields[4] ? `🔩 Servicio: ${fields[4]}` : '',
    fields[5] ? `🚗 Vehículo: ${fields[5]}` : '',
    fields[6] ? `📝 Notas: ${fields[6]}` : '',
  ].filter(Boolean).join('\n');
  window.open(`${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
});

/* Envío genérico con Formspree */
async function submitForm(formEl, submitBtn, successEl) {
  const txt  = submitBtn.querySelector('.btn__txt');
  const load = submitBtn.querySelector('.btn__load');
  txt.hidden = true; load.hidden = false; submitBtn.disabled = true;
  try {
    const res = await fetch(formEl.action, { method: 'POST', body: new FormData(formEl), headers: { 'Accept': 'application/json' } });
    if (res.ok) {
      formEl.reset();
      successEl.hidden = false;
      setTimeout(() => successEl.hidden = true, 6000);
    } else throw new Error();
  } catch {
    /* Fallback: abrir WhatsApp */
    window.open(`${CONFIG.whatsapp}?text=${encodeURIComponent('Hola, necesito información sobre sus servicios.')}`, '_blank');
  } finally {
    txt.hidden = false; load.hidden = true; submitBtn.disabled = false;
  }
}

document.getElementById('appt-form').addEventListener('submit', e => {
  e.preventDefault();
  submitForm(e.target, document.getElementById('appt-submit'), document.getElementById('appt-ok'));
});

document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;
  [['cn','cn-err'], ['cp','cp-err'], ['cm','cm-err']].forEach(([id, errId]) => {
    const el = document.getElementById(id), err = document.getElementById(errId);
    if (!el.value.trim()) { el.classList.add('error'); err.textContent = 'Campo requerido.'; valid = false; }
    else                  { el.classList.remove('error'); err.textContent = ''; }
  });
  if (valid) submitForm(e.target, document.getElementById('cf-submit'), document.getElementById('cf-ok'));
});

document.querySelectorAll('.form__input').forEach(inp => {
  inp.addEventListener('input', () => {
    inp.classList.remove('error');
    const err = document.getElementById(inp.id + '-err');
    if (err) err.textContent = '';
  });
});

/* ─────────────────────────────────────────────────────────────
   12. AÑO EN FOOTER
   ───────────────────────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ─────────────────────────────────────────────────────────────
   13. PWA
   ───────────────────────────────────────────────────────────── */
let deferredPrompt = null;
const pwaBanner = document.getElementById('pwa-banner');

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  if (!localStorage.getItem('pwa-dismissed')) {
    setTimeout(() => pwaBanner.classList.add('visible'), 12000);
  }
});
document.getElementById('pwa-install').addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') pwaBanner.classList.remove('visible');
  deferredPrompt = null;
});
document.getElementById('pwa-dismiss').addEventListener('click', () => {
  pwaBanner.classList.remove('visible');
  localStorage.setItem('pwa-dismissed', '1');
});
window.addEventListener('appinstalled', () => pwaBanner.classList.remove('visible'));
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});

/* ─────────────────────────────────────────────────────────────
   14. TILT EN SERVICE CARDS (micro-interacción)
   ───────────────────────────────────────────────────────────── */
if (matchMedia('(hover:hover)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
  document.querySelectorAll('.svc-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `translateY(-5px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });
}

/* ─────────────────────────────────────────────────────────────
   15. BADGE ABIERTO / CERRADO
   Horario: Lun–Sáb 8:00–19:00 (UTC-4, República Dominicana)
   ───────────────────────────────────────────────────────────── */
(function initStatusBadge() {
  const badge = document.getElementById('status-badge');
  const text  = document.getElementById('status-text');
  if (!badge || !text) return;

  function update() {
    const now  = new Date();
    const utc  = now.getTime() + now.getTimezoneOffset() * 60000;
    const dr   = new Date(utc - 4 * 3600000); // UTC-4
    const day  = dr.getDay();  // 0=Dom, 1=Lun … 6=Sáb
    const mins = dr.getHours() * 60 + dr.getMinutes();
    const open = day >= 1 && day <= 6 && mins >= 480 && mins < 1140; // 8:00–19:00
    badge.classList.toggle('closed', !open);
    text.textContent = open ? 'Abierto' : 'Cerrado';
  }

  update();
  setInterval(update, 60000); // re-chequea cada minuto
})();

/* ─────────────────────────────────────────────────────────────
   16. WA MINI-CHAT EXPANDIBLE
   ───────────────────────────────────────────────────────────── */
(function initWAChat() {
  const chat    = document.getElementById('wa-chat');
  const trigger = document.getElementById('wa-chat-trigger');
  const panel   = document.getElementById('wa-chat-panel');
  const closeBtn= document.getElementById('wa-chat-close');
  if (!chat) return;

  function openChat() {
    chat.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
  }
  function closeChat() {
    chat.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
  }

  trigger.addEventListener('click', () =>
    chat.classList.contains('open') ? closeChat() : openChat()
  );
  closeBtn.addEventListener('click', closeChat);

  document.querySelectorAll('.wa-chat__opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = encodeURIComponent(btn.dataset.msg);
      window.open(`https://wa.me/18493417621?text=${msg}`, '_blank', 'noopener,noreferrer');
    });
  });

  // Abre el panel automáticamente después de 10s si el usuario no lo cerró antes
  if (!sessionStorage.getItem('wa-chat-seen')) {
    setTimeout(() => {
      if (!chat.classList.contains('open')) {
        openChat();
        sessionStorage.setItem('wa-chat-seen', '1');
      }
    }, 10000);
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && chat.classList.contains('open')) closeChat();
  });
})();

/* ═══════════════════════════════════════════════════════════════
   MÓDULO DE FACTURACIÓN COMPLETO
   ═══════════════════════════════════════════════════════════════ */
const STORE_KEY = 'platinum_invoices_v1';

function loadInvoices()    { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { return []; } }
function saveInvoices(data){ localStorage.setItem(STORE_KEY, JSON.stringify(data)); }

function nextNum() {
  const invs = loadInvoices();
  if (!invs.length) return '0001';
  return String(Math.max(...invs.map(i => parseInt(i.num) || 0)) + 1).padStart(4, '0');
}

/* ── Abrir / cerrar modal principal ── */
const billingModal = document.getElementById('billing-modal');
const billingLogin = document.getElementById('billing-login');
const billingPanel = document.getElementById('billing-panel');

document.getElementById('open-billing').addEventListener('click', () => {
  billingModal.removeAttribute('hidden');
  billingLogin.hidden = false;
  billingPanel.hidden = true;
  document.getElementById('pin-input').value = '';
  document.getElementById('pin-error').textContent = '';
  setTimeout(() => document.getElementById('pin-input').focus(), 100);
});

document.getElementById('billing-close').addEventListener('click', () => billingModal.setAttribute('hidden', ''));
billingModal.addEventListener('click', e => { if (e.target === billingModal) billingModal.setAttribute('hidden', ''); });

/* ── PIN ── */
function unlockPanel() {
  if (document.getElementById('pin-input').value === CONFIG.pin) {
    billingLogin.hidden = true;
    billingPanel.hidden = false;
    initForm();
    renderList();
    renderStats();
  } else {
    document.getElementById('pin-error').textContent = 'Clave incorrecta. Intenta de nuevo.';
    document.getElementById('pin-input').value = '';
    document.getElementById('pin-input').focus();
  }
}
document.getElementById('pin-submit').addEventListener('click', unlockPanel);
document.getElementById('pin-input').addEventListener('keydown', e => { if (e.key === 'Enter') unlockPanel(); });

/* ── Tabs ── */
document.querySelectorAll('.billing-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.billing-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
    document.querySelectorAll('.billing-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected','true');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    if (tab.dataset.tab === 'lista')  renderList();
    if (tab.dataset.tab === 'stats')  renderStats();
  });
});

/* ── Ítems del servicio ── */
let itemCount = 0;

function addItem(desc = '', cant = 1, price = 0) {
  itemCount++;
  const tbody = document.getElementById('inv-items-body');
  const tr = document.createElement('tr');
  tr.dataset.itemId = itemCount;
  tr.innerHTML = `
    <td class="td-num">${String(itemCount).padStart(2,'0')}</td>
    <td class="td-desc">
      <textarea class="item-input" rows="2" placeholder="Descripción del servicio…">${desc}</textarea>
    </td>
    <td class="td-cant">
      <input class="item-input" type="number" min="1" value="${cant}" style="width:65px;text-align:center"/>
    </td>
    <td class="td-price">
      <input class="item-input" type="number" min="0" step="0.01" value="${price}" style="width:105px;text-align:right" placeholder="0.00"/>
    </td>
    <td class="td-total-val">${fmt(cant * price)}</td>
    <td class="td-del">
      <button class="item-del" title="Eliminar ítem" aria-label="Eliminar ítem">
        <i class="fas fa-times" aria-hidden="true"></i>
      </button>
    </td>
  `;
  /* Recalcular al editar */
  tr.querySelectorAll('.item-input').forEach(inp => {
    inp.addEventListener('input', () => {
      const inputs = tr.querySelectorAll('.item-input');
      const c = parseFloat(inputs[1].value) || 0;
      const p = parseFloat(inputs[2].value) || 0;
      tr.querySelector('.td-total-val').textContent = fmt(c * p);
      calcTotals();
    });
  });
  /* Eliminar fila */
  tr.querySelector('.item-del').addEventListener('click', () => {
    tr.remove();
    calcTotals();
    renumberItems();
  });
  tbody.appendChild(tr);
  calcTotals();
}

function renumberItems() {
  document.querySelectorAll('#inv-items-body tr').forEach((r, i) => {
    r.querySelector('.td-num').textContent = String(i + 1).padStart(2, '0');
  });
  itemCount = document.querySelectorAll('#inv-items-body tr').length;
}

function calcTotals() {
  let sub = 0;
  document.querySelectorAll('#inv-items-body tr').forEach(r => {
    const inps = r.querySelectorAll('.item-input');
    sub += (parseFloat(inps[1]?.value) || 0) * (parseFloat(inps[2]?.value) || 0);
  });
  const itbis = parseInt(document.getElementById('inv-itbis').value) || 0;
  const tax = sub * itbis / 100;
  document.getElementById('tot-sub').textContent   = fmt(sub);
  document.getElementById('tot-tax').textContent   = fmt(tax);
  document.getElementById('tot-final').textContent = fmt(sub + tax);
}

document.getElementById('add-item').addEventListener('click', () => addItem());
document.getElementById('inv-itbis').addEventListener('change', calcTotals);

function initForm() {
  document.getElementById('inv-num').value   = nextNum();
  document.getElementById('inv-date').value  = new Date().toISOString().split('T')[0];
  document.getElementById('inv-items-body').innerHTML = '';
  itemCount = 0;
  addItem('', 1, 0);
  calcTotals();
}

document.getElementById('clear-inv').addEventListener('click', () => {
  if (confirm('¿Limpiar el formulario? Se perderán los datos no guardados.')) initForm();
});

/* ── Leer datos del formulario ── */
function readFormData() {
  const rows = [];
  document.querySelectorAll('#inv-items-body tr').forEach((r, i) => {
    const inps = r.querySelectorAll('.item-input');
    const desc  = inps[0]?.value || '';
    const cant  = parseFloat(inps[1]?.value) || 0;
    const price = parseFloat(inps[2]?.value) || 0;
    if (desc.trim()) rows.push({ num: String(i+1).padStart(2,'0'), desc, cant, price, total: cant * price });
  });
  const itbis = parseInt(document.getElementById('inv-itbis').value) || 0;
  const sub   = rows.reduce((a, r) => a + r.total, 0);
  const tax   = sub * itbis / 100;
  return {
    num:      document.getElementById('inv-num').value,
    date:     document.getElementById('inv-date').value,
    status:   document.getElementById('inv-status').value,
    client:   document.getElementById('inv-client').value,
    phone:    document.getElementById('inv-phone').value,
    vehicle:  document.getElementById('inv-vehicle').value,
    year:     document.getElementById('inv-year').value,
    mecName:  document.getElementById('inv-mec-name').value,
    mecCed:   document.getElementById('inv-mec-ced').value,
    notes:    document.getElementById('inv-notes').value,
    itbis, rows, sub, tax,
    total:    sub + tax,
    created:  Date.now(),
  };
}

/* ── Renderizar HTML de la factura ── */
function buildInvoiceHTML(d) {
  const itemsHTML = d.rows.map(r => `
    <tr>
      <td>${r.num}</td>
      <td>${r.desc.replace(/\n/g,'<br>')}</td>
      <td style="text-align:center">${r.cant}</td>
      <td style="text-align:right">${fmt(r.price)}</td>
      <td style="text-align:right"><strong>${fmt(r.total)}</strong></td>
    </tr>`).join('');

  return `
<div id="invoice-print">
  <!-- ENCABEZADO -->
  <div class="inv-doc-header">
    <div class="inv-doc-logo">
      <img src="assets/img/logo.png" alt="Logo Platinum Autoservicios"
           onerror="this.style.display='none'"/>
    </div>
    <div class="inv-doc-title-block">
      <div class="inv-doc-biz-name">PLATINUM</div>
      <div class="inv-doc-biz-sub">A U T O S E R V I C I O S</div>
      <div class="inv-doc-biz-slogan">Servicio Automotriz y Mecánica General</div>
      <div class="inv-doc-biz-info">
        Entrada de Cabañas Las Palmas, Barrio Ensanche Sinaí<br>
        Lun–Sáb 8:00 AM – 7:00 PM &nbsp;•&nbsp; @platinum.autoservicios<br>
        ventas@platinumautoservicios.com &nbsp;•&nbsp; (849) 341-7621
      </div>
    </div>
    <div class="inv-doc-badge">
      <span class="inv-doc-badge-label">FACTURA</span>
      <div class="inv-doc-badge-num">#${d.num}</div>
      <div class="inv-doc-badge-date">${fmtDate(d.date)}</div>
    </div>
  </div>

  <!-- META CLIENTE -->
  <div class="inv-doc-meta">
    <div class="inv-doc-meta-item">
      <label>FECHA</label>
      <strong>${fmtDate(d.date)}</strong>
    </div>
    <div class="inv-doc-meta-item">
      <label>CLIENTE</label>
      <strong>${d.client || '—'}</strong>
    </div>
    <div class="inv-doc-meta-item">
      <label>VEHÍCULO</label>
      <strong>${[d.vehicle, d.year].filter(Boolean).join(' ') || '—'}</strong>
    </div>
  </div>

  <!-- CUERPO -->
  <div class="inv-doc-body">
    <!-- Detalle -->
    <div class="inv-doc-section-title">
      <i class="fas fa-tools"></i> DETALLE DEL SERVICIO
    </div>
    <table class="inv-doc-table">
      <thead>
        <tr>
          <th>N°</th>
          <th>Descripción del Servicio</th>
          <th style="text-align:center">Cant.</th>
          <th style="text-align:right">P. Unit.</th>
          <th style="text-align:right">Total</th>
        </tr>
      </thead>
      <tbody>${itemsHTML}</tbody>
    </table>

    <!-- Totales -->
    <div class="inv-doc-totals-wrap">
      <div class="inv-doc-totals-box">
        <div class="inv-tot-row"><span>Subtotal:</span><strong>${fmt(d.sub)}</strong></div>
        <div class="inv-tot-row"><span>ITBIS (${d.itbis}%):</span><strong>${fmt(d.tax)}</strong></div>
        <div class="inv-tot-row"><span>TOTAL A PAGAR:</span><span>${fmt(d.total)}</span></div>
      </div>
    </div>

    ${d.notes ? `<div style="margin-top:1rem;background:#f7faff;border:1px solid #dde8f5;border-radius:8px;padding:.75rem 1rem;font-size:.85rem;color:#2a3a5a"><strong>Notas:</strong> ${d.notes}</div>` : ''}

    <!-- Métodos de pago -->
    <div style="margin-top:1.5rem">
      <div class="inv-doc-section-title">
        <i class="fas fa-credit-card"></i> MÉTODOS DE PAGO &nbsp;
        <span style="background:rgba(255,255,255,.2);padding:.15rem .6rem;border-radius:4px;font-size:.7rem">EFECTIVO</span>
        <span style="background:#f0b429;color:#7c5800;padding:.15rem .6rem;border-radius:4px;font-size:.7rem;margin-left:.4rem">TRANSFERENCIA</span>
      </div>
      <div class="inv-doc-banks">
        <div class="inv-doc-bank inv-doc-bank--pop">
          <div class="inv-doc-bank-name">${CONFIG.banco1.name}</div>
          <div class="inv-doc-bank-type">${CONFIG.banco1.tipo}</div>
          <div class="inv-doc-bank-num">${CONFIG.banco1.num}</div>
          <div><span class="inv-doc-bank-tag">PAGO EXPRESO ■</span></div>
        </div>
        <div class="inv-doc-bank inv-doc-bank--bhd">
          <div class="inv-doc-bank-name">${CONFIG.banco2.name}</div>
          <div class="inv-doc-bank-type">${CONFIG.banco2.tipo}</div>
          <div class="inv-doc-bank-num">${CONFIG.banco2.num}</div>
          <div><span class="inv-doc-bank-tag">PAGO EXPRESO ■</span></div>
        </div>
      </div>
      <div class="inv-doc-titular">
        Titular: <strong>${CONFIG.titular}</strong> &nbsp;•&nbsp; Cédula: <strong>${CONFIG.titularCed}</strong>
      </div>
      <div class="inv-doc-voucher">■ Enviar váucher para confirmar recibo y cancelar pendiente</div>
    </div>

    <!-- Firmas -->
    <div class="inv-doc-sigs">
      <div class="inv-doc-sig">
        <div class="inv-doc-sig-line"></div>
        <div class="inv-doc-sig-name">${d.client || 'Cliente'}</div>
        <div class="inv-doc-sig-role">Cliente</div>
      </div>
      <div class="inv-doc-sig">
        <div class="inv-doc-sig-line"></div>
        <div class="inv-doc-sig-name">${d.mecName}</div>
        <div class="inv-doc-sig-role">Mecánico Responsable</div>
        <div class="inv-doc-sig-id">Ced. ${d.mecCed} &nbsp;•&nbsp; (849) 341-7621</div>
      </div>
    </div>
  </div>

  <!-- PIE DE PÁGINA -->
  <div class="inv-doc-footer">
    <div class="inv-doc-footer-logo">
      <img src="assets/img/logo.png" alt="Logo" style="height:36px;filter:brightness(2)"
           onerror="this.style.display='none'"/>
      <div>
        <div class="inv-doc-footer-biz">PLATINUM AUTOSERVICIOS • (849) 341-7621</div>
        <div style="font-size:.72rem;opacity:.65">ventas@platinumautoservicios.com • @platinum.autoservicios</div>
      </div>
    </div>
    <div class="inv-doc-footer-info">
      Lun–Sáb 8:00 AM – 7:00 PM<br>
      <span style="font-size:.72rem;opacity:.65">Documento generado digitalmente — Platinum Auto Services</span>
    </div>
    <div class="inv-doc-footer-thanks">¡Gracias por preferirnos!</div>
  </div>
</div>`;
}

/* ── Modal vista previa ── */
const previewModal = document.getElementById('inv-preview-modal');
let currentInv = null;

function showPreview(data) {
  currentInv = data;
  const existing = document.getElementById('invoice-print');
  if (existing) existing.remove();
  const tmp = document.createElement('div');
  tmp.innerHTML = buildInvoiceHTML(data);
  document.querySelector('.inv-preview-wrap').appendChild(tmp.firstElementChild);
  previewModal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

document.getElementById('preview-inv').addEventListener('click', () => {
  showPreview(readFormData());
});

/* ── Guardar ── */
function saveInvoice() {
  if (!currentInv) return;
  const invs = loadInvoices();
  const idx  = invs.findIndex(i => i.num === currentInv.num);
  if (idx >= 0) invs[idx] = currentInv; else invs.push(currentInv);
  saveInvoices(invs);
  previewModal.setAttribute('hidden', '');
  document.body.style.overflow = '';
  initForm();
  renderList();
  renderStats();
  alert(`✅ Factura #${currentInv.num} guardada correctamente.`);
}

/* ── Imprimir ── */
function printInvoice() {
  const content = document.getElementById('invoice-print')?.outerHTML;
  if (!content) return;
  const w = window.open('', '_blank', 'width=900,height=700');
  w.document.write(`<!DOCTYPE html><html><head>
    <meta charset="UTF-8"><title>Factura Platinum #${currentInv?.num}</title>
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="css/styles.css">
    <style>
      body{margin:0;background:#fff}
      @media print{body{margin:0}@page{margin:8mm;size:A4}}
    </style>
    </head><body>
    ${content}
    <script>window.onload=()=>window.print()<\/script>
    </body></html>`);
  w.document.close();
}

/* ── Enviar por WhatsApp ── */
function sendViaWhatsApp() {
  if (!currentInv) return;
  const d = currentInv;
  const lines = [
    `🔧 *Factura #${d.num} — Platinum Autoservicios*`,
    `📅 Fecha:    ${fmtDate(d.date)}`,
    `👤 Cliente:  ${d.client || '—'}`,
    `🚗 Vehículo: ${[d.vehicle, d.year].filter(Boolean).join(' ') || '—'}`,
    '',
    ...d.rows.map(r => `• ${r.desc.replace(/\n/g, ' ')} — ${r.cant}x ${fmt(r.price)} = ${fmt(r.total)}`),
    '',
    `Subtotal: ${fmt(d.sub)}`,
    `ITBIS (${d.itbis}%): ${fmt(d.tax)}`,
    `*TOTAL: ${fmt(d.total)}*`,
    '',
    `${CONFIG.banco1.name} — Cta: ${CONFIG.banco1.num}`,
    `${CONFIG.banco2.name} — Cta: ${CONFIG.banco2.num}`,
    `Titular: ${CONFIG.titular} • Ced: ${CONFIG.titularCed}`,
    '',
    '¡Gracias por preferirnos! 🙏',
  ].join('\n');

  const rawPhone = d.phone ? d.phone.replace(/\D/g, '') : CONFIG.phone;
  const phone    = rawPhone.startsWith('1') ? rawPhone : '1' + rawPhone;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(lines)}`, '_blank');
}

/* ── Bindings botones preview ── */
document.getElementById('save-inv')?.addEventListener('click', saveInvoice);
document.getElementById('print-inv')?.addEventListener('click', printInvoice);
document.getElementById('wa-inv')?.addEventListener('click', sendViaWhatsApp);
document.getElementById('close-preview')?.addEventListener('click', () => {
  previewModal.setAttribute('hidden', '');
  document.body.style.overflow = '';
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !previewModal.hidden) {
    previewModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }
});
previewModal.addEventListener('click', e => {
  if (e.target === previewModal) {
    previewModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }
});

/* ── Renderizar lista de facturas ── */
const STATUS_LABEL = { paid: 'Pagado', pending: 'Pendiente', cancelled: 'Cancelado' };
const STATUS_CLASS = { paid: 'paid',   pending: 'pending',   cancelled: 'cancelled' };

function renderList(textFilter = '', statusFilter = '') {
  const invs   = loadInvoices();
  const tbody  = document.getElementById('inv-list-body');
  const empty  = document.getElementById('inv-empty');
  const q      = textFilter.toLowerCase();

  const filtered = invs
    .filter(i => {
      const matchText   = !q || [i.num, i.client, i.vehicle].join(' ').toLowerCase().includes(q);
      const matchStatus = !statusFilter || i.status === statusFilter;
      return matchText && matchStatus;
    })
    .sort((a, b) => b.created - a.created);

  if (!filtered.length) { tbody.innerHTML = ''; empty.hidden = false; return; }
  empty.hidden = true;

  tbody.innerHTML = filtered.map(inv => `
    <tr>
      <td class="td-inv-num">#${inv.num}</td>
      <td>${inv.date || '—'}</td>
      <td>${inv.client || '—'}</td>
      <td>${[inv.vehicle, inv.year].filter(Boolean).join(' ') || '—'}</td>
      <td class="td-inv-total">${fmt(inv.total)}</td>
      <td><span class="status-badge status-badge--${STATUS_CLASS[inv.status] || 'pending'}">${STATUS_LABEL[inv.status] || 'Pendiente'}</span></td>
      <td>
        <div class="inv-actions-cell">
          <button class="inv-action-btn"     title="Ver"      data-view="${inv.num}"><i class="fas fa-eye"></i></button>
          <button class="inv-action-btn"     title="Imprimir" data-print="${inv.num}"><i class="fas fa-print"></i></button>
          <button class="inv-action-btn"     title="WhatsApp" data-wa="${inv.num}"><i class="fab fa-whatsapp"></i></button>
          <button class="inv-action-btn del" title="Eliminar" data-del="${inv.num}"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');

  /* Bindings por fila */
  tbody.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => {
    const inv = loadInvoices().find(i => i.num === b.dataset.view);
    if (inv) showPreview(inv);
  }));
  tbody.querySelectorAll('[data-print]').forEach(b => b.addEventListener('click', () => {
    currentInv = loadInvoices().find(i => i.num === b.dataset.print);
    if (currentInv) {
      const existing = document.getElementById('invoice-print');
      if (existing) existing.remove();
      const tmp = document.createElement('div');
      tmp.innerHTML = buildInvoiceHTML(currentInv);
      document.querySelector('.inv-preview-wrap').appendChild(tmp.firstElementChild);
      printInvoice();
    }
  }));
  tbody.querySelectorAll('[data-wa]').forEach(b => b.addEventListener('click', () => {
    currentInv = loadInvoices().find(i => i.num === b.dataset.wa);
    if (currentInv) sendViaWhatsApp();
  }));
  tbody.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
    if (!confirm(`¿Eliminar factura #${b.dataset.del} permanentemente?`)) return;
    saveInvoices(loadInvoices().filter(i => i.num !== b.dataset.del));
    renderList(
      document.getElementById('inv-search').value,
      document.getElementById('inv-filter').value
    );
    renderStats();
  }));
}

document.getElementById('inv-search').addEventListener('input', e =>
  renderList(e.target.value, document.getElementById('inv-filter').value)
);
document.getElementById('inv-filter').addEventListener('change', e =>
  renderList(document.getElementById('inv-search').value, e.target.value)
);

/* ── Estadísticas ── */
function renderStats() {
  const invs     = loadInvoices();
  const paid     = invs.filter(i => i.status === 'paid');
  const pending  = invs.filter(i => i.status === 'pending');
  const revenue  = paid.reduce((a, i) => a + i.total, 0);

  document.getElementById('st-total').textContent   = invs.length;
  document.getElementById('st-paid').textContent    = paid.length;
  document.getElementById('st-pending').textContent = pending.length;
  document.getElementById('st-revenue').textContent = fmt(revenue);

  /* Exportar facturas a JSON */
  document.getElementById('inv-export-json').onclick = () => {
    const data = JSON.stringify(invs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), {
      href: url,
      download: `platinum-facturas-${new Date().toISOString().slice(0,10)}.json`
    });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const recent = [...invs].sort((a, b) => b.created - a.created).slice(0, 5);
  document.getElementById('recent-invs').innerHTML = recent.length
    ? recent.map(i => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:.6rem 0;border-bottom:1px solid var(--border)">
          <div>
            <strong style="color:var(--pri);font-family:var(--fd)">#${i.num}</strong>
            — ${i.client || 'Sin nombre'}
            <span style="font-size:.8rem;color:var(--muted);margin-left:.5rem">${i.date || ''}</span>
          </div>
          <div style="display:flex;align-items:center;gap:1rem">
            <span style="font-family:var(--fd);font-weight:700;color:var(--pri)">${fmt(i.total)}</span>
            <span class="status-badge status-badge--${STATUS_CLASS[i.status] || 'pending'}">${STATUS_LABEL[i.status] || 'Pendiente'}</span>
          </div>
        </div>`).join('')
    : '<p style="color:var(--muted);font-size:.9rem">Sin facturas aún.</p>';
}
