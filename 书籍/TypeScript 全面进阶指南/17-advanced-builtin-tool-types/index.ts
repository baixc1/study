/**
 * 属性修饰工具
 */

/**
 * 递归属性修饰
 */
export type DeepPartial<T extends object> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

// 可以把 ? 转化为 -?
export type DeepRequired<T extends object> = {
  [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};

export type DeepReadonly<T extends object> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

export type DeepMutable<T extends object> = {
  -readonly [K in keyof T]: T[K] extends object ? DeepMutable<T[K]> : T[K];
};

// 去除联合类型中的某项
type NoneSomeable<T, K> = T extends K ? never : T;
type NoneNullable = NoneSomeable<string | null, null>;

export type DeepNonNullable<T extends object> = {
  [K in keyof T]: T[K] extends object
    ? DeepNonNullable<T[K]>
    : NonNullable<T[K]>;
};

/**
 * 基于已知属性进行部分修饰
 *    结构工具类型 Pick  Omit
 *    递归属性修饰
 *    交叉类型
 */
export type MarkPropsAsOptional<
  T extends object,
  K extends keyof T = keyof T // 泛型约束 + 默认值
> = Partial<Pick<T, K>> & Omit<T, K>;

type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type Exclude<T, U> = T extends U ? never : T;

type Omit<T, K extends string | number | symbol> = {
  [P in Exclude<keyof T, K>]: T[P];
};
type Partial<T> = { [P in keyof T]?: T[P] | undefined };

export type Flatten<T> = { [K in keyof T]: T[K] };

type A = {
  foo: string;
  bar: number;
  baz: boolean;
};

type C = Flatten<keyof A>;
type B = Exclude<keyof A, "bar">;

// 拆分-处理-组合

// 基于键值类型去裁剪结构

/**
 * 结构工具类型进阶
 */

/** 获取类型中的函数类型属性名 */
type FuncStruct = (...args: any[]) => any;

// 返回值为联合类型
type FunctionKeys<T extends object> = {
  [K in keyof T]: T[K] extends FuncStruct ? K : never;
}[keyof T];

type Res = FunctionKeys<{
  foo: () => void;
  bar: () => number;
  baz: number;
}>;

// 抽象 FuncStruct
type ExpectedPropKeys<T extends object, ValueType> = {
  [Key in keyof T]-?: T[Key] extends ValueType ? Key : never;
}[keyof T];

type FunctionKeys2<T extends object> = ExpectedPropKeys<T, FuncStruct>;

// demo - pick 子结构
export type PickByValueType<T extends object, ValueType> = Pick<
  T,
  ExpectedPropKeys<T, ValueType>
>;

type E = ExpectedPropKeys<{ foo: string; bar: number; str: string }, string>;
type P = PickByValueType<{ foo: string; bar: number; str: string }, string>;

// 类型是否全等
type StrictConditional<A, B, Resolved, Rejected, Fallback = never> = [
  A
] extends [B]
  ? [B] extends [A]
    ? Resolved
    : Rejected
  : Fallback;

type Res1 = StrictConditional<1 | 2, 1 | 2 | 3, true, false>; // false
type Res2 = StrictConditional<1 | 2 | 3, 1 | 2, true, false, false>; // false
type Res3 = StrictConditional<1 | 2, 1 | 2, true, false>; // true

// pick/omit 等封装
export type StrictValueTypeFilter<
  T extends object,
  ValueType,
  Positive extends boolean = true
> = {
  [Key in keyof T]-?: StrictConditional<
    ValueType,
    T[Key],
    // 为了避免嵌套太多工具类型，这里就不使用 Conditional 了
    Positive extends true ? Key : never,
    Positive extends true ? never : Key,
    Positive extends true ? never : Key
  >;
}[keyof T];

/** 互斥工具类型 */
interface VIP {
  vipExpires: number;
}

interface CommonUser {
  promotionUsed: boolean;
}

// Exclude<A, B> ，获取 A 排除 B 后的属性
type E1 = Exclude<keyof VIP, keyof CommonUser>;

// T 中特有的属性，标记为 never
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

type W1 = Without<VIP, CommonUser>;

// vipExpires 为 undefined（利用 never 特性）
type W = Flatten<Without<VIP, CommonUser> & CommonUser>;

export type XOR<T, U> = (Without<T, U> & U) | (Without<U, T> & T);

type XORUser = XOR<VIP, CommonUser>;

// 属性互斥
const a: XORUser = {
  promotionUsed: false,
  // vipExpires: 0,
};

// 多重互斥
interface Visitor {
  refererType: boolean;
}
type XORUser1 = XOR<VIP, XOR<CommonUser, Visitor>>;

/**
 * 集合工具类型进阶
 */
