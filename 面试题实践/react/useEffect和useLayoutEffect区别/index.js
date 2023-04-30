/**
 * 调用链路
 * 1. commitRoot
 * 2. commitRootImpl
 * 3. commitBeforeMutationEffects
 * 3.1 commitMutationEffects
 * 3.2 commitLayoutEffects（调用useLayoutEffect回调）
 * 4. port.postMessage 发起异步任务
 * 5. flushPassiveEffectsImpl（调用useEffect回调）
 */

/**
 * commitRootImpl
 * 1. commit 阶段前置工作
 * 2. mutation阶段
 *    a. 调用commitBeforeMutationEffects，scheduleCallback调度执行flushPassiveEffects
 *    b. 调用commitMutationEffects，处理相关的副作用，操作真实节点useLayoutEffect的销毁函数在这个函数中执行
 *    c. 调用commitLayoutEffects，调用commitLayoutEffects的回调函数，这个时候副作用已经应用到真实节点了，所以能拿到最新的节点。
 *    d. 在commit阶段结束之后flushPassiveEffects执行useEffect的销毁函数和回调函数
 * 3. commit阶段收尾工作
 *
 * useEffect在commit阶段结尾异步调用，useLayout/componentDidMount同步调用
 */
