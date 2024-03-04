console.log('Service Worker file START');

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();
clientsClaim();

const CACHE_NAME = 'devinci-cache';
const urlsToCache = [
  // List URLs to cache here
  '/',
  '/index.html',
  // Add other assets (CSS, JavaScript, images, etc.)
];

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event to cache all requests
/* self.addEventListener('fetch', event => {
  console.log('Service Worker file fetch event ', event);
  console.log('Service Worker file fetch event.request ', event.request);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cache hit or fetch and cache
  console.log('Service Worker file fetch response ', response);
        return response || fetch(event.request).then(fetchResponse => {
          console.log('Service Worker file fetch fetchResponse ', fetchResponse);
          return caches.open(CACHE_NAME).then(cache => {
            console.log('Service Worker file fetch cache ', cache);
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
  );
}); */

self.addEventListener('message', (event) => {
  console.log('Service Worker file message');
  if (event.data && event.data.type === 'SKIP_WAITING')
    self.skipWaiting()
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
});


console.log('Service Worker file END');

