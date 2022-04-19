### render 过程

- 步骤
  - setState 更新，向上回溯到 HostRoot
  - 从 HostRoot 深度优先遍历(beginWork)，存在变更则打 effectTag
  - 到底后，向上回溯，传递 effect list(completeUnitOfWork)
- 特点
  - 无副作用，纯 js 计算

### commit 过程

- 把 effect list 转化为 DOM 操作

### 核心问题

- 任务按时间片拆分（任务的暂停与继续）
  - render 阶段
  - while 循环
- 任务优先级
  - 调度中的饥饿问题（优先级提升）
  - 时间线
  - 高优先级任务后生成，先执行，再执行低优先级任务
- 对 render 阶段生命周期钩子的影响（多次调用）
