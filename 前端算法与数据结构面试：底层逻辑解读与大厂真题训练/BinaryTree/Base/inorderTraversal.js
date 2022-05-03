/**
 * leetcode 94. 二叉树的中序遍历
 * 顺序：左中右
 * 实现
 *    1. 指针cur等于root节点，空栈stack
 *    2. cur节点入栈（如果存在），cur等于cur.left。遍历该过程（入栈最左边节点及其祖先节点）
 *    3. 取出栈顶元素，计作cur。push 该节点val
 *    4. cur等于cur.right
 *    5. 重复2->4（如果有cur或stack）
 */
var inorderTraversal = function (root) {
  const ret = [];
  const stack = [];
  let cur = root;
  while (cur || stack.length) {
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop();
    ret.push(cur.val);
    cur = cur.right;
  }
  return ret;
};
