// 柯里化：获取部分应用函数

// 实现：高阶函数 + 递归 + fun.length
function curry(fun) {
  return function curried(...args) {
    if (args.length >= fun.length) {
      return fun.apply(this, args);
    } else {
      // 递归
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

function fun(a, b, c, d) {
  return a * b * c * d;
}

const f = curry(fun);
console.log(f(1, 2)(3, 4));
