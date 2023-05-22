// sw.js
/**
 * cacheApi: <https://developer.mozilla.org/zh-CN/docs/Web/API/Cache>
 */

const CACHE_NAME = "my-site-cache-v2";
const ROOT_URL = "<http://127.0.0.1:8000/>";
const urlsToCache = [
  // '/',            // 不要缓存根目录，否则页面一直都会加载缓存无法更新
  "/imgs/test.jpg", // 默认缓存/imgs/test.jpg
];
console.log("caches", caches);
/**
 * sw安装回调，一般在install中初始化缓存
 * 使用skipWaiting可以跳过等待，当sw文件有更新时可以立即生效
 */
self.addEventListener("install", (event) => {
  // 安装回调的逻辑处理
  console.log("<======service worker 安装成功======>");
  // 跳过等待
  self.skipWaiting();

  /**
   * 在install中初始化cache，将urlsToCache中的路径缓存
   */
  event.waitUntil(
    new Promise((resolve, reject) => {
      // 返回处理缓存更新的相关事情的 Promise
      caches.open(CACHE_NAME).then(async function (cache) {
        let currentCaches = await cache.keys();
        const rootCache = currentCaches.find((c) => c.url === ROOT_URL);
        if (rootCache) {
          // 如果缓存的根目录，则删除该缓存
          await cache.delete(rootCache);
        }
        // 缓存urlsToCache中的路径
        await cache.addAll(urlsToCache);
        currentCaches = await cache.keys();
        console.log("Cache 初始化成功", currentCaches);
        resolve("Cache 初始化成功");
      });
    })
  );
});

/**
 * sw激活回调
 */
self.addEventListener("activate", (event) => {
  // 激活回调的逻辑处理
  console.log("<======service worker 激活成功======>");
});

/**
 * 拦截请求，可以再这个回调中处理请求或添加新的缓存路径
 */
self.addEventListener("fetch", (event) => {
  console.log(`service worker 抓取请求成功: ${event.request.url}`);
  if (!event.request) return;

  /**
   * 对于install阶段已缓存的请求，返回缓存；对于未缓存的请求，加入缓存（根路径除外）
   */
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        // 命中缓存，把被缓存的值返回
        console.log("命中缓存，把被缓存的值返回", response);
        return response;
      } else {
        if (event.request.url === ROOT_URL) {
          // 不要缓存根目录，否则页面一直都会加载缓存无法更新
          console.log("请求为根目录，直接返回", event.request);
          return fetch(event.request);
        }
        // 没有命中缓存，将这个请求添加到缓存
        console.log("没有命中缓存，将这个请求缓存", event.request);

        // /**
        //  * 克隆请求
        //  * 请求是一个流，只能使用一次。
        //  * 因为我们通过缓存请求和浏览器请求分别使用了一次获取，所以我们需要克隆响应
        //  */
        // const fetchRequest = event.request.clone();

        return fetch(event.request).then(function (response) {
          /**
           * 检查response是否有效
           * 确保 response 有效
           * 检查 response 的状态是200
           * 确保 response 的类型是 basic 类型的，这说明请求是同源的，这意味着第三方的请求不能被缓存。
           */
          // if (
          //   !response ||
          //   response.status !== 200 ||
          //   response.type !== "basic"
          // ) {
          //   return response;
          // }

          /**
           * 克隆response
           * response 是一个 Stream，那么它的 body 只能被使用一次
           * 所以为了让浏览器跟缓存都使用这个body，我们必须克隆这个body，一份到浏览器，一份到缓存中缓存
           */
          const responseToCache = response.clone();

          console.log("添加缓存", event.request);
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      }
    })
  );
});
