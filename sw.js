const CACHE_NAME = 'photosepdf-v43-audit-fix';

// Critical assets only — other pages cached lazily on first visit
const CRITICAL_ASSETS = [
    './',
    './style.css',
    './app.js',
    './interactive-core.js',
    './manifest.json',
    './favicon.svg'
];

// Pages to lazy-cache (not pre-cached to avoid install failure)
const PAGE_ASSETS = [
    './tools',
    './compress-pdf',
    './merge-pdf',
    './split-pdf',
    './pdf-to-jpg',
    './pdf-to-png',
    './photo-to-pdf',
    './jpg-to-pdf',
    './png-to-pdf',
    './word-to-pdf',
    './excel-to-pdf',
    './ppt-to-pdf',
    './rotate-pdf',
    './unlock-pdf',
    './pdf-to-word',
    './pdf-to-text',
    './watermark-pdf',
    './add-page-numbers-pdf',
    './delete-pdf-pages',
    './jpg-to-png',
    './png-to-jpg',
    './pdf-to-excel',
    './pdf-to-ppt',
    './about',
    './contact',
    './privacy-policy',
    './terms',
    './articles',
    './photo-ko-pdf-kaise-banaye',
    './mobile-se-pdf-kaise-banaye',
    './pdf-size-kam-kaise-kare',
    './ocr-pdf',
    './pdf-password',
    './esignature',
    './aadhar-ko-pdf-mein-convert',
    './pdf-tools-comparison',
    './camera-to-pdf',
    './ai-summarizer',
    './ai-notes',
    './aadhar-card-photo-to-pdf',
    './compress-pdf-100kb',
    './heic-to-pdf-converter',
    './webp-to-pdf-converter',
    './jpg-to-pdf-converter-hindi',
    './jpg-to-pdf-mac-iphone-guide',
    './best-ilovepdf-free-alternative-offline',
    './resume-cv-to-pdf-compressor',
    './how-to-resize-passport-photo-for-us-visa-pdf',
    './how-to-resize-photo-signature-for-ssc-upsc',
    './image-to-pdf-converter-bengali',
    './image-to-pdf-converter-marathi',
    './image-to-pdf-converter-tamil',
    './image-to-pdf-converter-telugu',
    './image-to-pdf-deutsch',
    './image-to-pdf-espanol',
    './image-to-pdf-francais',
    './image-to-pdf-portugues'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(CRITICAL_ASSETS))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cache) => {
                        if (cache !== CACHE_NAME) return caches.delete(cache);
                    })
                );
            })
        ])
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Never cache Google Ads, Analytics, or third-party tracking
    if (url.hostname.includes('google') ||
        url.hostname.includes('doubleclick') ||
        url.hostname.includes('adservice') ||
        url.hostname.includes('analytics')) {
        return; // Let browser handle natively
    }

    // Network-first for navigation requests (fresh HTML)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Cache the page for offline use
                    if (response && response.status === 200) {
                        const cacheCopy = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cacheCopy));
                    }
                    return response;
                })
                .catch(() => {
                    // Offline: try cached version of this page first, then fallback to homepage
                    return caches.match(event.request).then((cached) => cached || caches.match('./'));
                })
        );
        return;
    }

    // Cache-first for same-origin static assets only
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
                        const cacheCopy = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cacheCopy));
                    }
                    return networkResponse;
                }).catch(() => new Response('Offline', { status: 503, statusText: 'Service Unavailable' }));
            })
        );
    }
});