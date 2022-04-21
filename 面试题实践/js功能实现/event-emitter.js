/**
 * 实现事件流类（观察者模式，发布-订阅模式）
 */
class EventEmitter {
  constructor() {
    this.listeners = {}; // 事件回调函数容器
    this.maxListener = 10; // 每个事件的最多回调函数个数
  }
  // 注册/绑定
  on(event, cb) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    const listener = this.listeners[event];
    if (listener.length >= this.maxListener) {
      console.warn(`超过限制${this.maxListener}`);
      return;
    }
    listener.push(cb);
  }
  // 触发/广播
  emit(event) {
    const args = Array.prototype.slice.call(arguments); // call 和apply区别
    args.shift();
    this.listeners[event] &&
      this.listeners[event].forEach((cb) => {
        cb.apply(null, args);
      });
  }
  // 注销回调函数
  removeListener(event, cb) {
    const arr = this.listeners[event] || [];
    const index = arr.indexOf(cb);
    if (index !== -1) {
      arr.splice(index, 1);
    }
  }
  // 只调用一次（cb重写-新增解绑功能，通过on和removeListener实现）
  once(event, cb) {
    const me = this;
    const fn = function () {
      cb.apply(null, [...arguments]);
      me.removeListener(event, cb);
    };
    this.on(event, fn);
  }
  //...
}
const eventTarget = new EventEmitter();
for (let i = 0; i < 2; i++) {
  eventTarget.on("click", function () {
    console.log([...arguments], i);
  });
}
eventTarget.once("click", function () {
  console.log([...arguments], "once");
});
eventTarget.emit("click", "1");
