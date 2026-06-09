// キャッシュのバージョンをコードの更新に合わせて変更する
const CACHE_NAME = 'shooting-log-v26.06.10';
const urlsToCache = [
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  // skipWaitingを呼ぶことで、待機状態をスキップして即座に新しいSWをアクティブにする
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  // 古いバージョンのキャッシュを削除する
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // 開いているページすべての制御をすぐに奪取する
  );
});

self.addEventListener('fetch', event => {
  // ネットワークを優先し、オフラインの時のみキャッシュを返す（ネットワークファースト戦略）
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
