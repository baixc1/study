/**
 * leetcode 121. 买卖股票的最佳时机
 * 实现：求 0...i-1的最小值和i差的最大值
 */
var maxProfit = function (prices) {
  let max = 0;
  let min = Infinity; // 0...i之间最小值
  const len = prices.length;
  for (let i = 0; i < len; i++) {
    if (prices[i] < min) {
      min = prices[i];
    } else {
      max = Math.max(max, prices[i] - min);
    }
  }
  return max;
};
console.log(maxProfit([7, 1, 5, 3, 6, 4]));

/**
 * 动态规划思路：第 i 个元素的解，等于第 i-1 元素的解和i-min的最大值
 * 状态转移方程: f(n) = Max(f(n-1), prices[n] - min)
 * 根据第0个元素，推出第1,...n个元素的解（重复，父问题分解为子问题 - i-1,... 0）
 */
var maxProfit = function (prices) {
  const len = prices.length;
  if (len === 0) return 0;
  const ret = [0]; // 所有位置的解
  let minPrice = prices[0];
  for (let i = 1; i < len; i++) {
    minPrice = Math.min(minPrice, prices[i]);
    ret[i] = Math.max(ret[i - 1], prices[i] - minPrice);
  }
  return ret[len - 1];
};
