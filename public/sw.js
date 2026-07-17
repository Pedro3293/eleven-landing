/* Service worker de FORGE (D-10): app shell + media en caché, navegación offline-first-red. */
const VERSION = 'forge-v1';
const SHELL_CACHE = `${VERSION}-shell`;
const MEDIA_CACHE = `${VERSION}-media`;
const PAGE_CACHE = `${VERSION}-pages`;

const SHELL = ['/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return; // los POST fallidos los reencola el cliente
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // Medios de ejercicios: cache-first (inmutables)
  if (url.pathname.startsWith('/api/media/')) {
    event.respondWith(
      caches.open(MEDIA_CACHE).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      }),
    );
    return;
  }

  // Fotos privadas y APIs de datos: siempre red (nada sensible en caché), con fallback a caché para la sesión
  if (url.pathname.startsWith('/api/photos/')) return;
  if (url.pathname.startsWith('/api/sessions/')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) caches.open(PAGE_CACHE).then((c) => c.put(req, res.clone())).catch(() => undefined);
          return res.clone();
        })
        .catch(() => caches.match(req).then((hit) => hit ?? Response.error())),
    );
    return;
  }
  if (url.pathname.startsWith('/api/')) return;

  // Páginas y estáticos: red primero con fallback a caché (sesión en curso usable offline)
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && (req.mode === 'navigate' || url.pathname.startsWith('/_next/static/'))) {
          const copy = res.clone();
          caches.open(PAGE_CACHE).then((c) => c.put(req, copy)).catch(() => undefined);
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit ?? caches.match('/dashboard'))),
  );
});
