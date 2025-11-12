// ✅ Polaris Service Worker (PWA offline + caching)
// --------------------------------------------------

// Define a unique cache name (change version when you update files)
const CACHE_NAME = "polaris-cache-v1";

// Files you want cached for offline use
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/main.js",
  "./js/search.js",
  "./js/instant.js",
  "./js/shopping.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./wallpapers/default.png",
  "./manifest.webmanifest"
];

// ⚡ Install event (cache app shell)
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Installing Polaris cache...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Caching app assets...");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 🔁 Activate event (clean up old caches)
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activating new cache...");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache:", name);
            return caches.delete(name);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// 🌐 Fetch event (network first, fallback to cache)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone response and update cache
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, resClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});