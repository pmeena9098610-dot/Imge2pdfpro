const CACHE_NAME = 'photosepdf-v36-fixed';
const ASSETS = [
    './',
    './style.css',
    './app.js',
    './interactive-core.js',
    './manifest.json',
    './favicon.svg',
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
    './image-to-pdf-portugues',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11',
    'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
    'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js',
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
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
    // Always fetch navigation requests from network (fresh HTML)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => caches.match('./'))
        );
        return;
    }
    // Cache-first for static assets, network fallback
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
                    const cacheCopy = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cacheCopy));
                }
                return networkResponse;
            }).catch(() => null);
        })
    );
});