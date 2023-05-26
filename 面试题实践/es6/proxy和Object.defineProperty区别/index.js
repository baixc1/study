// https://juejin.cn/post/7140573063380205598

/**
 * defineProperty 和 Proxy 的区别
 * 1. 代理的粒度不同
 *    a. defineProperty 只能代理属性，Proxy 代理的是对象（浅比较）
 * 2. 是否破坏原对象
 *    a. defineProperty 在原对象上修改
 *    b. proxy 不会破坏原对象，可代理新增的属性
 * 3. 代理数组属性
 *    a. defineProperty 不适合监听数组属性(长度很大)
 *    b. defineProperty 设置了 configurable 为 false 的属性无法进行代理
 * 4. 代理范围
 *    a. defineProperty 只能代理属性的 get 和 set
 *    b. Proxy 可代理 delete、getPrototypeOf等
 * 5. 兼容性
 */

const obj = {
  b: {
    b: 1,
  },
};

const proxyObj = new Proxy(obj, {
  get(target, prop, receiver) {
    console.log(target === obj, prop, receiver === proxyObj);
    return obj[prop];
  },
});
Object.defineProperty(obj, "a", {
  // value: 1,
  get() {
    return 1;
  },
});

console.log(obj.a);
console.log(proxyObj.handsome);
// console.log(proxyObj.b.b);

// 代理数组 - 重写数组方法（如splice）
// 缺陷：无法代理修改数组元素（数组太大）
const originSplice = Array.prototype.splice;
Array.prototype.splice = function () {
  console.log("代理");
  return originSplice.call(this, ...arguments);
};
const arr = [1, 2, 3, 4, 5];
arr.splice(1, 2);

// length 无法枚举，不能代理
var a = [1, 2, 3];
// Uncaught TypeError: Cannot redefine property: length
// Object.defineProperty(a, "length", {
//   get() {
//     return 1;
//   },
//   configurable: true,
// });
// {value: 3, writable: true, enumerable: false, configurable: false}
Object.getOwnPropertyDescriptor(a, "length");

// 代理length
var a = [1, 2, 3];
const proxyArr = new Proxy(a, {
  get(target, prop, receiver) {
    console.log("proxy");
    return a[prop];
  },
});

console.log(proxyArr.length);

// 代理delete
var a = [1, 2, 3];
const proxyArr = new Proxy(a, {
  delete(target, prop, receiver) {
    console.log("proxy");
    delete a[prop];
  },
});

delete proxyArr[0];
