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
