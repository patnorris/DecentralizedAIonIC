import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim, setCacheNameDetails } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

import { ServiceWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();

// This array should be replaced by self.__WB_MANIFEST in production
// self.__WB_MANIFEST is injected by Workbox during the build process
const manifestEntries = self.__WB_MANIFEST;

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
  console.info('Service Worker installing.');
  /* event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  ); */
});

let handler: ServiceWorkerMLCEngineHandler;

self.addEventListener("activate", function (event) {
  console.info('Service Worker activated.');
  handler = new ServiceWorkerMLCEngineHandler();
  console.log("Service Worker is ready");
});

/* self.addEventListener('activate', (event) => {
  console.info('Service Worker activated.');
}); */

// Use a NetworkFirst strategy for all requests (i.e. all requests are cached)
registerRoute(
  ({ request }) => true,
  new NetworkFirst({
    cacheName: CACHE_NAME,
    plugins: [
      // Optionally, configure plugins, e.g., to limit cache entries or expiration
    ],
  })
);

