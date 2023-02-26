var cacheName = 'webstore-v1';
var cacheFiles = [
  'index.html',
  'app.js',
  'css/style.css',
  'product.js',
  'webstore.manifest',
  'assets/art.svg',
  'assets/chemistry.svg',
  'assets/dna.svg',
  'assets/earth.svg',
  'assets/economy.svg',
  'assets/icon-bigger.svg',
  'assets/icon-smaller.svg',
  'assets/it.svg',
  'assets/language.svg',
  'assets/math.svg',
  'assets/poetry.svg',
  'assets/robot.svg',
];

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('[Service Worker] Caching all the files');
      return cache.addAll(cacheFiles);
    })
   );
});

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (r) {
    // Download the file if it is not in the cache
    return r
    }))
});

// Using the cached files
self.addEventListener('fetch', (e) => {
  console.log('[Service Worker] Fetched resource ' + e.request.url);
});
