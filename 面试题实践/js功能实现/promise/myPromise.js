// Promise类实现: 观察者模式 + 递归 + 异常数据兼容

// promise三种状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

// Promise类
class Promise {
  constructor(executor) {
    const _this = this;
    this.state = PENDING; // 状态
    this.value = undefined; // 成功结果
    this.reason = undefined; // 失败原因
    // 发布-订阅模式，管理then的回调函数
    // 观察者模式应用（事件）：redux,babel ast 回调,webpack打包事件，promise，vue渲染。。。
    this.onFulfilled = []; // 成功回调函数容器
    this.onRejected = [];

    try {
      executor(resolve, reject); // 执行回调函数
    } catch (e) {
      reject(e);
    }

    // 状态只能改变一次
    function resolve(value) {
      if (_this.state === PENDING) {
        _this.state = FULFILLED;
        _this.value = value;
        // 广播事件
        _this.onFulfilled.forEach((fn) => fn(value));
      }
    } // resolve函数
    function reject(reason) {
      if (_this.state === PENDING) {
        _this.state = REJECTED;
        _this.reason = reason;
        _this.onRejected.forEach((fn) => fn(reason));
      }
    }
  }
  // then方法
  then(onFulfilled, onRejected) {
    const _this = this;
    // 判断 onFulfilled 和 onRejected 类型，如果不是函数则继续往下传
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };
    // 返回新的Promise实例（链式调用）
    let promise2 = new Promise((resolve, reject) => {
      // 执行回调函数（非pending状态）
      if (_this.state === FULFILLED) {
        // then 的回调函数，异步执行
        executorThenCb(() => {
          let x = onFulfilled(_this.value);
          // 处理 onFulfilled 函数的返回值，链式调用
          resolvePromise(promise2, x, resolve, reject);
        });
      }
      if (_this.state === REJECTED) {
        executorThenCb(() => {
          let x = onRejected(_this.reason);
          resolvePromise(promise2, x, resolve, reject);
        });
      }
      // 注册回调函数（pending状态）
      if (this.state === PENDING) {
        _this.onFulfilled.push(() => {
          executorThenCb(() => {
            let x = onFulfilled(_this.value);
            resolvePromise(promise2, x, resolve, reject);
          });
        });
        _this.onRejected.push(() => {
          executorThenCb(() => {
            let x = onRejected(_this.reason);
            resolvePromise(promise2, x, resolve, reject);
          });
        });
      }
    });
    return promise2;

    // then 的回调函数异步执行
    function executorThenCb(fn) {
      setTimeout(() => {
        try {
          fn();
        } catch (e) {
          reject(e);
        }
      });
    }
    // 核心：promise解决过程 - x为promise实例时，递归调用，直至非promise，然后resolve/reject
    // promise2: 异常判断（无大用）
    // x: 当前then的返回值
    // promise2 的 resolve/reject
    function resolvePromise(promise2, x, resolve, reject) {
      // x 和 promise2 相等，死循环报错
      if (promise2 === x) {
        reject(new TypeError("Chaining cycle"));
      }
      // 已调用逻辑省略（状态锁定）
      // 判断 x 是否有then方法(是否是promise)
      if (x && typeof x.then === "function") {
        try {
          x.then((y) => {
            // 返回嵌套的 Promise
            resolvePromise(promise2, y, resolve, reject);
          }, reject);
        } catch (e) {
          reject(e);
        }
      } else {
        resolve(x);
      }
    }
  }
}

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  });
});
p1.then(
  (v) =>
    new Promise((r) => {
      setTimeout(() => {
        r(
          new Promise((r1) => {
            setTimeout(() => {
              r1(4);
            }, 1000);
          })
        );
      }, 1000);
    })
)
  .then()
  .then((v) => {
    console.log(v);
    return new Promise((r) => r(v + 1));
  })
  .then((v) => console.log(v));
p1.then((v) => console.log(v));
console.log("end");
