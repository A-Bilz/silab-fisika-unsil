/**
 * Service Worker SILAB Fisika UNSIL (Cache-first offline app shell)
 */

const CACHE_NAME = "silab-unsil-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/config.js",
  "./js/app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  // Hanya layani permintaan GET
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Abaikan permintaan lintas-origin atau protokol non-http (ekstensi peramban)
  if (url.origin !== self.location.origin) return;

  // Jangan cache API dinamis atau parameter bypass
  if (url.pathname.startsWith("/api/") || url.search.includes("nocache")) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const cc = networkResponse.headers.get("Cache-Control");
            if (!cc || !cc.includes("no-store")) {
              const clone = networkResponse.clone();
              caches
                .open(CACHE_NAME)
                .then((cache) => cache.put(event.request, clone));
            }
          }
          return networkResponse;
        })
        .catch(() => {
          // Cadangan offline untuk navigasi SPA
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });

      return cachedResponse || fetchPromise;
    }),
  );
});
