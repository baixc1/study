// https://juejin.cn/post/6844904126661263367
/**
 * Typescript 中 interface 和 class 的区别
 * 1. 接口只负责声明成员类型，不做具体实现
 * 2. 类既声明成员类型，并实现
 *    a. ts创建类的同时，也会创建同名的interface(只包含实例成员、原型成员)
 *    b. ts中的class，既可作为class，又可作为interface
 */

// 扩展es6类功能，新增类型说明功能
//类Person
class Person {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

//类充当接口使用,接口中只包含其中的实例属性和实例方法（constructor和static不在其中）
const person: Person = {
  name: "张三",
  age: 18,
};

//接口继承类
interface Person1 extends Person {
  sex: string;
  printName(): void;
}

const person1: Person1 = {
  name: "张三",
  age: 18,
  sex: "男",
  printName() {
    console.log(this.name);
  },
};

//类实现接口
class Person2 implements Person1 {
  name: string;
  age: number;
  sex: string;
  email: string;
  printName() {
    console.log(this.name);
  }
}
