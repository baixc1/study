// https://blog.csdn.net/muzidigbig/article/details/100169801
// https://www.cnblogs.com/dasusu/p/12200176.html

/**
 * 常见的内存泄露案例
 */

// 1. 意外的全局变量

// 2. 被遗忘的定时器

// 每次点击，调用 handleClick 后，定时器和回调函数的内存不会被释放（如图一）
// 如果回调函数中有dom引用，页面销毁后dom也不能释放（多次打开关闭后内存会不断上升）
function handleClick() {
  for (let i = 0; i < 100; i++) {
    setTimeout(cb);
  }
}

function cb() {
  for (let i = 0; i < 1000; i++) {
    // 操作dom
  }
}

// 3. 使用不当的闭包（返回的函数，其生命周期不宜过长，方便及时回收）

// 4. 遗漏的DOM元素（生命周期：js引用、dom树引用）

// 5. 网络回调（页面销毁时，注销网络回调 - 清除网络内容引用？）

/**
 * 内存泄漏监控
 */

// 内存不足会造成不断 GC， GC 会阻塞主线程

// 核心：持续的新增内存，因为外部引用，无法释放。最终内存泄漏

// 三种内存监控图表 CPU HEAP/JS HEAP/Performance monitor(实时)

/**
 * 内存泄漏分析
 * Snapshot 增量对比
 * TimeLine 时间线
 * Sampling 调用的函数
 * 共享闭包/内部函数引用外部变量，无法释放
 */

// demo
var t1 = null;
var replaceThing = function () {
  var o1 = t1;
  var unused = function () {
    if (o1) {
      console.log("hi");
    }
  };

  t1 = {
    longStr: new Array(100000).fill("*"),
    // 因为共享闭包，someMethod 存储o1（每次调用后，无法释放该作用域 2.png）
    someMethod() {},
  };
};
var timer = setInterval(replaceThing, 1000);
