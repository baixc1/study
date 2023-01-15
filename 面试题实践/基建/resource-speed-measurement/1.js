// var p = performance.getEntriesByType("resource");
// console.log(p);

// // 初始化 PerformanceObserver 实例
// var obs = new PerformanceObserver((list, observe) => {
//   // 在新性能条目（资源等）记录在浏览器的性能时间轴中时收到通知
//   console.log("list", list.getEntries());
// });

// // 实例监听 resource 类型的事件（资源加载）
// obs.observe({ entryTypes: ["resource"] });

// 使用定时器实现 PerformanceObserver（IE不支持该API）
var curResLen = 0;
getEntrys(); // 页面初始化
setInterval(getEntrys, 300); // 轮询

// 获取页面新增的资源
function getEntrys() {
  const entrys = performance.getEntriesByType("resource");

  const curRes = entrys.slice(curResLen); // 截取新增的资源
  console.log(entrys, curResLen, curRes);

  curResLen += curRes.length;
}

setTimeout(() => {
  var a = document.createElement("script");
  a.src = "./a.js";
  document.body.appendChild(a);
}, 1000);

// 模拟动态加载图片
// var num = 2
// setInterval(()=>{
//   var a = document.createElement("img");
//   a.src = `${num++}.png`;
//   document.querySelector('imgs').appendChild(a);
// },30)

// 清空资源
performance.onresourcetimingbufferfull = () => {
  performance.clearResourceTimings();
  curResLen = 0;
};
