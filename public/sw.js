const CACHE_NAME = "kurye35-v4-performance";
const STATIC_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/art/izmir-shift-key-art.png",
  "/art/courier-motor.png",
  "/art/courier-car.png",
  "/fonts/space-grotesk-latin-wght-normal.woff2",
  "/fonts/space-grotesk-latin-ext-wght-normal.woff2",
  "/fonts/rajdhani-latin-700-normal.woff2",
  "/fonts/rajdhani-latin-ext-700-normal.woff2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(STATIC_ASSETS);

      // Next.js'in hash'li JS/CSS dosyalarını da kurulum anında keşfedip sakla.
      // Böylece ilk başarılı kurulumdan sonraki ilk offline açılışta oyun motoru da hazırdır.
      try {
        const shellResponse = await fetch(new Request("/", { cache: "reload" }));
        const html = await shellResponse.clone().text();
        const shellAssets = [...html.matchAll(/(?:src|href)=["'](\/_next\/static\/[^"']+)["']/g)]
          .map((match) => match[1]);
        await Promise.all([...new Set(shellAssets)].map((asset) => cache.add(asset)));
        await cache.put("/", shellResponse);
      } catch (_error) {
        // Statik görseller ve fontlar zaten cache'te; shell keşfi sonraki online istekte tamamlanır.
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Navigasyonlarda ağı öncelemek yeni deploy edilen HTML ve hash'li JS
  // dosyalarının cihaza ilk online açılışta ulaşmasını sağlar.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("/", responseToCache));
        }
        return networkResponse;
      }).catch(() => caches.match(event.request).then((cached) => cached || caches.match("/")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Arka planda güncelle
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
