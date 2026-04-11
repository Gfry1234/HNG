// Service Worker for offline support and caching
const CACHE_VERSION = 'v1'
const CACHE_NAME = `converter-cache-${CACHE_VERSION}`

// Assets to cache on install
const ASSETS_TO_CACHE = [
  '/',
  '/converters/currency',
  '/converters/length',
  '/converters/temperature',
  '/converters/weight',
]

// Network-first strategy for API calls, cache-first for assets
const CACHE_STRATEGY = {
  networkFirst: ['/api/', 'exchangerate-api.com'],
  cacheFirst: ['.js', '.css', '.png', '.jpg', '.jpeg', '.svg', '.woff', '.woff2'],
}

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell')
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[Service Worker] Failed to cache some assets:', err)
      })
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Handle API requests with network-first strategy
  if (CACHE_STRATEGY.networkFirst.some((pattern) => url.href.includes(pattern))) {
    event.respondWith(networkFirst(request))
    return
  }

  // Handle assets with cache-first strategy
  if (CACHE_STRATEGY.cacheFirst.some((ext) => url.pathname.endsWith(ext))) {
    event.respondWith(cacheFirst(request))
    return
  }

  // Default: network-first for everything else
  event.respondWith(networkFirst(request))
})

// Network-first strategy: try network first, fall back to cache
async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      // Cache successful responses
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.log('[Service Worker] Network request failed, using cache:', request.url)
    const cached = await caches.match(request)
    if (cached) {
      return cached
    }
    // Return offline page or generic response
    return new Response('Offline - resource not available', { status: 503 })
  }
}

// Cache-first strategy: check cache first, fall back to network
async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) {
    return cached
  }

  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.log('[Service Worker] Network failed and no cache for:', request.url)
    return new Response('Offline - resource not available', { status: 503 })
  }
}
