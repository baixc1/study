/**
 * 类和构造函数的区别
 * 1. 严格模式
 * 2. 无变量提升
 * 3. 遍历实例，无法枚举原型属性（无需判断 hasOwnProperty）
 * 4. class的所有方法（原型/静态）无prototype（无[[construct]]），不能new
 * 5. class必须使用new调用
 * 6. 子类必须在constructor方法中调用super方法, 且this只有在调用super后才会有
 *    - es5继承，先创建子类实例this,然后调用父类构造函数
 *    - class继承，先调用父类构造函数生成子类_this,然后初始化子类
 * 7. super作为对象调用静态方法/原型方法
 *    - 原型方法中，this指向子类实例
 *    - 静态方法中，this指向子类
 * 8. 双继承
 *    - 类继承（静态属性）
 *    - 原型继承
 */

// ES5 和 ES6 子类 this 生成顺序不同
// es6继承逻辑
var ColorPoint = (function (_Point) {
  _inherits(ColorPoint, _Point);
  var _super = _createSuper(ColorPoint);
  function ColorPoint(x, y, color) {
    var _this;
    // 子类自己的this对象，必须先通过父类的构造函数完成塑造
    // 无super时，ColorPoint -> _possibleConstructorReturn -> _assertThisInitialized -> super未调用报错
    _this = _super.call(this, x, y); // super() 调用的逻辑（没有则会缺少_this）
    // 子类初始化
    _this.z = 1;
    return _this;
  }
  return _createClass(ColorPoint);
})(Point);

// 无super调用
var ColorPoint = /*#__PURE__*/ (function (_Point) {
  _inherits(ColorPoint, _Point);
  var _super = _createSuper(ColorPoint);
  function ColorPoint(x, y, color) {
    var _this;
    _classCallCheck(this, ColorPoint);
    // 无super(), 直接报错
    return _possibleConstructorReturn(_this);
  }
  return _createClass(ColorPoint);
})(Point);

// 原型继承+类属性继承
function _inherits(subClass, superClass) {
  // subClass.prototype.__proto__ === superClass.prototype（原型继承）
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true },
  });
  Object.defineProperty(subClass, "prototype", { writable: false });
  // subClass.__proto__ === superClass（静态属性继承）
  if (superClass) _setPrototypeOf(subClass, superClass);
}

// 实例化_super(父类构造函数)

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    // 根据__proto__ 获取父类
    var Super = _getPrototypeOf(Derived),
      result;
    // es6
    if (hasNativeReflectConstruct) {
      // 子类构造函数，new.target指向newTarget
      var NewTarget = _getPrototypeOf(this).constructor;
      // 类似 new target(...args)
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      // es5（使用子类this，调用父类构造函数）
      result = Super.apply(this, arguments);
    }
    // 返回result
    return _possibleConstructorReturn(this, result);
  };
}
