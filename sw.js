const CALISMA_ALANI_ADI = "havadurumu-v1";
const ÖNBELLEK_LISTESI = [
  "./",
  "./index.html",
  "./havadurumu.css",
  "./havadurumu.js",
  "./ogiportyeni.png",
  "./manifest.json"
];

self.addEventListener("install", (olay) => {
  olay.waitUntil(
    caches.open(CALISMA_ALANI_ADI).then((onbellek) => {
      return onbellek.addAll(ÖNBELLEK_LISTESI);
    })
  );
});

self.addEventListener("fetch", (olay) => {
  olay.respondWith(
    caches.match(olay.request).then((yanit) => {
      return yanit || fetch(olay.request);
    })
  );
});