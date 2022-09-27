// 泛型

// 类型别名中的泛型
type _Partial<T> = {
  [P in keyof T]?: T[P];
};

// 条件类型、泛型约束
type IsEqual<T> = T extends true ? 1 : 2;

// 默认值
type Factory<T = boolean> = T | number | string;

// 多泛型关联
type Conditional<Type, Condition, TruthyResult, FalsyResult> =
  Type extends Condition ? TruthyResult : FalsyResult;

// 对象类型中的泛型
interface IRes<TData = unknown> {
  code: number;
  error?: string;
  data: TData;
}

// 函数中的泛型：类型的自动提取
function handle<T>(input: T): T {}

function swap<T extends number, U extends number>([start, end]: [T, U]): [
  U,
  T
] {
  return [end, start];
}

const _ = {
  pick<T extends object, U extends keyof T>(
    object: T,
    ...props: Array<U>
  ): Pick<T, U> {
    return object;
  },
};

function handle1<T>(payload: T): Promise<[T]> {
  return new Promise<[T]>((res, rej) => {
    res([payload]);
  });
}

// Class 中的泛型
class Queue<TElementType> {
  private _list: TElementType[];

  constructor(initial: TElementType[]) {
    this._list = initial;
  }

  // 入队一个队列泛型子类型的元素
  enqueue<TType extends TElementType>(ele: TType): TElementType[] {
    this._list.push(ele);
    return this._list;
  }
}

// 内置方法中的泛型
interface PromiseConstructor {
  resolve<T>(value: T | PromiseLike<T>): Promise<T>;
}

declare var Promise: PromiseConstructor;

const arr: Array<number> = [1, 2, 3];

const [state, setState] = useState<number[]>();
