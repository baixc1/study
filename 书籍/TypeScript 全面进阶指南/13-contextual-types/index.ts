/**
 * 内置的上下文类型（Contextual Typing）
 */

// 基于位置的类型推导：反方向的类型推导
window.onerror = (event, source, line, col, err) => {};

interface OnErrorEventHandlerNonNull {
  (
    event: Event | string,
    source?: string,
    lineno?: number,
    colno?: number,
    error?: Error
  ): any;
}

// void 返回值：上下文类型对于 void 返回值类型的函数，并不会真的要求它啥都不能返回
type CustomHandler = (name: string, age: number) => void;

const handler1: CustomHandler = (name, age) => true;

const result1 = handler1("linbudu", 599);
