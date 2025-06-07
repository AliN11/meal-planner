const CACHE_NAME = "meal-manager-v3";
const RUNTIME_CACHE = "meal-manager-runtime-v3";

// Install service worker
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate service worker
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log("[ServiceWorker] Removing old cache", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch event - Cache First strategy with network fallback
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip chrome extension and other non-http requests
  if (!event.request.url.startsWith("http")) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log("[ServiceWorker] Serving from cache:", event.request.url);
          return cachedResponse;
        }

        console.log(
          "[ServiceWorker] Fetching from network:",
          event.request.url
        );
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (
              !response ||
              response.status !== 200 ||
              response.type !== "basic"
            ) {
              return response;
            }

            // Clone the response before caching
            const responseToCache = response.clone();
            cache.put(event.request, responseToCache);
            console.log("[ServiceWorker] Cached:", event.request.url);

            return response;
          })
          .catch((error) => {
            console.log("[ServiceWorker] Fetch failed:", error);

            // For navigation requests, return the cached root page
            if (event.request.mode === "navigate") {
              return cache.match("/").then((cachedResponse) => {
                if (cachedResponse) {
                  return cachedResponse;
                }
                // Fallback HTML for offline
                return new Response(
                  `<!DOCTYPE html>
                   <html lang="fa" dir="rtl">
                   <head>
                     <meta charset="utf-8">
                     <meta name="viewport" content="width=device-width, initial-scale=1">
                     <title>مدیریت غذاها - آفلاین</title>
                     <style>
                       body { font-family: Arial, sans-serif; text-align: center; padding: 50px; direction: rtl; }
                       .offline { color: #666; }
                     </style>
                   </head>
                   <body>
                     <h1>مدیریت غذاها</h1>
                     <p class="offline">برنامه در حالت آفلاین است. لطفاً اتصال اینترنت خود را بررسی کنید.</p>
                     <button onclick="window.location.reload()">تلاش مجدد</button>
                   </body>
                   </html>`,
                  {
                    headers: { "Content-Type": "text/html" },
                  }
                );
              });
            }

            throw error;
          });
      });
    })
  );
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
