### componentWillMount

- 只有调用 componentDidMount 后，React 才能保证稍后调用 componentWillUnmount 进行清理
  - 可能导致内存泄漏（使用 componentWillMount 和 componentWillUnmount）
  - 订阅，订阅回调函数
- 初始化 state 放到构造函数中

### componentWillUpdate，componentWillReceiveProps

- componentWillUpdate 可能在一次更新中，被调用多次（componentWillReceiveProps 也一样）
  - 可能执行副作用
  - 解决方案：使用纯函数
- componentDidUpdate 每次更新只会调用一次
- 使用 getDerivedStateFromProps 替代 componentWillReceiveProps
  - 和 componentDidUpdate 搭配使用
  - 返回一个对象更新 state
  - static
- 使用 getSnapshotBeforeUpdate 替代 componentWillUpdate
  - 保留滚动位置
  - getSnapshotBeforeUpdate 的返回值作为第三个参数传给 componentDidUpdate
