/**
 * leetcode 701. 二叉搜索树中的插入操作
 */
// 递归式：f(n) = f(n.left) || f(n.right)
var insertIntoBST = function (root, val) {
  if (!root) return new TreeNode(val);
  dfs(root, val);
  return root;
  function dfs(root, val) {
    if (root.val > val) {
      if (!root.left) {
        root.left = new TreeNode(val);
        return;
      }
      dfs(root.left, val);
    } else {
      if (!root.right) {
        root.right = new TreeNode(val);
        return;
      }
      dfs(root.right, val);
    }
  }
};
// 简化（一直递归，到递归边界时新增元素，然后回溯å）
var insertIntoBST = function (root, val) {
  if (!root) {
    return new TreeNode(val);
  }
  if (root.val > val) {
    root.left = insertIntoBST(root.left, val);
  } else {
    root.right = insertIntoBST(root.right, val);
  }
  return root;
};
// 遍历
var insertIntoBST = function (root, val) {
  let cur = root;
  while (cur) {
    if (cur.val > val) {
      if (!cur.left) {
        cur.left = new TreeNode(val);
        return root;
      }
      cur = cur.left;
    } else {
      if (!cur.right) {
        cur.right = new TreeNode(val);
        return root;
      }
      cur = cur.right;
    }
  }
  return new TreeNode(val);
};
