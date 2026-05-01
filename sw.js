/* ============================================================
 * Service Worker · Dashboard SIA · ANP/AVA CDMX · v34
 * ============================================================
 * Estrategia: cache-first para recursos estáticos; network-first
 * para tiles de mapa. Permite operar el dashboard sin conexión
 * después de la primera carga.
 *
 * Ámbito: solo el subdirectorio del repositorio.
 * ============================================================ */

const CACHE_VERSION = 'sia-v34-2026-04-30';
const CACHE_RUNTIME = 'sia-runtime-v34';

/* Recursos críticos: pre-cacheados al instalar el SW */
const CORE_ASSETS = [
  './',
  './index.html',
  './SIA_LOGO-03.png',
  './data/anp_inventario.csv',
  './data/geometrias.geojson',
  './data/alcaldias.geojson',
  './data/suelo_conservacion.geojson'
];

/* === INSTALL: pre-cachear assets críticos === */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      // addAll falla si UN recurso falla; usamos add() individuales para tolerancia
      return Promise.all(
        CORE_ASSETS.map(url =>
          cache.add(url).catch(err => console.warn('[SW] No se pudo cachear:', url, err))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

/* === ACTIVATE: limpiar caches viejos === */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_VERSION && k !== CACHE_RUNTIME)
          .map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

/* === FETCH: estrategia mixta === */
self.addEventListener('fetch', event => {
  const req = event.request;

  // Solo manejar GET (POSTs no se cachean)
  if(req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1. Tiles de mapa (CartoDB, ArcGIS): cache-first con expiración suave
  if(/(?:cartodb|arcgisonline|fastly)/.test(url.hostname)){
    event.respondWith(cacheFirst(req, CACHE_RUNTIME));
    return;
  }

  // 2. Recursos del propio sitio: cache-first con fallback a red
  if(url.origin === location.origin){
    event.respondWith(cacheFirst(req, CACHE_VERSION));
    return;
  }

  // 3. Nominatim (geocoder): network-only, no cachear (queries únicas + política de uso)
  if(/nominatim\.openstreetmap\.org/.test(url.hostname)){
    return;  // dejar que el fetch nativo maneje
  }

  // 4. CDN de Leaflet, fuentes Google: cache-first
  if(/(?:unpkg|fonts\.googleapis|fonts\.gstatic)/.test(url.hostname)){
    event.respondWith(cacheFirst(req, CACHE_RUNTIME));
    return;
  }

  // 5. Otros recursos: network-first
  event.respondWith(networkFirst(req));
});

/* === Estrategia: cache-first === */
async function cacheFirst(req, cacheName){
  const cached = await caches.match(req);
  if(cached) return cached;
  try {
    const response = await fetch(req);
    if(response && response.status === 200){
      const cache = await caches.open(cacheName);
      cache.put(req, response.clone());
    }
    return response;
  } catch(err) {
    console.warn('[SW] Sin red y sin caché para:', req.url);
    return new Response('Recurso no disponible offline', {status: 503, statusText: 'Service Unavailable'});
  }
}

/* === Estrategia: network-first === */
async function networkFirst(req){
  try {
    const response = await fetch(req);
    if(response && response.status === 200){
      const cache = await caches.open(CACHE_RUNTIME);
      cache.put(req, response.clone());
    }
    return response;
  } catch(err) {
    const cached = await caches.match(req);
    if(cached) return cached;
    return new Response('Recurso no disponible', {status: 503, statusText: 'Service Unavailable'});
  }
}
