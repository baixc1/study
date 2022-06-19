/**
 * 90. 子集 II
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsetsWithDup = function (nums) {
  // 初始化变量
  const len = nums.length;
  const ret = []; // 所有结果
  const sub = []; // 一次结果
  const dict = {};
  nums.sort((a, b) => a - b);
  dfs(0);
  // 递归函数
  function dfs(index) {
    const key = sub.join();
    if (!dict[key]) {
      ret.push(sub.slice());
      dict[key] = 1;
    }

    for (let i = index; i < len; i++) {
      sub.push(nums[i]);
      dfs(i + 1);
      sub.pop();
    }
  }
  return ret;
};
console.log(subsetsWithDup([4, 4, 4, 1, 4]));
