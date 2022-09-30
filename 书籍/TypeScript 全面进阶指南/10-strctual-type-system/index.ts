// 结构化类型系统: 鸭子类型（Duck Typing）

// 标称类型系统（Nominal Typing System）
// 类型的重要意义之一是限制了数据的可用操作与实际意义

export declare class TagProtector<T extends string> {
  protected __tag__: T;
}

// T & class
export type Nominal<T, U extends string> = T & TagProtector<U>;

export type CNY = Nominal<number, "CNY">;

export type USD = Nominal<number, "USD">;

const CNYCount = 100 as CNY;

const USDCount = 100 as USD;

function addCNY(source: CNY, input: CNY) {
  return (source + input) as CNY;
}

addCNY(CNYCount, CNYCount);

// 报错了！
addCNY(CNYCount, USDCount);
