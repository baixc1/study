/**
 * 46. 全排列
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function (nums) {
  const len = nums.length;
  const res = []; // 所有结果
  let cur = []; // 一个结果（按照深度优先遍历顺序，先push，在pop。可以记录所有结果）
  const visited = {}; // 已访问节点
  dfs();
  return res;
  function dfs() {
    // 终止条件（排列了len个元素）
    if (cur.length === len) {
      res.push(cur.slice()); // 复制结果
      return;
    }
    // 递归逻辑
    for (let i = 0; i < len; i++) {
      if (!visited[nums[i]]) {
        visited[nums[i]] = 1; // 已读
        cur.push(nums[i]);
        dfs();
        cur.pop(); // 回退
        visited[nums[i]] = 0; // 重置
      }
    }
  }
};
console.log(permute([4, 1, 2, 3]));
