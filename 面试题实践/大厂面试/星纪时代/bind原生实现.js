// 实现apply
Function.prototype.apply1 = function (context) {
  // 可使用唯一随机数
  const fn = Symbol();
  context[fn] = this;
  let ret = eval("context[fn](" + (arguments[1] || []).toString() + ")");
  delete context[fn];
  return ret;
};

Function.prototype.call1 = function (context) {
  return this.apply1(context, [].slice.apply1(arguments, [1]));
};

// apply1实现bind
Function.prototype.bind =
  // Function.prototype.bind ||
  function (context) {
    var _this = this;
    // 预设参数 ...rest
    var args = [].slice.apply1(arguments, [1]);
    // 构造函数情况（this被忽略）
    var F = function () {};
    F.prototype = this.prototype;
    var bound = function () {
      return _this.apply1(
        this instanceof F ? this : context || window,
        args.concat([].slice.apply1(arguments))
      );
    };
    // 继承
    bound.prototype = new F();
    return bound;
  };

const fun = function (...rest) {
  console.log(this, rest);
};
const o = { a: 1 };
// fun.apply1(o, [1, 2, 3]);
// fun.apply1(o);
// const fun1 = fun.bind(o, 2, 3);
// fun1(4);
fun.call1(o, 1, 2, 3);

console.log(o);
