/**
 * 类型保护：类型查询操作符，类型守卫
 */

// 类型查询操作符 typeof
function f1(a: number) {
  return a + 1;
}

type F1 = typeof f1;

/**
 * 类型守卫
 */
// 类型推导
// is 关键字
function isString(input: unknown): input is string {
  return typeof input === "string";
}

function foo(input: string | number) {
  if (isString(input)) {
    input.replace("linbudu", "linbudu599");
  }
}

// in/instanceof 自带类型保护，可辨识属性/可辨识联合类型

// 类型断言守卫 asserts
