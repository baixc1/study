"use strict";
/**
 * 尾递归优化：es6内存优化机制，让js引擎在满足条件时可以重用栈帧
 * 条件：该栈针弹出无影响（直接return 一个函数的调用，无闭包）
 * 核心：只保留内层函数的调用记录
 */
// 求和函数，空间复杂度 O(n)
function factorial(n) {
  if (n === 1) return 1;
  return n + factorial(n - 1);
}

// 实现：改写递归函数，最后一步只调用自身。把内部变量改为函数参数
// 求和函数(尾递归优化)，空间复杂度 O(1)
// sarifi浏览器有效，chrome爆栈
function factorial1(n, total = 1) {
  if (n === 1) return total;
  return factorial1(n - 1, n + total);
}

function factorial2(n, total) {
  if (n === 1) return total;
  return factorial1(n - 1, n + total);
}
// 简单柯里化函数
function currying(fn, n) {
  return function (m) {
    return fn.call(this, m, n);
  };
}

const fc = currying(factorial2, 1);
console.log(fc(50000)); // safari有效
console.log(factorial1(50000)); // safari有效

console.log(factorial(50000)); // 爆栈
