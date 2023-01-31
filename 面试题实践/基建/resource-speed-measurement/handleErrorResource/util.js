const ErrImgList = [];

// 动态加载a
setTimeout(() => {
  var a = document.createElement("script");
  var b = document.createElement("img");
  a.src = "./a.js";
  b.src = "./xx.img";
  document.body.appendChild(a);
  document.body.appendChild(b);
}, 1000);

// 监听资源加载失败事件
watchImgError();

// 页面资源初始化完成后
window.onload = function () {
  // 初始化资源加载情况上报
  reportResource();

  // 动态资源加载后
  {
    var a = document.createElement("script");
    a.src = "./watch.js";
    document.body.appendChild(a);
    a.onload = function () {
      window.PerformanceObserverCustom(() => {
        // 资源错误事件触发时机，可能晚于该事件
        setTimeout(() => {
          reportResource();
        }, 50);
      });
    };
  }
};

// 监听动态的资源错误
function watchImgError(params) {
  // window.addEventListener 为捕获状态时（第三个参数为 true）能捕获到 js 执行错误 ？，也能捕获带有 src 的标签元素的加载错误。 为冒泡状态时（第三个参数为 false）能捕获到 js 执行错误，不能捕获带有 src 的标签元素的加载错误。
  window.addEventListener(
    "error",
    (event) => {
      console.log(22, event);
      const { nodeName, src, href } = event.target;
      console.log(nodeName, src);
      // 发生错误的资源存起来，因为错误的也会放在 entries 中，用来过滤
      if (nodeName === "IMG" || nodeName === "SCRIPT") {
        ErrImgList.push(src);
      } else if (nodeName === "LINK") {
        ErrImgList.push(href);
      }
    },
    true // 设置为 true 表示捕获
  );

  window.addEventListener(
    "error",
    (event) => {
      console.log(11, event);
    },
    false // 设置为 true 表示捕获
  );
}

var curResLen = 0;
// 资源加载情况上报
function reportResource(params) {
  var entrys = performance.getEntriesByType("resource");
  const curRes = entrys.slice(curResLen); // 截取新增的资源
  console.log("ErrImgList", ErrImgList);
  const uploads = curRes.filter((entry) => !ErrImgList.includes(entry.name));
  console.log(curRes, uploads);
  curResLen += curRes.length;
}

// 清空资源
performance.onresourcetimingbufferfull = () => {
  performance.clearResourceTimings();
  curResLen = 0;
};
