- 时间复杂度 O(n)的 diff 算法前提

  - DOM 节点跨层级移动情况少
  - 不同类型的元素产生不同的树
    - 原生标签
    - 自定义组件标签
  - 通过 key 属性告诉哪些子元素不变

- diff 算法
  - tree diff / component diff / element diff
  - 不同类型的元素，直接卸载/销毁
  - 同一类型元素，仅更新变化的属性
  - 同一类型组件元素，更新时实例不变
    - 利于 state 的保留
  - 对子节点进行递归
- 节点操作
  - INSERT_MARKUP（插入）
  - MOVE_EXISTING（移动）
  - REMOVE_NODE（删除）
