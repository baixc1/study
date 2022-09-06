// 1. 数组的类型标注

const a1: string[] = ["11"];
const a2: Array<string> = ["22"];

// 元组
const t: [string, boolean, number] = ["1", !!2, 3];
t[4]; // 元组越界

// 具名元组
const t1: [name: string, age: number] = ["xx", 20];
const [a, b, c] = t1; // 隐式越界警告

// 2. 对象的类型标注
interface Iprops {
  name: string;
  age: number;
  male?: boolean; // Optional
  readonly func?: Function; // Readonly
}
const p1: Iprops = { name: "xx", age: 20, func() {} };
p1.name = "xxx";
p1.func = () => {};
const a3: readonly number[] = [1, 2];
a3.slice(1, 2);
a3.push(1); // ReadonlyArray

// 3. type 与 interface, object、Object 以及 { }
const t3: Object = 1; // Object 包含所有类型
// 装箱类型（Boxed Types） String Number Boolean Symbol
// 不应使用装箱类型
const t31: String = undefined || null || "" || (void 0 && 2);
// object 非原始类型的对象类型
const t32: object =
  ({ a: 1 } && undefined) ||
  null ||
  ([1, 2] &&
    (() => {
      console.log(1);
    }));
const t33: object = { x3: 2 };
t33.x3 = 1;
