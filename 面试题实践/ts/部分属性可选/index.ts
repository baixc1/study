export type MarkPropsAsOptional<
  T extends object,
  K extends keyof T = keyof T // 泛型约束 + 默认值
> = Partial<Pick<T, K>> & Omit<T, K>;

interface User {
  id: number;
  name: string;
  age: number;
  gender: number;
  email: string;
}

// 格式化，便于观察
export type Flatten<T> = { [K in keyof T]: T[K] };

// 部分属性可选(先分组，可选部分A和非可选部分B, 然后PartialA, 然后组合A1 & B)
type NewUser = Flatten<MarkPropsAsOptional<User, "id" | "name" | "gender">>;

type A = Pick<User, "id" | "name" | "gender">;
type B = Omit<User, "id" | "name" | "gender">;

type A1 = Partial<A>;
type C = Flatten<A1 & B>;
