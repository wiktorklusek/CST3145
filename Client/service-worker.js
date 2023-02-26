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

self.addEventListener("install", function (e) {
    console.log("[Service Worker] Install");
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log("[Service Worker] Caching all the files");
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('fetch', function (e) {
  e.respondWith(
    // Check if the cache has the file
    caches.match(e.request).then(function (r) {
      // Download the file if it is not in the cache
      return r || fetch(e.request).then(function(response) {
        // Add the new file to cache
        return caches.open(cacheName).then(function(cache) {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
