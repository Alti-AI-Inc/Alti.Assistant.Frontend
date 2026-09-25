self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installed.');
  event.waitUntil(
    caches.open('aphura-offline-v1').then((cache) => {
      return cache.addAll(['/', '/dashboard']);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
