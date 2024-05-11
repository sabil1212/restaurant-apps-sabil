/* eslint-disable no-restricted-globals */
import CacheHelper from './cache-helper';

const assetsToCache = [
  './',
  '../images/heros/hero-image_72.jpg',
  '../images/heros/hero-image_1.jpg',
  '../images/heros/hero-image_512.jpg',
  'src/templates/index.html',
  './manifest',
];

self.addEventListener('install', (event) => {
  console.log('Installing Service Worker ...');
  event.waitUntil(CacheHelper.cachingAppShell([...assetsToCache]));
});

self.addEventListener('activate', (event) => {
  console.log('Activating Service Worker ...');
  event.waitUntil(CacheHelper.deleteOldCache());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(CacheHelper.revalidateCache(event.request));
});
