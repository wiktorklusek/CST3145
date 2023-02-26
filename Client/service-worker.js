const cacheName = 'webstore-v1';
const cacheFiles = [
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

self.addEventListener("install", async (event) => {
  console.log("[Service Worker] Install");
  const cache = await caches.open(cacheName);
  console.log("[Service Worker] Caching all the files");
  await cache.addAll(cacheFiles);
});

self.addEventListener('fetch', event => {
  event.respondWith(async function() {
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    }
    const networkResponse = await fetch(event.request);
    const cache = await caches.open(cacheName);
    await cache.put(event.request, networkResponse.clone());
    return networkResponse;
  }());
});
