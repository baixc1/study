/**
 * leetcode 322. 零钱兑换
 * 给你一个整数数组 coins ，表示不同面额的硬币；以及一个整数 amount ，表示总金额。
计算并返回可以凑成总金额所需的 最少的硬币个数 。如果没有任何一种硬币组合能组成总金额，返回 -1 。你可以认为每种硬币的数量是无限的。
 */
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */

/**
 * coins[c1,c2...cn], amount-a
 * 状态转移方程：f(a) = Math.min(f(a-c1),f(a-c2),...f(a-cn))
 */
var coinChange = function (coins, amount) {
  const f = [];
  const res = dfs(amount);
  return res === Infinity ? -1 : res;

  function dfs(n) {
    if (n === 0) return 0;
    // 有缓存该解，直接返回
    if (f[n]) return f[n];
    // 递归式
    let cur = Infinity;
    for (let v of coins) {
      if (n - v >= 0) {
        // 求数组中最小解
        cur = Math.min(cur, dfs(n - v) + 1);
      }
    }
    // 缓存子解
    f[n] = cur;

    return cur;
  }
};
// console.log(coinChange([1, 2, 5], 11));

// 状态转移方程：依次求出1,2...amount的解
var coinChange = function (coins, amount) {
  // 保存所有解的数组
  const f = [0];
  // 依次求解1,2...,amount
  for (let i = 1; i <= amount; i++) {
    let cur = Infinity;
    for (let v of coins) {
      if (i - v >= 0) {
        // 状态转移方程
        cur = Math.min(cur, f[i - v] + 1);
      }
    }
    f[i] = cur;
  }
  return f[amount] === Infinity ? -1 : f[amount];
};
console.log(coinChange([1, 2, 5], 11));
