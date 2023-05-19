// https://juejin.cn/post/6844903749501059085
type Flatten<T> = { [K in keyof T]: T[K] };
/** 相同点 */

// 描述对象或函数
interface User {
  name: string;
  age: number;
}

interface SetUser {
  (name: string, age: number): void;
}

type User1 = {
  name: string;
  age: number;
};

type SetUser1 = (name: string, age: number) => void;

// 扩展
interface User2 extends User {
  sex: string;
}
type Use11 = Flatten<User1 & { sex: string }>;

interface Use21 extends User1 {
  sex: string;
}

type Use13 = Flatten<User & { sex: string }>;

/** 不同点 */

/** type 可以而 interface 不行 */

// 基本类型
type A = string;

// 联合类型
type B = string | number;

interface Cat {
  miao();
}

const cat1: Cat = { miao() {} };

// 元组
type C = [A, B];

const c1: C = ["", 1];

// 字面量
type CC = "100" | "200" | "300";
const cc: CC = "100";

// 获取实例类型
let p = 1;
type D = typeof p;
let p1: D = 1;

/** interface 可以而 type 不行 */
// 声明合并
interface User {
  job: string;
}
type E = Flatten<User>;
