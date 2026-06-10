// 萤幕 Lumière — Service Worker
// 策略：
//   1. 导航请求（HTML）：network-first，回落到 cache，确保更新能拿到
//   2. 静态资源（JS/CSS/字体/图标）：stale-while-revalidate，离线可用
//   3. LLM API：network-only，不缓存
//   4. 跨域请求：passthrough
const VERSION = "lumiere-v1.4.0";
const STATIC_CACHE = `static-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;
const PRECACHE = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // LLM / 外部 API：永远走网络
  if (
    url.host.includes("openai.com") ||
    url.host.includes("anthropic.com") ||
    url.host.includes("googleapis.com") ||
    url.host.includes("api.")
  ) {
    return;
  }
  // 导航请求
  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req));
    return;
  }
  // 静态资源
  if (
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/manifest.webmanifest" ||
    url.pathname === "/favicon.svg" ||
    /\.(js|css|woff2?|ttf|otf|png|jpg|jpeg|webp|svg|ico)$/.test(url.pathname)
  ) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }
  // 其他：network-first 回落到 cache
  event.respondWith(networkFirst(req));
});

async function networkFirst(req) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const fresh = await fetch(req);
    if (fresh && fresh.status === 200) cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    if (cached) return cached;
    // 离线时回落到根
    if (req.mode === "navigate") {
      const root = await caches.match("/index.html");
      if (root) return root;
    }
    return new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(req);
  const networkPromise = fetch(req)
    .then((fresh) => {
      if (fresh && fresh.status === 200) cache.put(req, fresh.clone());
      return fresh;
    })
    .catch(() => null);
  return cached || (await networkPromise) || new Response("Offline", { status: 503 });
}

// 接收页面的消息：SKIP_WAITING 立即激活新版本
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
