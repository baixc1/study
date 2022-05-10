/**
 * leetcode 700. 二叉搜索树中的搜索
 */
// 递归实现，递归式：f(n) = f(n.left) || f(n.right) || null， 根据val值判断
var searchBST = function (root, val) {
  if (!root) return null;
  if (root.val > val) {
    return searchBST(root.left, val);
  } else if (root.val < val) {
    return searchBST(root.right, val);
  } else {
    return root;
  }
};

// 遍历实现
var searchBST = function (root, val) {
  while (root) {
    if (root.val > val) {
      root = root.left;
    } else if (root.val < val) {
      root = root.right;
    } else {
      return root;
    }
  }
  return null;
};
