/* Permite abrir la app sin conexión (v3).
   Primero intenta descargar la versión nueva de GitHub; si no hay internet, usa la guardada.
   Solo guarda los archivos de la app, las fuentes y las librerías; nunca las respuestas de la nube. */
const CACHE = "miapp";
const GUARDABLES = ["fonts.googleapis.com", "fonts.gstatic.com", "cdnjs.cloudflare.com", "cdn.jsdelivr.net", "image.tmdb.org", "books.google.com", "covers.openlibrary.org"];
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin && !GUARDABLES.includes(url.hostname)) return;   // nube, APIs…: directo a internet
  e.respondWith(
    fetch(e.request, { cache: "no-cache" }).then(r => {
      if (r.ok || r.type === "opaque") { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match(e.request, { ignoreSearch: true, ignoreVary: true })))
  );
});
