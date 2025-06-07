/* eslint-disable */

const CACHE_NAME = "meal-manager-v5";
const RUNTIME_CACHE = "meal-manager-runtime-v5";

// Install service worker and cache all generated resources
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[ServiceWorker] Caching app shell and assets");

        // First, cache the basic resources
        const basicResources = [
          "/",
          "/manifest.json",
          "/favicon.ico",
          "/logo192.png",
          "/logo512.png",
        ];

        return Promise.allSettled(
          basicResources.map((url) =>
            cache.add(url).catch((err) => {
              console.warn(`[ServiceWorker] Failed to cache ${url}:`, err);
              return null;
            })
          )
        ).then(() => {
          // Then fetch and cache the asset manifest and generated files
          return fetch("/asset-manifest.json")
            .then((response) => response.json())
            .then((manifest) => {
              const assetsToCache = [];

              // Add main CSS and JS files
              if (manifest.files["main.css"]) {
                assetsToCache.push(manifest.files["main.css"]);
              }
              if (manifest.files["main.js"]) {
                assetsToCache.push(manifest.files["main.js"]);
              }

              // Add chunk files
              Object.keys(manifest.files).forEach((key) => {
                if (key.endsWith(".js") && key.includes("chunk")) {
                  assetsToCache.push(manifest.files[key]);
                }
              });

              console.log(
                "[ServiceWorker] Caching generated assets:",
                assetsToCache
              );

              return Promise.allSettled(
                assetsToCache.map((url) =>
                  cache.add(url).catch((err) => {
                    console.warn(
                      `[ServiceWorker] Failed to cache asset ${url}:`,
                      err
                    );
                    return null;
                  })
                )
              );
            })
            .catch((err) => {
              console.warn(
                "[ServiceWorker] Failed to fetch asset manifest:",
                err
              );
              return null;
            });
        });
      })
      .then(() => {
        // Skip waiting to activate immediately
        self.skipWaiting();
      })
  );
});

// Activate service worker and clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log("[ServiceWorker] Removing old cache", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all clients immediately
        self.clients.claim();
      })
  );
});

// Enhanced fetch event - Cache First strategy with comprehensive offline support
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip chrome extension and other non-http requests
  if (!event.request.url.startsWith("http")) {
    return;
  }

  // Skip external requests (like Google Fonts)
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== location.origin) {
    console.log(
      "[ServiceWorker] Skipping external request:",
      event.request.url
    );
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
                // Enhanced fallback HTML for offline with better styling
                return new Response(
                  `<!DOCTYPE html>
                   <html lang="fa" dir="rtl">
                   <head>
                     <meta charset="utf-8">
                     <meta name="viewport" content="width=device-width, initial-scale=1">
                     <title>مدیریت غذاها - آفلاین</title>
                     <style>
                       * { margin: 0; padding: 0; box-sizing: border-box; }
                       body { 
                         font-family: system-ui, -apple-system, sans-serif; 
                         background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                         color: white;
                         display: flex;
                         flex-direction: column;
                         align-items: center;
                         justify-content: center;
                         min-height: 100vh;
                         padding: 20px;
                         direction: rtl;
                       }
                       .container { 
                         text-align: center; 
                         max-width: 400px;
                         background: rgba(255,255,255,0.1);
                         padding: 40px;
                         border-radius: 20px;
                         backdrop-filter: blur(10px);
                         box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                       }
                       h1 { 
                         font-size: 2.5em; 
                         margin-bottom: 20px;
                         text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                       }
                       .icon { 
                         font-size: 4em; 
                         margin-bottom: 20px;
                         opacity: 0.8;
                       }
                       p { 
                         font-size: 1.2em; 
                         margin-bottom: 30px; 
                         line-height: 1.6;
                         opacity: 0.9;
                       }
                       button { 
                         background: rgba(255,255,255,0.2);
                         color: white;
                         border: 2px solid rgba(255,255,255,0.3);
                         padding: 15px 30px;
                         border-radius: 50px;
                         font-size: 1.1em;
                         cursor: pointer;
                         transition: all 0.3s ease;
                         backdrop-filter: blur(10px);
                       }
                       button:hover { 
                         background: rgba(255,255,255,0.3);
                         border-color: rgba(255,255,255,0.5);
                         transform: translateY(-2px);
                       }
                       .status {
                         margin-top: 20px;
                         padding: 10px 20px;
                         background: rgba(255,193,7,0.2);
                         border-radius: 25px;
                         font-size: 0.9em;
                         border: 1px solid rgba(255,193,7,0.3);
                       }
                     </style>
                   </head>
                   <body>
                     <div class="container">
                       <div class="icon">🍽️</div>
                       <h1>مدیریت غذاها</h1>
                       <p>برنامه در حالت آفلاین است و آماده استفاده می‌باشد.</p>
                       <button onclick="window.location.reload()">بارگذاری مجدد</button>
                       <div class="status">
                         ✅ داده‌های شما به‌صورت محلی ذخیره شده‌اند
                       </div>
                     </div>
                   </body>
                   </html>`,
                  {
                    headers: { "Content-Type": "text/html" },
                  }
                );
              });
            }

            // For other requests, try to return a cached version
            return cache.match(event.request).then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              throw error;
            });
          });
      });
    })
  );
});

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("[ServiceWorker] Background sync:", event.tag);

  if (event.tag === "meal-sync") {
    event.waitUntil(
      // Future: sync meal data when online
      Promise.resolve()
    );
  }
});

// Handle service worker updates
self.addEventListener("message", (event) => {
  console.log("[ServiceWorker] Received message:", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Notification for offline status
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CLIENT_OFFLINE") {
    console.log("[ServiceWorker] Client is offline");
    // Future: Handle offline state
  }
});
