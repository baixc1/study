// DFS  递归（终止条件与递归函数）
const root = require("./data");
console.log(root);

function dfs(root) {
  // 终止条件
  if (!root) return;
  // 递归函数
  dfs(root.left);
  console.log(root.val); // 先序遍历 - 该逻辑位置决定先/中/后序
  dfs(root.right);
}
dfs(root);
console.log("---");

// BFS 队列（先进先出）
function bfs(root) {
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    console.log(node.val);
    // 树的子节点遍历
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
}
bfs(root);
