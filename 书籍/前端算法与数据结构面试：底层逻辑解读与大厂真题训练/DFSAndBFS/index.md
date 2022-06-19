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
  // 求数组子集的递归函数(遍历0...len-1,1...len-1,2...len-1等等)
  function dfs(index) {
    for (let i = index; i < len; i++) {
      dfs(i + 1);
    }
  }
  return ret;
};
```

### 限定组合问题：及时回溯，即为“剪枝”

- combine.js
- 递归式类似上一个

### 总结

- dfs 算法时回溯思想的体现
- 递归回溯系列问题解决方案
  - 特征
    - 穷举一个或多个解
    - 可转化为树形逻辑模型求解
  - 依据
    - 递归与回溯的过程，就是穷举的过程
    - 只问个数，不问内容，一般用动态规划
  - 解题步骤
    - 一个模型：树形逻辑模型（坑位）
    - 两个重点：递归式和递归边界
- 模拟代码

```javascript
function xxx(入参) {
  前期的变量定义、缓存等准备工作

  // 定义路径栈
  const path = []

  // 进入 dfs
  dfs(起点)

  // 定义 dfs
  dfs(递归参数) {
    if(到达了递归边界) {
      结合题意处理边界逻辑，往往和 path 内容有关
      return
    }

    // 注意这里也可能不是 for，视题意决定
    for(遍历坑位的可选值) {
      path.push(当前选中值)
      处理坑位本身的相关逻辑
      path.pop()
    }
  }
}
```
