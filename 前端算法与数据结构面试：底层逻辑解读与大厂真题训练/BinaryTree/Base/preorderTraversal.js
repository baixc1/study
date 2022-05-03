/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * leetcode 144. 二叉树的前序遍历
 * @param {TreeNode} root
 * @return {number[]}
 */
/**
 * 顺序：根左右
 * 实现
 *    1. 根结点入栈
 *    2. 取出栈顶节点，push该节点的val
 *    3. 右子节点入栈，然后左子节点入栈（子节点存在）
 *    4. 重复2，3
 */
var preorderTraversal = function (root) {
  const ret = [];
  if (!root) return ret;
  const stack = [root];
  while (stack.length) {
    const cur = stack.pop();
    ret.push(cur.val);
    cur.right && stack.push(cur.right);
    cur.left && stack.push(cur.left);
  }
  return ret;
};
