// 类型层级

// 类型兼容性判断
type r = "xx" extends any ? true : false;

let a: any;
let b: unknown;
declare let c: string;
b = a; // Type 'a' is assignable to type 'b'
a = b; // Type 'any' is assignable to any type
b = c; // Type 'string' is assignable to type 'unkown'
c = b; // Type 'unknown' is not assignable to type 'string'

/**
 * 类型层级链
 *    never < 字面量类型 < 对应的原始类型（基础类型 - 拆箱类型）< 装箱类型 < Object 类型 < any/unknow
 *    联合类型判断是否是子集
 *    any 可以表示任何类型
 */
type VerboseTypeChain = never extends "linbudu"
  ? "linbudu" extends "linbudu" | "budulin"
    ? "linbudu" | "budulin" extends string
      ? string extends {} // extends {} 结构化类型系统：基类和派生类
        ? string extends String
          ? String extends {}
            ? {} extends object // {} extends 类型信息系统：字面量类型
              ? object extends {}
                ? {} extends Object
                  ? Object extends {}
                    ? object extends Object // 你中有我，我中有你
                      ? Object extends object // 你中有我，我中有你
                        ? Object extends any
                          ? Object extends unknown
                            ? any extends unknown
                              ? unknown extends any
                                ? 8
                                : 7
                              : 6
                            : 5
                          : 4
                        : 3
                      : 2
                    : 1
                  : 0
                : -1
              : -2
            : -3
          : -4
        : -5
      : -6
    : -7
  : -8;
