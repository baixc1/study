/**
 * 解读 setState 工作流(react15)
 *    1. setState
 *    2. enqueueSetState
 *    3. enqueueUpdate
 *    4. isBatchingUpdates 判断
 *    5. batchedUpdates
 */

// 非定时器中调用setState
// dispatchEvent -> batchedUpdates(isBatchingUpdates置为true) -> perform（进入Trasaction-事务）-> enqueueUpdate，执行批处理逻辑（isBatchingUpdates为true）-> closeAll(Trasaction结束) -> flushBatchedUpdates -> RESET_BATCHED_UPDATES.close（isBatchingUpdates为false）

// 定时器中调用setState
// dispatchEvent -> batchedUpdates(isBatchingUpdates置为true) -> perform（进入Trasaction-事务）-> closeAll(Trasaction结束) -> flushBatchedUpdates -> RESET_BATCHED_UPDATES.close（isBatchingUpdates为false）-> enqueueUpdate，执行批处理逻辑（isBatchingUpdates为true）

// 结论：enqueueUpdate流程（setState相关逻辑）执行时间变化，不处于锁状态中

ReactComponent.prototype.setState = function (partialState, callback) {
  this.updater.enqueueSetState(this, partialState);
};


/**
 * Sets a subset of the state. This only exists because _pendingState is
 * internal. This provides a merging strategy that is not available to deep
 * properties which is confusing. TODO: Expose pendingState or don't use it
 * during the merge.
 */
enqueueSetState: function (publicInstance, partialState) {
  // 组件实例
  var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'setState');

  if (!internalInstance) {
    return;
  }

  // 组件实例的 pengding状态的 state 数组
  var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);
  queue.push(partialState);

  enqueueUpdate(internalInstance);
},


/**
 * Mark a component as needing a rerender, adding an optional callback to a
 * list of functions which will be executed once the rerender occurs.
 */
 function enqueueUpdate(component) {
  ensureInjected();

  // 如果不是批处理，则立即更新（ReactDefaultBatchingStrategy）
  if (!batchingStrategy.isBatchingUpdates) {
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }

  // 否则先把component塞入dirtyComponents队列等待
  dirtyComponents.push(component);
  if (component._updateBatchNumber == null) {
    component._updateBatchNumber = updateBatchNumber + 1;
  }
}

// 锁管理器（更新功能）
var ReactDefaultBatchingStrategy = {
  isBatchingUpdates: false, // 锁

  /**
   * Call the provided function in a context within which calls to `setState`
   * and friends are batched such that components aren't updated unnecessarily.
   */
  batchedUpdates: function (callback, a, b, c, d, e) {
    var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;

    ReactDefaultBatchingStrategy.isBatchingUpdates = true;

    // The code is written this way to avoid extra allocations
    if (alreadyBatchingUpdates) {
      return callback(a, b, c, d, e);
    } else {
      return transaction.perform(callback, null, a, b, c, d, e);
    }
  }
};


// Transaction（事务） 机制
/**
 * <pre>
 *                       wrappers (injected at creation time)
 *                                      +        +
 *                                      |        |
 *                    +-----------------|--------|--------------+
 *                    |                 v        |              |
 *                    |      +---------------+   |              |
 *                    |   +--|    wrapper1   |---|----+         |
 *                    |   |  +---------------+   v    |         |
 *                    |   |          +-------------+  |         |
 *                    |   |     +----|   wrapper2  |--------+   |
 *                    |   |     |    +-------------+  |     |   |
 *                    |   |     |                     |     |   |
 *                    |   v     v                     v     v   | wrapper
 *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
 * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
 * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | +---+ +---+   +---------+   +---+ +---+ |
 *                    |  initialize                    close    |
 *                    +-----------------------------------------+
 * </pre>
 */


// wrapper
var RESET_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: function () {
    ReactDefaultBatchingStrategy.isBatchingUpdates = false;
  }
};

var FLUSH_BATCHED_UPDATES = {
  initialize: emptyFunction,
  // 批处理
  close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates)
};

var TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];

// batchedUpdates 调用地方
// ReactMount.js
_renderNewRootComponent: function( nextElement, container, shouldReuseMarkup, context ) {
  // 实例化组件
  var componentInstance = instantiateReactComponent(nextElement);
  // 初始渲染直接调用 batchedUpdates 进行同步渲染
  ReactUpdates.batchedUpdates(
    batchedMountComponentIntoNode,
    componentInstance,
    container,
    shouldReuseMarkup,
    context
  );
}

// ReactEventListener.js
dispatchEvent: function (topLevelType, nativeEvent) {
  try {
    // 处理事件
    ReactUpdates.batchedUpdates(handleTopLevelImpl, bookKeeping);
  } finally {
    TopLevelCallbackBookKeeping.release(bookKeeping);
  }
}

// setState异步现象：isBatchingUpdates 这个变量，在 React 的生命周期函数以及合成事件执行前，已经被 React 悄悄修改为了 true，这时我们所做的 setState 操作自然不会立即生效。当函数执行完毕后，事务的 close 方法会再把 isBatchingUpdates 改为 false