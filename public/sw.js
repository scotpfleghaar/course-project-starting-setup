var CACHE_STATIC = 'static-v6';
var CACHE_DYNAMIC = 'dynamic-v4';


self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  //Import forces app to wait
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(function(cache){
        console.log('[Service Worker] Precaching App shell');
        //Think of these as requests and not paths
        cache.addAll([
          '/',
          '/index.html',
          '/offline.html',
          '/src/js/app.js',
          '/src/js/feed.js',
          '/src/js/promise.js',
          '/src/js/fetch.js',
          '/src/js/material.min.js',
          '/src/css/app.css',
          '/src/css/feed.css',
          '/src/images/main-image.jpg',
          'https://fonts.googleapis.com/css?family=Roboto:400,700',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'

        ]);        
      })
  );
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  //Removes old Caches
  event.waitUntil(
    caches.keys()
      .then(function(keyList){
        return Promise.all(keyList.map(function(key){
          if(key !== CACHE_STATIC && key !== CACHE_DYNAMIC){
            console.log("[Service Worker] removing unused cache");
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response){
        if(response){
          return response; //Grab local from cache
        } else {
          return fetch(event.request) //Get from offsite
            .then(function(res){
              return caches.open(CACHE_DYNAMIC)
                .then(function(cache){
                  cache.put(event.request.url, res.clone());
                  return res;
                })
            })
            .catch(function(err){
              return caches.open(CACHE_STATIC)
                .then(function(cache){
                  return cache.match('/offline.html');
                })
            });
        }
      })
  );

});