/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.SERVICE_WORKER.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = service-worker — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = service-worker.js
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

/**
 * ----------------------------------------------------------------------------
 * 5W + H SYSTEM MANIFEST (LEEWAY STANDARDS)
 * ----------------------------------------------------------------------------
 * WHAT: Service worker for the unified LeeWay Edge PWA
 * WHY: Enables offline caching and background event handling for the unified
 *      interface. Ensures local-first behaviour by caching core assets and
 *      providing a deterministic routing point for fetch events.
 * WHO: Creator: Leonard Lee | Leeway Innovations | A Leeway Industries Creation
 * WHERE: Browser (background worker context)
 * WHEN: Installed/activated by the PWA installer, handling fetch events at
 *       runtime
 * HOW: Caches application shell (HTML, JS) at install, serves cached
 *      responses first during fetch. Listens for future upgrade events.
 * TAG: UTIL.SERVICE-WORKER.MAIN
 * REGION: 🟠 UTIL
 * DISCOVERY_PIPELINE:
 *   Voice → Intent → Location → Vertical → Ranking → Render
 * ----------------------------------------------------------------------------
 */

const SW_VERSION = '1.0.0-unified';
const CACHE_NAME = `leeway-unified-cache-${SW_VERSION}`;

// List of assets to precache. These should include all resources necessary
// for an offline-first experience (HTML, JS, CSS, images). When adding
// additional assets (e.g., icons), update this list accordingly.
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/integrated.js'
];

self.addEventListener('install', (event) => {
  console.log('[Unified SW] Installing…');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Unified SW] Activated.');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercept network requests and respond from cache if possible.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});