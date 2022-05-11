/**
 * leetcode 450. 删除二叉搜索树中的节点
 * 实现：
 *    查找节点key，分以下情况
 *    不存在，直接返回
 *    存在且为叶子节点，直接删除
 *    存在且有左子树，移动左子树的最大节点到当前节点
 *    存在且有右子树，移动右子树的最小节点到当前节点
 * 核心：
 *    递归或遍历二叉树
 *    递归回溯过程中，执行一次（其他为透传）节点删除功能
 */
var deleteNode = function (root, key) {
  if (!root) return root;
  if (root.val === key) {
    if (!root.left && !root.right) {
      root = null;
    } else if (root.left) {
      const node = maxLeft(root.left);
      root.val = node.val; // 节点替换
      root.left = deleteNode(root.left, node.val); // 节点删除
    } else {
      const node = minRight(root.right);
      root.val = node.val;
      root.right = deleteNode(root.right, node.val);
    }
  } else if (root.val > key) {
    root.left = deleteNode(root.left, key);
  } else {
    root.right = deleteNode(root.right, key);
  }
  return root;
};

// 遍历（有问题）
var deleteNode1 = function (root, key) {
  let cur = root;
  let prev = null; // 当前节点的上一节点（用于删除当前节点）
  let flag; // 当前节点属于上一节点的左/右节点标志

  while (cur) {
    if (cur.val === key) {
      // 叶子节点
      if (!cur.left && !cur.right) {
        if (!prev) return null; // 只有一个节点等于key的情况
        prev[flag] = null;
      } else if (cur.left) {
        // 有左子节点，替换左子树的最大节点
        let sub = cur.left;
        let subPrev;
        while (sub.right) {
          subPrev = sub;
          sub = sub.right;
        }
        cur.val = sub.val;
        // 删除最大节点
        if (subPrev) {
          subPrev.right = null;
        } else {
          cur.left = cur.left.left || null;
        }
      } else {
        // 有右子节点，替换右子树的最小节点
        let sub = cur.right;
        let subPrev;
        while (sub.left) {
          subPrev = sub;
          sub = sub.left;
        }
        cur.val = sub.val;
        // 删除最小节点
        if (subPrev) {
          subPrev.left = null;
        } else {
          cur.right = cur.right.right || null;
        }
      }
      return root;
    } else if (cur.val > key) {
      prev = cur;
      cur = cur.left;
      flag = "left";
    } else {
      prev = cur;
      cur = cur.right;
      flag = "right";
    }
  }
  return root;
};

// 查找左子树最大节点
function maxLeft(root) {
  while (root.right) {
    root = root.right;
  }
  return root;
}

// 查找右子树最小节点
function minRight(root) {
  while (root.left) {
    root = root.left;
  }
  return root;
}
const { arrayToBST } = require("../common");
const root = arrayToBST([5, 3, 6, 2, 4, null, 7]);
// const root = arrayToBST([0]);
console.log(deleteNode1(root, 3));
