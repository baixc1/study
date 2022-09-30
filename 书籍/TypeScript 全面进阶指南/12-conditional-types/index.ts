// 条件类型与infer

// TypeA extends TypeB ? Result1 : Result2;

// 类型提取
function _universalAdd<T extends number | bigint | string>(
  x: T,
  y: T
): LiteralToPrimitive<T> {
  return x + (y as any);
}

export type LiteralToPrimitive<T> = T extends number
  ? number
  : T extends bigint
  ? bigint
  : T extends string
  ? string
  : never;

_universalAdd("linbudu", "599"); // string
_universalAdd(599, 1); // number
_universalAdd(10n, 10n); // bigint

// 类型比较
type Func = (...args: any[]) => any;

// 第一个 extends 是泛型约束
// 第二个 extends 是条件类型判断
type FunctionConditionType<T extends Func> = T extends (
  ...args: any[]
) => string
  ? "A string return func!"
  : "A non-string return func!";

//  "A string return func!"
type StringResult = FunctionConditionType<() => string>;
// 'A non-string return func!';
type NonStringResult1 = FunctionConditionType<() => boolean>;
// 'A non-string return func!';
type NonStringResult2 = FunctionConditionType<() => number>;

// infer 关键字：提取类型
// 调换首尾两个
type SwapStartAndEnd<T extends any[]> = T extends [
  infer Start,
  ...infer Left,
  infer End
]
  ? [End, ...Left, Start]
  : T;

type SwapStartAndEnd1 = SwapStartAndEnd<[string, boolean, number]>;

// 递归
type __PromiseValue<T> = T extends Promise<infer V> ? __PromiseValue<V> : T;

/**
 * 分布式条件类型
 */
// 泛型参数(联合类型)且不被包裹, 裸类型参数
type Naked<T> = T extends boolean | string ? "Y" : "N";
type Wrapped<T> = [T] extends [boolean] ? "Y" : "N";

type Res31 = number | boolean extends boolean ? "Y" : "N";
// "N" | "Y"
type Res3 = Naked<number | boolean>;

// "N"
type Res4 = Wrapped<number | boolean>;

// never 判断
type IsNever<T> = [T] extends [never] ? true : false;
type IsNever1 = IsNever<any>;
type IsNever2 = IsNever<never>;

/**
 * any
 */

// 直接使用，返回联合类型
type Tmp1 = any extends string ? 1 : 2; // 1 | 2

type Tmp2<T> = T extends string ? 1 : 2;
// 通过泛型参数传入，同样返回联合类型
type Tmp2Res = Tmp2<any>; // 1 | 2

// 如果判断条件是 any，那么仍然会进行判断
type Special1 = any extends any ? 1 : 2; // 1
type Special2<T> = T extends any ? 1 : 2;
type Special2Res = Special2<any>; // 1

/**
 * never
 */
// 直接使用，仍然会进行判断
type Tmp3 = never extends string ? 1 : 2; // 1

type Tmp4<T> = T extends string ? 1 : 2;
// 通过泛型参数传入，会跳过判断
type Tmp4Res = Tmp4<never>; // never

// 如果判断条件是 never，还是仅在作为泛型参数时才跳过判断
type Special3 = never extends never ? 1 : 2; // 1
type Special4<T> = T extends never ? 1 : 2;
type Special4Res = Special4<never>; // never

// 计算交集
type Intersection<A, B> = A extends B ? A : never;

type IntersectionRes = Intersection<1 | 2 | 3, 2 | 3 | 4>; // 2 | 3

// any 判断：1 & any 消失的短板效应
type IsAny<T> = 0 extends 1 & T ? true : false;

// unkown 判断：过滤 never，缩小范围 any | unkown，排除 any
type IsUnknown<T> = IsNever<T> extends false
  ? T extends unknown
    ? unknown extends T
      ? IsAny<T> extends false
        ? true
        : false
      : false
    : false
  : false;

type IsUnknown1<T> = unknown extends T
  ? IsAny<T> extends true
    ? false
    : true
  : false;
