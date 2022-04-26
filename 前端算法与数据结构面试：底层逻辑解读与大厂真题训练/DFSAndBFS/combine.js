/**
 * 77. 组合
 * @param {number} n
 * @param {number} k
 * @return {number[][]}
 */
var combine = function (n, k) {
  // 1. 数组子集递归式
  // 2. 递归边界
  const ret = []; // 结果
  const sub = []; // 结果子集
  dfs(1);
  function dfs(index) {
    if (sub.length === k) {
      ret.push(sub.slice());
      return;
    }
    // 遍历1...n, 2...n, 3...n等等
    for (let i = index; i <= n; i++) {
      sub.push(i);
      dfs(i + 1);
      sub.pop();
    }
  }
  return ret;
};
