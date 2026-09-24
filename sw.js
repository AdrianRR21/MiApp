/* Permite abrir la app sin conexión (v2: siempre comprueba si hay versión nueva).
   Primero intenta descargar la versión nueva de GitHub; si no hay internet, usa la guardada.
   Así, cuando subas cambios, se verán en cuanto abras la app con conexión. */
const CACHE = "miapp";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request, { cache: "no-cache" }).then(r => {
      const copia = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copia));
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
