- 实现

```javascript
// jsx虚拟dom树
var root = {
  name: "a1",
  children: [
    {
      name: "b1",
    },
    {
      name: "b2",
      children: [{ name: "c1", children: [{ name: "d1" }, { name: "d2" }] }],
    },
    { name: "b3", children: [{ name: "c2" }] },
  ],
};

/**
 * 生成fiber树
 *  树节点指针
 *    child
 *    sibling
 *    return
 */
function generateFiberTree(root) {
  const fiber = { name: root.name };
  dfs(root, fiber);
  return fiber;
  function dfs(root, parentFiber) {
    let children = root.children || [];
    let currentFiber = parentFiber; // 当前fiber
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      // 当前fiber数据
      let fiberData = { name: node.name, return: parentFiber };
      // 深度优先遍历（递归式）
      dfs(node, fiberData);
      // 父节点->第一个子节点->第二个子节点->...的串联
      if (i === 0) {
        currentFiber.child = fiberData;
      } else {
        currentFiber.sibling = fiberData;
      }
      currentFiber = fiberData; // 指针后移
    }
  }
}
// console.log(generateFiberTree(root));

// 遍历fiber
function walk() {
  let root = fiber;
  let node = fiber;
  while (true) {
    path.addPath(node.name);
    if (node.child) {
      node = node.child;
      continue;
    }
    if (node === root) {
      return;
    }
    while (!node.sibling) {
      if (!node.return || node.return === root) {
        path.addPath(`${root.name}(return)`);
        return;
      }
      node = node.return;
      path.addPath(`${node.name}(return)`);
    }
    node = node.sibling;
  }
}

class Path {
  constructor() {
    this.str = "";
  }
  addPath(path) {
    if (!this.str) {
      this.str = path;
    } else {
      this.str += ` -> ${path}`;
    }
  }
  printPath() {
    console.log(this.str);
  }
}

const path = new Path();

const fiber = generateFiberTree(root);
walk(fiber);
// 输出：a1 -> b1 -> b2 -> c1 -> d1 -> d2 -> c1(return) -> b2(return) -> b3 -> c2 -> b3(return) -> a1(return)
path.printPath();
```
