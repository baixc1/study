/**
 * 字面量类型
 *    字符串字面量类型、数字字面量类型、布尔字面量类型和对象字面量类型
 * 联合类型
 *    可用集合
 */
interface Tmp {
  bool: true | false;
  num: 1 | 2 | 3;
  str: "lin" | "bu" | "du";
  obj:
    | {
        flag: true;
        xx: string;
      }
    | {
        flag: false;
        xxx: string;
      };
}

declare var res: Tmp;
if (res.obj.flag) {
  console.log(res.obj.xx);
}

/**
 * 对象字面量类型
 */

/**
 * 数字枚举和字符串枚举
 */
enum some {
  t3,
  type1 = "1",
  type2 = "2",
}

// var some;

// (function (some) {
//   some[(some["t3"] = 0)] = "t3";
//   some["type1"] = "1";
//   some["type2"] = "2";
// })(some || (some = {}));

enum e {
  t1,
  t2,
}

const returnNum = () => 100 + 499;

enum Items {
  Foo = returnNum(),
  Bar = 599,
  Baz,
  t3,
}

enum Mixed {
  Str = "linbudu",
  Num = 599,
}
// var Mixed;

// (function (Mixed) {
//   Mixed["Str"] = "linbudu";
//   Mixed[Mixed["Num"] = 599] = "Num";
// })(Mixed || (Mixed = {}));

/**
 * 常量枚举
 */
const enum Items2 {
  Foo,
  Bar,
  Baz,
}

//  var Items2;

// (function (Items2) {
//   Items2[Items2["Foo"] = 0] = "Foo";
//   Items2[Items2["Bar"] = 1] = "Bar";
//   Items2[Items2["Baz"] = 2] = "Baz";
// })(Items2 || (Items2 = {}));

/**
 * 类型控制流分析中的字面量类型
 */

const obj = {
  a: 1,
  arr: [],
  obj: {
    a: 2,
  },
};

obj.d = 1;
