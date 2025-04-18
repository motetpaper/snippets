// sw.js (service worker)
const cacheName = 'foo-1-2-3'; // app version
const swfiles = [
  './',
  './index.html',
  './app.js', 
  './style.css',
  './favicon.ico',
  //... more files ...
];

// sw template area below
//
//

const contentToCache = [];
contentToCache.concat(swfiles);

// pwa has non-DOM workspace
self.addEventListener('install', (evt) => {
  console.log('[sw.js] installing ... ');
  evt.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      console.log('[sw.js] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })(),
  );

// oninstall
});


// pwa works offline
self.addEventListener('fetch', (evt) => {

  // the following if/else block tries to fix
  // this the following error
  //
  // TypeError: Failed to execute 'put' on 'Cache':
  // Request method 'POST' is unsupported
  //

  const nocacheurls = [
    'https://imgsct.cookiebot.com',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com',
  ];

  if(nocacheurls.some((a) => evt.request.url.includes(a))) {
    console.log(`[sw.js] Not caching ${evt.request.url} ...`);
    evt.respondWith(fetch(evt.request));
  } else {
    evt.respondWith(
      (async () => {
        const r = await caches.match(evt.request);
        console.log(`[sw.js] Fetching resource: ${evt.request.url}`);
        console.log(evt);
        if (r) {
          return r;
        }
        const response = await fetch(evt.request);
        const cache = await caches.open(cacheName);
        console.log(`[sw.js] Caching new resource: ${evt.request.url}`);
        cache.put(evt.request, response.clone());
        return response;
      })(),
    );
  }

// onfetch
});


// pwa upgrades cache
self.addEventListener('activate', (event) => {
  const cacheAllowlist = [ cacheName ];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheVersion) => {
          if (!cacheAllowlist.includes(cacheVersion)) {
            console.log(`[sw.js] Updating cache to ${cacheVersion} ... `);            
            return caches.delete(cacheVersion);
          }
        }),
      );
    }),
  );

// onactivate
});
