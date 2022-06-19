/**
 * leetcode 102. 二叉树的层序遍历
 * 实现
 *    1. bfs + 队列
 *    2. 提前记录队列的分层节点个数并遍历（分层）
 */
var levelOrder = function (root) {
  const ret = [];
  if (!root) return ret;
  const queue = [root];
  while (queue.length) {
    const len = queue.length;
    const level = [];
    for (let i = 0; i < len; i++) {
      const cur = queue.shift();
      level.push(cur.val);
      cur.left && queue.push(cur.left);
      cur.right && queue.push(cur.right);
    }
    ret.push(level);
  }
  return ret;
};
