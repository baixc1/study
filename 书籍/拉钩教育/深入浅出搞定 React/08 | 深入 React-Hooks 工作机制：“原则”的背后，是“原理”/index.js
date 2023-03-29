/**
 * 以 useState 为例，分析 React-Hooks 的调用链路
 */

/**
 * 首次渲染
 *    1. useState
 *    2. 通过 resolveDispatcher 获取 dispatcher
 *    3. 调用 dispatcher.useState(HooksDispatcherOnMountInDEV)
 *    4. 调用 mountState
 *    5. 返回目标数组
 *  */

function useState(initialState) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}

var HooksDispatcherOnMountInDEV = {
  useState: function (initialState) {
    // 省略...
    try {
      return mountState(initialState);
    } 
  },
}

// mountState: 初始化 hook
function mountState(initialState) {
  // 生成当前 hook，并添加到链表尾部
  var hook = mountWorkInProgressHook();

  if (typeof initialState === "function") {
    // $FlowFixMe: Flow doesn't like mixed types
    initialState = initialState();
  }

  hook.memoizedState = hook.baseState = initialState;
  // 创建更新队列，保留 dispatch
  var queue = {
    pending: null,
    interleaved: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState,
  };
  hook.queue = queue;
  var dispatch = (queue.dispatch = dispatchSetState.bind(
    null,
    currentlyRenderingFiber$1,
    queue
  ));
  // 返回目标数组
  return [hook.memoizedState, dispatch];
}

// 生成正在过程中的 hook，并记录在链表尾部
function mountWorkInProgressHook() {
  var hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null
  };

  if (workInProgressHook === null) {
    // This is the first hook in the list
    currentlyRenderingFiber$1.memoizedState = workInProgressHook = hook;
  } else {
    // Append to the end of the list
    workInProgressHook = workInProgressHook.next = hook;
  }

  return workInProgressHook;
}

/**
 * 更新
 *    1. useState
 *    2. 通过 resolveDispatcher 获取 dispatcher
 *    3. 调用 dispatcher.useState(HooksDispatcherOnUpdateInDEV)
 *    4. 调用 updateState
 *    5. 调用 updateReducer
 *    5. 返回目标数组
 */
var HooksDispatcherOnUpdateInDEV = {
  useState: function (initialState) {
    // 省略...
    try {
      return updateState(initialState);
    } 
  },
}

function updateState(initialState) {
  return updateReducer(basicStateReducer);
}

// updateReducer: 按顺序去遍历之前构建好的链表，取出对应的数据信息进行渲染。
function updateReducer(reducer, initialArg, init) {
  var hook = updateWorkInProgressHook();
  var queue = hook.queue;

  //... 
  var current = currentHook; // The last rebase update that is NOT part of the base state.

  var baseQueue = current.baseQueue; // The last pending update that hasn't been processed yet.


  if (baseQueue !== null) {
    var newState = current.baseState;

    hook.memoizedState = newState;
  }

  // ...


  var dispatch = queue.dispatch;
  return [hook.memoizedState, dispatch];
}


// 查询/创建/更新当前 hook
function updateWorkInProgressHook() {
  // ...

  if (nextWorkInProgressHook !== null) {
    // There's already a work-in-progress. Reuse it.
    workInProgressHook = nextWorkInProgressHook;
    nextWorkInProgressHook = workInProgressHook.next;
    currentHook = nextCurrentHook;
  } else {
    // ...

    currentHook = nextCurrentHook;
    var newHook = {
      memoizedState: currentHook.memoizedState,
      baseState: currentHook.baseState,
      baseQueue: currentHook.baseQueue,
      queue: currentHook.queue,
      next: null
    };

    if (workInProgressHook === null) {
      // This is the first hook in the list.
      currentlyRenderingFiber$1.memoizedState = workInProgressHook = newHook;
    } else {
      // Append to the end of the list.
      workInProgressHook = workInProgressHook.next = newHook;
    }
  }

  // ...
  
  return workInProgressHook;
}

// 链表遍历过程：mountWorkInProgressHook/updateWorkInProgressHook
// 总结：hooks 的渲染是通过“依次遍历”来定位每个 hooks 内容的。如果前后两次读到的链表在顺序上出现差异，那么渲染的结果自然是不可控的