// 239. 滑动窗口最大值
// 实现：维护一个双端递减队列(可相等)，记录滑窗内最大值情况
var maxSlidingWindow = function (nums, k) {
  const len = nums.length;
  const queue = []; // 双端递减队列
  const res = [];
  // 遍历
  for (let i = 0; i < len; i++) {
    // 入栈新元素，非递减时，出栈（直至递减）
    while (queue.length && nums[queue[queue.length - 1]] < nums[i]) {
      queue.pop();
    }
    // 下标入栈（有效最大值）
    queue.push(i);
    // 判断队头是否超出滑窗（判断下标）
    if (queue.length && queue[0] + k === i) {
      queue.shift(); // 出队
    }
    // 完整窗口
    if (i >= k - 1) {
      res.push(nums[queue[0]]);
    }
  }
  return res;
};
maxSlidingWindow([7, 2, 4], 2);
