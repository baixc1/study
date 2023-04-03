### 单线程的 JavaScript 与多线程的浏览器

- JavaScript 线程和渲染线程必须是互斥的
- Stack Reconciler 问题：同步的递归过程，JavaScript 对主线程的超时占用问题

### Fiber

- 纤程
  - 意在对渲染过程实现更加精细的控制
- 定义

  - 架构层面：对核心算法（调和过程）的重写
  - 编码层面：新的数据结构，Fiber 树节点（虚拟 dom）
  - 工作流层面：对应一个工作单元，保存了该组件的状态和副作用

- 架构目的

  - 实现渐进渲染：把一个渲染任务分解为多个渲染任务，而后将其分散到多个帧里面
  - 核心：可中断、可恢复、优先级

- Scheduler 调度器

  - 每个 task 都会赋予一个优先级
  - 定时执行 task 调度，暂停低优先级任务(可中断)，执行高优先级任务，task 进入 Reconciler 层（循环）
  - 高优先级任务渲染后，开始新的调度，继续之前的低优先级 task（可恢复）

- Fiber 架构对生命周期的影响
  - render 阶段：纯净且没有副作用，可能会被 React 暂停、终止或重新启动
  - render 阶段的生命周期：componentWillMount、componentWillUpdate、shouldComponentUpdate、componentWillReceiveProps
