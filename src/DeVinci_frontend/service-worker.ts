import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();
clientsClaim();

const CACHE_NAME = 'devinci-cache';

// All of these will be pre-cached (in install event)
const urlsToCache = [
  // List URLs to cache here
  '/',
  '/*',
  '/**',
  '/index.html',
  '/.well-known',
  '/.well-known/ii-alternative-origins',
  '/assets',
  '/assets/**',
  '/assets/index-61ac7e9e.js',
  '/assets/index-81637ee6.js',
  '/assets/index-ebbe5121.css',
  '/assets/loading-44d9ce91.gif',
  '/serviceWorker',
  '/serviceWorker/**',
  '/serviceWorker/service-worker.js',
  // Add other assets (CSS, JavaScript, images, etc.)
  '.ic-assets.json',
  'apple-touch-icon.png',
  'favicon.ico',
  'loading.gif',
  'main.css',
  'manifest.webmanifest',
  'worker.ts',
];

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
});

// Use a CacheFirst strategy for all requests (i.e. all requests are cached)
registerRoute(
  ({ request }) => true,
  new CacheFirst({
    cacheName: CACHE_NAME,
    plugins: [
      // Optionally, configure plugins, e.g., to limit cache entries or expiration
    ],
  })
);

