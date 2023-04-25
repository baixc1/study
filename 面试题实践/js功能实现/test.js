// https://juejin.cn/post/7117142442926686215#heading-42
// 2. 实现promise.all
function promiseAll(arr) {
  var res = [];
  let count = 0;
  return new Promise((resolve, reject) => {
    arr.forEach((p, index) => {
      p.then((r) => {
        count++;
        res[index] = r;
        if (arr.length === count) {
          resolve(res);
        }
      }).catch((e) => {
        reject(e);
      });
    });
  });
}

// var p1 = new Promise((r) => {
//   setTimeout(() => r(1), 1000);
// });
// var p2 = Promise.resolve(2);
// var p3 = Promise.reject(3);

// promiseAll([p1, p2]).then((res) => console.log(res));
// promiseAll([p1, p3]).catch((e) => console.log(e));

// 3. 实现new

var obj;
function myNew() {
  obj = new Object();
  // 构造函数
  const Constructor = [].shift.call(arguments);
  // 原型继承
  obj.__proto__ = Constructor.prototype;
  // 实例化构造函数
  const res = Constructor.apply(obj, arguments);
  // 构造函数是否有返回值
  return typeof res === "object" ? res : obj;
}

function Fun(a, b) {
  console.log(obj === this);
  this.a = a;
  this.b = b;
}
Fun.prototype = {
  getByKey(key) {
    return this[key];
  },
};
// var f = myNew(Fun, 1, 2);
// console.log(f);
// console.log(f.getByKey("a"));

// 4. 订阅发布
class Event {
  constructor() {
    this.listeners = {};
  }
  on(type, listener) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    // 事件注册
    this.listeners[type].push(listener);
  }
  emit(type, data) {
    const callbacks = this.listeners[type];
    if (callbacks) {
      // 事件发布，调用回调
      callbacks.forEach((cb) => {
        cb(data);
      });
    }
  }
}
const e = new Event();
// e.on("click", (d) => console.log(d));
// e.emit("click", { a: 1 });
