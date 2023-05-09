// https://segmentfault.com/a/1190000017787537
// 创建型模式
/**
 * 工厂模式
 * jQuery/原生dom时代，实现UI功能时，用的比较多
 */

// 实现虚拟滚动
class VirtualScroll {
  constructor() {}
  bindEvents() {}
  render() {}
  //...
}

/**
 * 单例模式
 * 维护一个全局实例，比如jQuery/store/弹窗/购物车
 */
function getSingle(fn) {
  var result;
  return function () {
    return result || (result = fn.apply(this, arguments));
  };
}

/**
 * 原型模式
 * 用的较少，有时为了兼容性/功能性，重写原型方法
 */
// 劫持原生方法（获取准确的报错信息）（无侵入）
EventTarget.prototype.addEventListener = function (type, listener, options) {
  const wrappedListener = function (...args) {
    try {
      return listener.apply(this, args);
    } catch (err) {
      // 捕获具体错误
      throw err;
    }
  };
  return originAddEventListener.call(this, type, wrappedListener, options);
};

// 结构型模式
/**
 * 适配器模式
 * 可用于跨端应用，一套代码兼容不同平台的原生api
 * 虚拟dom的应用也类似，不区分平台
 */
// 小程序/在线h5/混合应用
class Weapp {}
class H5 {}
class HybridApp {}
// 按平台工具化/实例化

/**
 * 代理模式
 */
