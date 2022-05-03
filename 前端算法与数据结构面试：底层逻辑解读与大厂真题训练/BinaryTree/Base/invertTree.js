/**
 * leetcode 226. 翻转二叉树
 * 实现：交换当前节点的左右节点，递归该过程
 */
var invertTree = function (root) {
  if (!root) return root;
  let left = invertTree(root.left); // 递归左子树，获取交换左右节点后的左子树
  let right = invertTree(root.right); // 递归右子树
  // 交换左右节点
  root.left = right;
  root.right = left;
  return root;
};
