/**
 * 类型层级
 * 1. any unkown, 最顶层
 * 2. Object, 包含所有类型
 * 3. String/Boolean/Number, 装箱类型
 * 4. string/number/object, 原始类型与对象类型
 * 5. 1/'1'/{a: 1}, 字面量类型
 * 6. never, 最底层
 */

function justThrow(): never {
  throw new Error();
}

/**
 * null 与 undefined
 * 没有开启 strictNullChecks 检查的情况下，会被视作其他类型的子类型
 */

/**
 * {} 类型
 * 任何非 null / undefined 的值(关闭strictNullChecks后可代表any)
 * 无法对这个变量进行任何赋值操作
 */

/**
 * 类型断言
 *    as NewType
 *    尖括号断言 (<{ handler: () => {} }>(<unknown>str)).handler();
 * 双重断言：先断言到通用类
 * 非空断言：!
 */
