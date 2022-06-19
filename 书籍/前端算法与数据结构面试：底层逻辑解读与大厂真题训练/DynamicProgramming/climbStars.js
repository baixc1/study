/**
 * leetcode 70. 爬楼梯
 * 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
 * 特点：求解法个数，用动态规划
 * 动态转移方程（由顶到底）：走到第n个楼梯的解 f(n) = f(n-1) + f(n-2)
 */
/**
 * @param {number} n
 * @return {number}
 */
// 递归解法
// 记忆化搜索数组
const f = [];
var climbStairs = function (n) {
  // 递归边界
  if (n === 1) return 1;
  if (n === 2) return 2;
  // f[n] 不存在，在计算后缓存（递归式）
  if (!f[n]) f[n] = climbStairs(n - 1) + climbStairs(n - 2);
  return f[n];
};

/**
 * 动态规划解法
 * 自底向上，由已知推到未知（根据初始值和动态转移方程）
 * 实现：由 1 -> 2 -> 3 ... -> n 依次求解（后面的解以来前面的解）
 */
var climbStairs1 = function (n) {
  // 每个位置的解
  const f = [];
  f[1] = 1; // 可转化为两个变量求解（状态转移）
  f[2] = 2;
  for (let i = 3; i <= n; i++) {
    f[i] = f[i - 1] + f[i - 2];
  }
  return f[n];
};
console.log(climbStairs1(4));
