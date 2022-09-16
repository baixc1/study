/**
 * 函数类型声明
 */
function f(str: string): number {
  return str.length;
}

var f1 = function (str: string): number {
  return str.length;
};

type FunF = (xx: string) => number;
var f2: FunF = function (str) {
  return str.length;
};

// Callable Interface
interface FunF2 {
  (xx: string): number;
}
var f3: FunF2 = (x) => 1;
f3("");

// void
function f4(p: any): void {}

// 可选参数
function f5(name: string, age?: number) {}
function f6(name: string, age: number = 10) {}

// rest参数
function f7(a, ...rest: any[]) {}
function f8(a, ...rest: [number, number]) {}
f8("", 1, 2);

// 函数重载签名（Overload Signature） - 参数签名重载
function f9(a: number, b: true): string;
function f9(a: number, b?: false): boolean;
function f9(a: number, b?: any): string | boolean {
  if (b) {
    return String(a);
  } else {
    return !!a;
  }
}

// 异步函数类型签名
async function f10(): Promise<void> {}

// 类的类型签名：构造函数，原型属性，静态属性，访问符
class c1 {
  // 公有字段（实例属性）
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  print(name: string): void {
    console.log(name);
  }

  get info(): string {
    return this.name + this.age;
  }

  set sAge(v: number) {
    this.age = v;
  }
}

// class c1 {
//   // 公有字段（实例属性）
//   constructor(name, age) {
//     this.name = name;
//     this.age = age;
//   }

//   print(name) {
//     console.log(name);
//   }

//   get info() {
//     return this.name + this.age;
//   }

//   set sAge(v) {
//     this.age = v;
//   }

// }
