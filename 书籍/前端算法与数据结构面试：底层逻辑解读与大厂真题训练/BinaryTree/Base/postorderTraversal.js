/**
 * leetcode 145. 二叉树的后序遍历
 * 顺序：左右根
 * 实现
 *    1. 根结点入栈
 *    2. 取出栈顶元素，unshift该节点val
 *    3. 左子节点入栈，右子节点入栈（如果有子节点）
 *    4. 重复2，3
 */
var postorderTraversal = function (root) {
  const ret = [];
  if (!root) return ret;
  const stack = [root];
  while (stack.length) {
    const cur = stack.pop();
    ret.unshift(cur.val);
    cur.left && stack.push(cur.left);
    cur.right && stack.push(cur.right);
  }
  return ret;
};
var postorderTraversal = function (root) {
  const ret = [];
  dfs(root);
  return ret;
  function dfs(cur) {
    if (!cur) return;
    dfs(cur.left);
    dfs(cur.right);
    ret.push(cur.val);
  }
};
