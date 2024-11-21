// Version
const cacheVersion = 1;
const activeCaches = {
    static: `static-v${cacheVersion}`,
    dynamic: `dynamic-v${cacheVersion}`
}


// Events
self.addEventListener("install", event => {
    self.skipWaiting()

    event.waitUntil(
        (async () => {
            const cache = await caches.open(activeCaches.static);
            return cache.addAll([
                "/",
                "/offline.html",    // fallback
                "/manifest.json",
                // "/sw.js",
                // "/assets/js/app.js",
                "/asset/style/style.css",
                "/asset/style/fa.min.css",
            ])
        })()
    )
})


self.addEventListener("activate", event => {
    const activeCacheNames = Object.values(activeCaches);

    event.waitUntil(
        (async () => {
            const browserCacheNames = await caches.keys();

            return Promise.all(
                browserCacheNames.map(async browserCacheName => {
                    if (!activeCacheNames.includes(browserCacheName)) {
                        return caches.delete(browserCacheName);
                    }
                })
            )
        })()
    )
})


self.addEventListener("fetch", async event => {
    const dynamicFreshURLs = ["https://pwa-cms.iran.liara.run/api/courses"];

    event.respondWith(
        (async () => {
            try {
                const response = await fetch(event.request);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                if (dynamicFreshURLs.includes(event.request.url)) {
                    const courses = await (response.clone()).json();
                    await Promise.all(
                        courses.map(async course => await db.courses.put(course))
                    )

                } else {
                    const cachedResponse = await caches.match(event.request);

                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    const cache = await caches.open(activeCaches.dynamic)
                    if (!response.clone().url.startsWith("chrome-extension")) {
                        await cache.put(event.request, response.clone())
                    }
                }

                return response;

            } catch (error) {
                const cachedResponse = await caches.match(event.request);
                if (cachedResponse) {
                    return cachedResponse;
                }

                return caches.match("/offline.html")
            }
        })()
    );
})