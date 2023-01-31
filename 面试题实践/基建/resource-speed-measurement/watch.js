// 监听资源加载

// support PerformanceObserver
if (typeof PerformanceObserver === "function") {
  // 全局注册PerformanceObserverCustom，回调函数
  window.PerformanceObserverCustom = function (cb) {
    // 初始化 PerformanceObserver 实例
    var obs = new PerformanceObserver((list, observe) => {
      // 在新性能条目（资源等）记录在浏览器的性能时间轴中时收到通知
      cb();
    });

    // 实例监听 resource 类型的事件（资源加载）
    obs.observe({ entryTypes: ["resource"] });
  };
}
// support by timer
else {
  window.PerformanceObserverCustom = function (cb) {
    setInterval(cb, 3000); // 轮询
  };
}
