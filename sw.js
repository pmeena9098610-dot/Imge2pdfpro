// PhotoSePDF.in — Service Worker v51 (Traffic Boost Update)
// Cache-first for assets, Network-first for HTML pages

const CACHE_NAME    = 'photosepdf-v52';
const CACHE_VERSION = 52;

// Critical assets pre-cached on install
const CRITICAL_ASSETS = [
    '/',
    '/style.css',
    '/app.js',
    '/interactive-core.js',
    '/manifest.json',
    '/favicon.svg',
    '/og-image.png'
];

// Top landing pages pre-cached for offline access
const TOP_PAGES = [
    '/jpg-to-pdf',
    '/photo-to-pdf',
    '/png-to-pdf',
    '/compress-pdf',
    '/merge-pdf',
    '/split-pdf',
    '/ssc-photo-resizer',
    '/passport-photo-maker',
    '/upsc-photo-resizer',
    '/tools',
    '/compress-image-to-20kb',
    '/resize-image-kb',
    '/ssc-mts-photo-resizer'
];

// Third-party domains to NEVER cache
const NO_CACHE_HOSTS = [
    'google-analytics.com',
    'googletagmanager.com',
    'googlesyndication.com',
    'doubleclick.net',
    'adservice.google.com',
    'adtrafficquality.google',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdnjs.cloudflare.com',
    'fundingchoicesmessages.google.com'
];

// ── Install: pre-cache critical assets ──────────────────────────
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
            Promise.allSettled(
                [...CRITICAL_ASSETS, ...TOP_PAGES].map(url =>
                    cache.add(url).catch(() => {/* ignore individual failures */})
                )
            )
        )
    );
});

// ── Activate: delete old caches ──────────────────────────────────
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then((cacheNames) =>
                Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => caches.delete(name))
                )
            )
        ])
    );
});

// ── Fetch: smart caching strategy ───────────────────────────────
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip third-party/ad/analytics requests
    if (NO_CACHE_HOSTS.some(host => url.hostname.includes(host))) return;

    // Skip non-http(s) requests (chrome-extension, etc.)
    if (!url.protocol.startsWith('http')) return;

    // ── Strategy 1: HTML pages → Network-first (fresh content) ──
    if (request.mode === 'navigate' ||
        request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response?.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => cache.put(request, clone))
                            .catch(() => {});
                    }
                    return response;
                })
                .catch(() =>
                    caches.match(request)
                        .then(cached => cached || caches.match('/'))
                )
        );
        return;
    }

    // ── Strategy 2: CSS/JS → Stale-while-revalidate ─────────────
    if (url.pathname.match(/\.(css|js)$/)) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) =>
                cache.match(request).then((cached) => {
                    const networkFetch = fetch(request).then((response) => {
                        if (response?.ok) cache.put(request, response.clone()).catch(() => {});
                        return response;
                    }).catch(() => cached);
                    return cached || networkFetch;
                })
            )
        );
        return;
    }

    // ── Strategy 3: Images/Fonts → Cache-first (long-lived) ─────
    if (url.pathname.match(/\.(png|jpg|jpeg|webp|avif|svg|gif|ico|woff|woff2|ttf)$/)) {
        event.respondWith(
            caches.match(request).then(cached =>
                cached || fetch(request).then(response => {
                    if (response?.ok) {
                        caches.open(CACHE_NAME)
                            .then(cache => cache.put(request, response.clone()))
                            .catch(() => {});
                    }
                    return response;
                }).catch(() => new Response('', { status: 404 }))
            )
        );
        return;
    }

    // ── Default: Network with cache fallback ─────────────────────
    event.respondWith(
        fetch(request)
            .then(response => {
                if (response?.ok && url.origin === self.location.origin) {
                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(request, response.clone()))
                        .catch(() => {});
                }
                return response;
            })
            .catch(() => caches.match(request))
    );
});

// ── Message handler: force cache clear ──────────────────────────
self.addEventListener('message', (event) => {
    if (event.data?.action === 'skipWaiting') self.skipWaiting();
    if (event.data?.action === 'clearCache') {
        caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
    }
});