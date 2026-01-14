const CACHE_NAME = 'juris-ark-v2';
const RUNTIME_CACHE = 'juris-ark-runtime-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/admin/index.html',
  '/admin/dashboard.html',
  '/admin/style.css',
  '/admin/admin.js',
  '/admin/supabase-client.js',
  '/data/activities.json',
  '/data/appointments.json',
  '/data/blog.json',
  '/data/cases.json',
  '/data/deadlines.json',
  '/data/faq.json',
  '/data/settings.json',
  '/data/team.json',
  '/data/testimonials.json'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(() => {
          console.log('Some assets could not be cached');
        });
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network first for API, cache first for static assets
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Ignore non-http(s) schemes (extensions, chrome://, etc.) to avoid cache.put errors
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // For API calls - network first, fallback to cache
  if (url.pathname.includes('/api/') || url.hostname !== self.location.hostname) {
    event.respondWith(networkFirst(request));
    return;
  }

  // For local static assets - cache first, fallback to network
  event.respondWith(cacheFirst(request));
});

// Cache first strategy - good for static assets
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    
    if (response && response.status === 200) {
      try {
        const cache = await caches.open(RUNTIME_CACHE);
        await cache.put(request, response.clone());
      } catch (e) {
        console.warn('Cache put failed (cacheFirst):', e, request.url);
      }
    }
    
    return response;
  } catch (error) {
    return new Response('Offline - Ressource non disponible', { status: 503 });
  }
}

// Network first strategy - good for API calls
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    
    if (response && response.status === 200) {
      try {
        const cache = await caches.open(RUNTIME_CACHE);
        await cache.put(request, response.clone());
      } catch (e) {
        console.warn('Cache put failed (networkFirst):', e, request.url);
      }
    }
    
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return new Response('Offline - Service indisponible', { status: 503 });
  }
}

// Handle background sync
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  try {
    // Implement data sync logic here
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}
