var CACHE_VERSION = 5;
var CURRENT_CACHES = {
    prefetch: 'prefetch-cache-v' + CACHE_VERSION
};

self.addEventListener('install', function (event) {
    var now = Date.now();

    var urlsToPrefetch = [
        'index.html',
        'loginCliente.html',
        'loginProdutor.html',
        'cliente.html',
        'produtor.html',
        'perfilCliente.html',
        'perfilCliente.html',
        'perfilProdutor.html',
        'recuperarCliente.html',
        'recuperarProdutor.html',
        'telaCadastroCliente.html',
        'telaCadastroProdutor.html',
        'telaMenuCliente.html',
        'telaMenuProdutor.html',
        'manifest.json',
        'styles/app.css',
        'styles/index.css',
        'jquery/jquery-3.3.1.js',
        'js/App.js',
        'js/Cliente.js',
        'js/Produtor.js',
        'js/Cadastro.js',
        'js/Index.js',
        'js/Login.js',
        'js/Mapa.js',
        'js/MenuCliente.js',
        'js/MenuProdutor.js',
        'js/Perfil.js',
        'js/Recuperar.js',
        'mdl/material.min.css',
        'mdl/material.js',
        'mdl/mdl-selectfield.css',
        'mdl/mdl-selectfield.js',
        'openlayers/ol.css',
        'openlayers/ol.js',
        'images/marker1.svg',
        'images/marker2.svg',
        'images/marker3.svg',
        'images/account.png',
        'images/acima.png',
        'images/broto.png',
        'images/broto_white.png',
        'images/expandirBlack.png',
        'images/extensao.png',
        'images/fullscreen.png',
        'images/management.png',
        'images/new_product.png',
        'images/reduzirBlack.png',
        'images/icons/icon-72x72.png',
        'images/icons/icon-96x96.png',
        'images/icons/icon-128x128.png',
        'images/icons/icon-144x144.png',
        'images/icons/icon-152x152.png',
        'images/icons/icon-192x192.png',
        'images/icons/icon-384x384.png',
        'images/icons/icon-512x512.png'
    ];


    // console.log('Handling install event. Resources to prefetch:', urlsToPrefetch);

    event.waitUntil(
        caches.open(CURRENT_CACHES.prefetch).then(function (cache) {
            var cachePromises = urlsToPrefetch.map(function (urlToPrefetch) {
                var url = new URL(urlToPrefetch, location.href);
                url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;

                var request = new Request(url, { mode: 'no-cors' });
                return fetch(request).then(function (response) {
                    if (response.status >= 400) {
                        throw new Error('request for ' + urlToPrefetch +
                            ' failed with status ' + response.statusText);
                    }

                    return cache.put(urlToPrefetch, response);
                }).catch(function (error) {
                    console.error('Not caching ' + urlToPrefetch + ' due to ' + error);
                });
            });

            return Promise.all(cachePromises).then(function () {
                console.log('Pre-fetching complete.');
            });
        }).catch(function (error) {
            console.error('Pre-fetching failed:', error);
        })
    );
});

self.addEventListener('activate', function (event) {
    var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
        return CURRENT_CACHES[key];
    });

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (expectedCacheNames.indexOf(cacheName) === -1) {
                        console.log('Deleting out of date cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    // console.log('Handling fetch event for', event.request.url);

    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                // console.log('Found response in cache:', response);

                return response;
            }

            // console.log('No response found in cache. About to fetch from network...');

            return fetch(event.request).then(function (response) {
                // console.log('Response from network is:', response);

                return response;
            }).catch(function (error) {
                console.error('Fetching failed:', error);

                throw error;
            });
        })
    );
});