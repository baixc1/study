function add(a, b, c) {
  return a + b + c;
}
const curryFn = curry(add);

function curry(fn, currArgs) {
  // 返回函数
  return function () {
    let args = Array.prototype.slice.call(arguments);
    // 拼接之前的参数
    if (currArgs) {
      args = [...currArgs, ...args];
    }
    console.log(args);
    // 递归式
    if (args.length < fn.length) {
      return curry(fn, args);
    }

    // 终止条件
    return fn.apply(null, args);
  };
}

console.log(curryFn(1, 2, 3)); // 6
console.log(curryFn(1)(2, 3)); // 6
console.log(curryFn(1)(2)(3)); // 6
