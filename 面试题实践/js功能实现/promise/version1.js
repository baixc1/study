// https://juejin.cn/post/6860037916622913550#heading-0

// 三种状态
const PENDING = "PENDING"; // 进行中
const FULFILLED = "FULFILLED"; // 已成功
const REJECTED = "REJECTED"; // 已失败

/**
 * 实现
 * 1. 构造函数 + 实例属性 + 内部函数 + 原型属性 + 静态属性
 * 2. 状态相关逻辑完善（resolve, reject），初始化（异常处理）
 * 3. 实现 微任务 then/catch（使用setTimeout模拟）（exector同步执行）
 * 4. exector 异步（发布订阅模式，延时执行） + 链式调用 + 值传递
 * 4.1 链式调用：判断then/catch的返回值，是否是promise，且返回新的promise
 */
class Promise1 {
  constructor(exector) {
    // 状态
    this.status = PENDING;
    // 结果
    this.value = undefined;
    this.reason = undefined;

    // 异步任务（发布订阅模式）
    this.onFulfiledCallbacks = []; // 成功态回调函数队列
    this.onRejectedCallbacks = []; // 失败态回调函数队列

    const resolve = (value) => {
      // 修改状态和结果
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        // 发布订阅
        this.onFulfiledCallbacks.forEach((fn) => fn(value));
      }
    };
    const reject = (reason) => {
      // 修改状态和结果
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        // 发布订阅
        this.onRejectedCallbacks.forEach((fn) => fn(reason));
      }
    };

    // 立即执行exector（异常处理）
    try {
      exector(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  // 返回Promise，根据status执行不同逻辑
  /**
   * 实现
   * 0. 根据status值走不同逻辑（立即执行+异步执行）
   * 1. 返回promsie（链式调用）
   * 2. 参数类型处理（是否是函数类型）（值传透）
   * 3. 参数调用返回结果判断（是否是promise实例 - 是否需要等待（异步执行））
   * 4. 使用setTimeout模拟微任务
   */
  then(onFulfilled, onRejected) {
    // onFulfilled 类型处理
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw new Error(reason instanceof Error ? reason.message : reason);
          };

    // 返回Promise(链式调用then)
    return new Promise1((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            const res = onFulfilled(this.value);
            /**
             * 根据then回调函数执行的返回值
             * 1. 如果是promise实例，那么返回的下一个promise实例会 等待 这个promise状态发生变化
             * 2. 如果不是promise实例，根据目前情况直接执行resolve或reject
             */
            res instanceof Promise1 ? res.then(resolve, reject) : resolve(res);
          } catch (e) {
            reject(e);
          }
        });
      } else if (this.status === REJECTED) {
        // 核心逻辑（省略异常处理+定时器）
        const res = onRejected(this.reason);
        res instanceof Promise1 ? res.then(resolve, reject) : resolve(res);
      } else if (this.status === PENDING) {
        // 异步调用处理（事件订阅）
        // 核心逻辑（省略异常处理+定时器）
        this.onFulfiledCallbacks.push(() => {
          try {
            const res = onFulfilled(this.value);
            res instanceof Promise1 ? res.then(resolve, reject) : resolve(res);
          } catch (e) {
            reject(e);
          }
        });
        this.onRejectedCallbacks.push(() => {
          const res = onRejected(this.reason);
          res instanceof Promise1 ? res.then(resolve, reject) : resolve(res);
        });
      }
    });
  }
  catch(onRejected) {
    // then 的别名
    return this.then(null, onRejected);
  }
  static resolve() {}
  static reject() {}
  static all() {}
  static race() {}
}

// const promise = new Promise1((resolve, reject) => {
//   Math.random() < 0.5 ? resolve(1) : reject(-1);
// }).then(
//   (res) => console.log(res),
//   (err) => console.log(err)
// );

// const promise = new Promise1((resolve, reject) => {
//   setTimeout(() => resolve(1), 1000);
// }).then((res) => console.log(res));

let promsie = new Promise1((resolve, reject) => {
  resolve(1);
})
  .then(2)
  .then((value) => {
    return new Promise1((resolve, reject) => {
      setTimeout(() => {
        resolve(value + 1);
      }, 1000);
    });
  })
  .then((value) => {
    console.log(value);
    throw new Error(3);
  })
  .catch((e) => console.log(e));
