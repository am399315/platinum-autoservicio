/* ============================================================
   PLATINUM AUTOSERVICIOS — sw.js
   Service Worker para PWA / Offline
   Estrategia: Network First para HTML/CSS/JS, Cache First para imágenes
   ============================================================ */

const CACHE = 'platinum-v3';
const IMAGES = [
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
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(IMAGES)));
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

  /* Imágenes: Cache First (no cambian seguido) */
  if (e.request.destination === 'image') {
    e.respondWith(
      caches.match(e.request).then(cached =>
        cached || fetch(e.request).then(res => {
          if (res && res.status === 200) {
            caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          }
          return res;
        })
      )
    );
    return;
  }

  /* HTML / CSS / JS / todo lo demás: Network First (siempre fresco) */
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        }
        return res;
      })
      .catch(() =>
        caches.match(e.request).then(cached =>
          cached || (e.request.destination === 'document'
            ? caches.match('/index.html')
            : undefined)
        )
      )
  );
});
