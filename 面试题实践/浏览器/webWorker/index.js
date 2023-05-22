// https://mp.weixin.qq.com/s/XF7qOhbBtYlwADCiyxbT-w
/**
 * Web Worker
 * 1. 规范
 *    a. DediactedWorker , 简称 Worker。只能与一个页面渲染进程（Render Process）进行绑定和通信
 *    b. SharedWorker 可多 Tab 共享（safari兼容性差）
 * 2. 主线程（Main Thread）
 * 3. 多线程
 *    a. Web Worker 会创建 操作系统级别的线程（Worker 线程有独立的内存空间，Message Queue，Event Loop，Call Stack 等，线程间通过 postMessage 通信）
 *    b. 单线程并发 Concurrent（Event Loop实现）
 *    c. 多线程并发 Parallel
 * 4. 拆分同步逻辑异步方案问题
 *    a. 并非所有 JS 逻辑都可拆分
 *    b. 难以把控颗粒
 * 5. 性能提升
 *    a. 能否提升与设备 CPU 核数和线程策略有关
 * 6. 多线程和 CPU 核数
 *    a. 进程是操作系统 资源分配 的基本单位
 *    b. 线程是操作系统 调度 CPU 的基本单位
 *    c. 单核多线程通过时间切片交替执行
 *    d. 多核多线程可在不同核中真正并行
 * 7. Worker 线程策略
 *    a. 真正带来性能提升的是 多核多线程并行
 * 8. 主线程负责UI（主线程逻辑剥离）
 *    a. android/iOS开发
 *    b. 小程序
 * 9. 运行环境
 *    a. 全局对象不同
 *    b. worker 无 UI线程（无BOM/DOM）
 * 10. 数据传输方式
 *    a. Structured Clone 默认（复制 - 序列化和反序列化）
 *    b. Transfer Memory（内存权限转移，只能转 ArrayBuffer 等）
 *    c. Shared Array Buffer
 */

/**
 * Service Worker
 * 1. 作用：离线缓存/消息推送等
 * 2. 兼容性：IE/早期iOS不兼容
 * 3. Application面板
 *    a. Cache Storage
 *    b. Service Workers
 * 4. 生命周期
 *    a. installing
 *    b. installed 缓存文件
 *    c. activating
 *    d. activated 更新缓存
 */

// https://juejin.cn/post/7056594891551277093#heading-0

/**
 * Service Worker
 */

// 1. 注册，作用域 /，跨页面通信-同源(demo1)
// client
navigator.serviceWorker.getRegistrations();
navigator.serviceWorker.register("./sw.js");
// sw
self.addEventListener("install | activate | fetch | message", cb);
/**
 * 2. 生命周期 注册-> 解析执行 -> 安装(install) -> 激活(activate) -> Idle(fetch)
 * sw 可以对应多个网页
 */

/**
 * 3. 流程
 *    a. 初始化（取消注册，关闭所有标签页） 注册、安装、激活
 *    b. 刷新页面，可能获取fetch(其他页面同步)
 *    c. 修改本地文件 注册、安装
 *    d. skipWaiting 跳过等待，注册、安装、激活
 */

/**
 * 发送消息 demo2
 */
// client
navigator.serviceWorker.addEventListener("message", cb);
navigator.serviceWorker.controller.postMessage(msg);
navigator.serviceWorker.ready.then((registration) => {
  registration.active.postMessage();
});
// sw
event.source.postMessage(message);
self.clients.get(clientId).postMessage(message);
self.clients.matchAll(); // 获取所有client

/**
 * 缓存cache2 demo3
 */

// cw
// 等待缓存初始化
event.waitUntil()

// 操作缓存（全局变量caches）
caches.open(CACHE_NAME).then(c=>{
  // 获取缓存
  const allCaches = await c.keys()

  // 删除缓存
  c.delete(allCaches[0])

  // 添加缓存
  c.addAll()
})

// 请求拦截（返回缓存或发起请求+缓存）
event.respondWith(
  caches.match(event.request)
    .then(function(response) {
      if (response) {
        return response;
      } else {
        // 过滤根目录，缓存请求
        if (event.request.url === ROOT_URL) {
          return fetch(event.request);
        }
        
        return fetch(event.request).then(
          function(response) {
            // 添加缓存
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, response.clone());
              });
            
            // 返回
            return response;
          }
        );
      }
    }
  )
)