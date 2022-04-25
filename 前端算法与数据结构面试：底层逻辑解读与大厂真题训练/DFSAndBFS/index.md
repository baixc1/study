### 全排列问题

- permute.js
- 关键词：穷举，重复 => 递归函数 => DFS
- 递归函数：第一次在 n 个数中选一个（循环），第二次在 n-1 个数中选一个, ...在 1 个数中选一个（树形结构）（标记已使用元素）
- 终止条件：先序遍历，遍历到的元素加入 cur 数组，cur 长度等于原数组时终止。返回时 cur 弹出该元素，并标记为未使用。(场景回溯)

### 数组子集

- subsetsWithDup.js
- 递归函数+终止条件

```javascript
var subsetsWithDup = function (nums) {
  const len = nums.length;
  const ret = []; // 所有结果
  const sub = []; // 一次结果
  dfs(0);
  // 求数组子集的递归函数
  function dfs(index) {
    for (let i = index; i < len; i++) {
      dfs(i + 1);
    }
  }
  return ret;
};
```
