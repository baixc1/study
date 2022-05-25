- 结论

  - concurrent 模式下为异步更新（批量）
  - 同步模式下
    - 使用 batchUpdates 为异步更新，在 react 事件函数或生命周期函数中
    - 原生事件回调函数或异步方法（定时器等）中

- 原理
  - 执行上下文 executionContext 和 BatchedContext 相等时，批量更新
  - executionContext 等于 NoContext 同步更新
  - 异步方法中，setState 调用时，executionContext 已经被重置为 NoContext（如下）
  - 原生事件中，没有设置 executionContext = BatchedContext

```javascript
let executionContext = NoContext; // 默认值
export function batchedUpdates(fn) {
  let preExecutionContext = executionContext;
  executionContext |= BatchedContext;
  fn();
  executionContext = preExecutionContext;
}
```
