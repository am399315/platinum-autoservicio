/* ============================================================
   PLATINUM AUTOSERVICIOS — sw.js
   Service Worker para PWA / Offline
   ============================================================ */

const CACHE = 'platinum-v1';
const FILES = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/assets/img/logo.png',
  '/assets/img/letrero.png',
  '/assets/img/vehiculos.png',
  '/assets/img/toldo.png',
  '/assets/img/gomas.png',
  '/assets/img/entrada.png',
  '/assets/img/mas_vehiculos.png',
  '/assets/img/ubicanos.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => {
        if (e.request.destination === 'document') return caches.match('/index.html');
      });
    })
  );
});
