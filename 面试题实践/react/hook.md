### hook 和 class 对比

- hook 没有生命周期，可以模仿 componentDidMount, componentDidUpdate, componentWillUnmount
- hook 可以抽离业务逻辑代码
- hook 状态不同步，容易产生闭包（使用 useRef 解决）
- hook 不能在条件语句中（依赖顺序结构（链表）取值对比，每次的位置必须一样）
