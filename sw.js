const CACHE = 'offline-fallback-v1';

// Кешируем данные
self.addEventListener('install', (event) => {
    event.waitUntil(
    caches
        .open(CACHE)
        .then((cache) => cache.addAll([
            './',
            './index.html',
            './events.json',
            './js/index.js',
            './js/events.js',
            './js/notifications.js',
			'./images/icon.png',
            './css/styles.css',
    ]))
    .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    // Перехватываем запросы
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
    event.respondWith(networkOrCache(event.request)
            .catch(() => useFallback()));
});

function networkOrCache(request) {
    return fetch(request)
        .then((response) => response.ok ? response : fromCache(request))
.catch(() => fromCache(request));
}

//Fallback
const FALLBACK = '<div>В данный момент времени у вас отсутствует подключение к интернету. Попробуйте загрузить страницу позже</div>'

function useFallback() {
    return Promise.resolve(new Response(FALLBACK, { headers: {
        'Content-Type': 'text/html; charset=utf-8'
    }}));
}

function fromCache(request) {
    return caches.open(CACHE).then((cache) =>
        cache.match(request).then((matching) =>
        matching || Promise.reject('no-match')
));
}