// 实现 对象的 Map 函数，类似 Array.prototype.map

// 方案一：JSON.stringify 的 第二个参数 replacer（对每个值执行一次函数）
Object.prototype.map = function (fn) {
  if (typeof fn !== "function") {
    throw new Error(`${fn} is not a function`);
  }
  return JSON.parse(
    JSON.stringify(this, (key, val) => {
      // console.log("key is: ", key);
      if (key) {
        return fn.call(this, key, val);
      } else {
        return val; // 对象本身
      }
    })
  );
};

var obj = { a: 1, b: 2 };
// var obj1 = obj.map((key, value) => {
//   return value * 2;
// });

// console.log(obj1);

// 方案二：循环
Object.prototype.map = function (fn) {
  if (typeof fn !== "function") {
    throw new Error(`${fn} is not a function`);
  }
  // console.log(Object.entries(this));
  var ret = {};
  for (let key in this) {
    if (this.hasOwnProperty(key)) {
      ret[key] = fn(key, this[key]);
    }
  }
  return ret;
};
var obj1 = obj.map((key, value) => {
  return value * 2;
});

console.log(obj1);
// obj.map();
