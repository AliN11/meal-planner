const CACHE_NAME = "meal-manager-v2";
const STATIC_CACHE = "meal-manager-static-v2";
const DATA_CACHE = "meal-manager-data-v2";

const FILES_TO_CACHE = [
  "/",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/manifest.json",
  "/favicon.ico",
  "/logo192.png",
  "/logo512.png",
];

// Install service worker
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[ServiceWorker] Pre-caching offline page");
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate service worker
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DATA_CACHE) {
            console.log("[ServiceWorker] Removing old cache", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  event.waitUntil(self.clients.claim());
});

// Fetch event - network first for API calls, cache first for static assets
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/")) {
    // Network first strategy for API calls
    event.respondWith(
      caches.open(DATA_CACHE).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }
            return response;
          })
          .catch(() => {
            return cache.match(event.request);
          });
      })
    );
  } else {
    // Cache first strategy for static assets
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // Return fallback page for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
        });
      })
    );
  }
});

// Background sync for offline actions (optional)
self.addEventListener("sync", (event) => {
  console.log("[ServiceWorker] Background sync", event.tag);
  // Can be extended for background data sync
});

// Push notifications (optional for future enhancement)
self.addEventListener("push", (event) => {
  console.log("[ServiceWorker] Push notification received");
  // Can be extended for push notifications
});
