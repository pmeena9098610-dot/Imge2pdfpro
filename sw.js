const CACHE_NAME = 'img2pdf-pro-v20-seo-expansion';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './favicon.svg',
    './tools.html',
    './compress-pdf.html',
    './merge-pdf.html',
    './split-pdf.html',
    './pdf-to-jpg.html',
    './photo-to-pdf.html',
    './jpg-to-pdf.html',
    './png-to-pdf.html',
    './pdf-to-png.html',
    './word-to-pdf.html',
    './excel-to-pdf.html',
    './ppt-to-pdf.html',
    './articles.html',
    './aadhar-card-photo-to-pdf.html',
    './compress-pdf-100kb.html',
    './heic-to-pdf-converter.html',
    './webp-to-pdf-converter.html',
    './jpg-to-pdf-converter-hindi.html',
    './jpg-to-pdf-mac-iphone-guide.html',
    './best-ilovepdf-free-alternative-offline.html',
    './resume-cv-to-pdf-compressor.html',
    './how-to-resize-passport-photo-for-us-visa-pdf.html',
    './how-to-resize-photo-signature-for-ssc-upsc.html',
    './image-to-pdf-converter-bengali.html',
    './image-to-pdf-converter-marathi.html',
    './image-to-pdf-converter-tamil.html',
    './image-to-pdf-converter-telugu.html',
    './image-to-pdf-deutsch.html',
    './image-to-pdf-espanol.html',
    './image-to-pdf-francais.html',
    './image-to-pdf-portugues.html',
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
            fetch(event.request).catch(() => caches.match('./index.html'))
        );
        return;
    }
    // Cache-first for static assets, network-first fallback
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