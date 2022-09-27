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

/**
 * 索引类型：索引签名类型，索引类型查询，索引类型访问
 */

// 索引签名类型
type Person = {
  name: string;
  age: number;
  [key: string]: any;
};

const p: Person = {
  name: "",
  age: 10,
};

// 索引类型查询： keyof
type P1 = keyof Person;
const p1: P1 = "name";

// 索引类型访问
interface Foo {
  p1: number;
  p2: string;
  p3: boolean;
}
type pTypeUnion = Foo[keyof Foo];

/**
 * 映射类型
 */
// T[k]：索引类型访问
// K in：类型映射
// keyof：索引类型查询
// [K in keyof T]的[]：索引签名类型
type Clone<T> = {
  [K in keyof T]: T[K];
};

interface T1 {
  name: string;
  age: number;
}

type T2 = Clone<T1>;
