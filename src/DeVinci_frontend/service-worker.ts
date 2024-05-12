import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim, setCacheNameDetails } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();

// This array should be replaced by self.__WB_MANIFEST in production
// self.__WB_MANIFEST is injected by Workbox during the build process
const manifestEntries = self.__WB_MANIFEST;
console.log("manifestEntries ", manifestEntries);

const CACHE_NAME = 'devinci-cache';

setCacheNameDetails({
  prefix: "",
  precache: CACHE_NAME,
  suffix: "",
});

precacheAndRoute(manifestEntries);

self.skipWaiting();
clientsClaim();

// All of these will be pre-cached (in install event)
/* const urlsToCache = [
  // List URLs to cache here
  //'/',
  //'/*',
  //'/**',
  '/index.html',
  //'/.well-known',
  //'/.well-known/**',
  //'/.well-known/ii-alternative-origins',
  //'/assets',
  //'/assets/**',
  '/assets/index.js',
  //'/assets/index-81637ee6.js',
  '/assets/index.css',
  '/assets/loading.gif',
  //'/serviceWorker',
  //'/serviceWorker/**',
  '/serviceWorker/service-worker.js',
  // Add other assets (CSS, JavaScript, images, etc.)
  '/.ic-assets.json',
  '/apple-touch-icon.png',
  '/favicon.ico',
  '/loading.gif',
  //'main.css',
  '/manifest.webmanifest',
  //'worker.ts',
]; */

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  /* event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  ); */
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

