/**
 * 类型工具
 *    按使用划分：操作符、关键字、专用语法
 *    按目的划分：类型创建、类型保护
 */

/**
 * 类型创建：
 *    类型别名 type, 可作为工具类型
 *    交叉类型/联合类型 & ｜
 *    索引类型、映射类型
 */

// 工具类型：泛型坑位
type Factory<T> = T | number | string;

// 交叉类型：对象类型合并
interface A {
  a: string;
}
interface B {
  b: string;
}

type C = A & B;
var c: C = { a: "1", b: "2" };
var c1: A["a"] = "1";

// 交叉类型：原始类型
type D = string & number;
