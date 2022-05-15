### hook 和 class 区别

- hook 更简洁
- hook 业务代码更聚合
- class 组件使用 render props 和 HOC 复用逻辑，hook 使用 hooks 复用逻辑

### hook 解决的问题

- 函数组件状态维护 useState
- 函数组件聚合多个生命周期 useEffect
- class 组件生命周期比较复杂
- class 组件逻辑难以复用（嵌套和扁平化，状态管理）
