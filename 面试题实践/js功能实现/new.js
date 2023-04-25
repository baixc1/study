function myNew() {
  const obj = new Object();
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
  this.a = a;
  this.b = b;
}
Fun.prototype = {
  getByKey(key) {
    return this[key];
  },
};
var f = myNew(Fun, 1, 2);
console.log(f);
console.log(f.getByKey("a"));
