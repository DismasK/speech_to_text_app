var CACHE_NAME = 'speech_to_text_app';

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys()
            .then(keyList =>
                Promise.all(keyList.map(key => {
                    if (!cacheWhitelist.includes(key)) {
                        console.log('Deleting cache: ' + key)
                        return caches.delete(key);
                    }
                }))
            )
    );
});

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                fetch('./manifests/manifest.json')
                    .then(response => {
                        response.json()
                    })
                    .then(assets => {
                        const urlsToCache = [
                            "favicon.ico",
                            "touch-icons/touch-icon-57x57.png",
                            "touch-icons/touch-icon-60x60.png",
                            "touch-icons/touch-icon-72x72.png",
                            "touch-icons/touch-icon-76x76.png",
                            "touch-icons/touch-icon-114x114.png",
                            "touch-icons/touch-icon-120x120.png",
                            "touch-icons/touch-icon-144x144.png",
                            "touch-icons/touch-icon-152x152.png",
                            "splashscreens/iphone5_splash.png",
                            "splashscreens/iphone6_splash.png",
                            "splashscreens/iphoneplus_splash.png",
                            "splashscreens/iphonex_splash.png",
                            "splashscreens/ipad_splash.png",
                            "splashscreens/ipadpro1_splash.png",
                            "splashscreens/ipadpro2_splash.png",
                            "icons/icon-72x72.png",
                            "icons/icon-96x96.png",
                            "icons/icon-128x128.png",
                            "icons/icon-144x144.png",
                            "icons/icon-152x152.png",
                            "icons/icon-192x192.png",
                            "icons/icon-384x384.png",
                            "icons/icon-512x512.png",
                        ]
                        cache.addAll(urlsToCache)
                        console.log('cached');
                    })
            })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});