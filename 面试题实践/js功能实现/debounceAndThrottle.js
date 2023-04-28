// 防抖：在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
// 高阶函数(闭包) + 延时执行 + 重新计时, 适用于input输入调用接口情况
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 截流：规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。
// 高阶函数（闭包） + 立即执行 + 防双击，适用于页面滚动事件触发页面变更的情况
function throttle(fn, delay) {
  let flag = false;
  return function (...args) {
    if (flag) return;
    flag = true;
    setTimeout(() => {
      fn.apply(this, args);
      flag = flag;
    }, delay);
  };
}
