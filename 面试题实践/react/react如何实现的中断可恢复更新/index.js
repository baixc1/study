// https://juejin.cn/post/6984949525928476703#heading-0

/**
 * React Fiber 是如何实现更新过程可控？
 * 1. 任务拆分
 * 2. 任务挂起、恢复、终止
 * 3. 任务具备优先级
 */

/**
 * 任务拆分
 * 1. fiber 任务单元/节点
 */

/**
 * 任务挂起、恢复、终止
 * 1. workInProgress tree， 副作用链
 * 2. currentFiber tree， alternate
 * 3. 浏览器帧的 空闲时间，当前任务节点（链表节点）
 * 4. RequestIdleCallback， Polyfill
 * 5. 是否有优先级更高的执行任务 优先级任务队列（双任务队列）
 * 6. 副作用链表， firstEffect、lastEffect、nextEffect
 */

/**
 * Fiber 结构长什么样？
 * 1. return、child、sibling 链表属性
 * 2. stateNode 实例属性
 * 3. effectTag 更新操作（增删改） nextEffect firstEffect lastEffect
 * 4. expirationTime
 * 5. alternate
 */

/**
 * Concurrent Mode （并发模式）
 * 1. Scheduler Reconciler Renderer
 * 2. Scheduler 优先级调度，创建实体(初始化时构建fiberRoot,rootFiber-currentFiber），初始化和更新均构建/更新 workInProgress 根节点
 * 3. Reconciler 初始化和更新均构建/更新 workInProgress tree，beginWork/completeWork 深度优先遍历/收集副作用
 * 4. Renderer dom渲染
 */
