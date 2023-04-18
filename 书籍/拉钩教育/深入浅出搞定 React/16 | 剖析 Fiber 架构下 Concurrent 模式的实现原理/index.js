// demo
function App() {
  const [state, setState] = useState(0);

  return (
    <div className="App">
      <div
        onClick={() => {
          setState(state + 1);
        }}
        className="container"
      >
        <p style={{ width: 128, textAlign: "center" }}>{state}</p>
      </div>
    </div>
  );
}

/**
 * 渲染后，第一次更新时，fiber树的变化
 */
function createWorkInProgress(current, pendingProps) {
  // 标记 workInProgress 节点（双树）
  var workInProgress = current.alternate;

  if (workInProgress === null) {
    // 创建新节点（App,div,p）
    workInProgress = createFiber(
      current.tag,
      pendingProps,
      current.key,
      current.mode
    );
    // ...
  } else {
    // 复用上一棵树的current节点(rootFiber)

    workInProgress.pendingProps = pendingProps; // Needed because Blocks store data on type.

    workInProgress.type = current.type; // We already have an alternate.
    // Reset the effect tag.

    workInProgress.flags = NoFlags; // The effect list is no longer valid.

    workInProgress.nextEffect = null;
    workInProgress.firstEffect = null;
    workInProgress.lastEffect = null;
  }

  workInProgress.childLanes = current.childLanes;
  workInProgress.lanes = current.lanes;
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;

  // ...

  return workInProgress;
}

// 第一次更新结束后，生成workInProgress Fiber 树，双树通过alternate链接

// 第二次更新：直接复用fiber节点（App,div,p）

/**
 * 更新链路
 * 1. 创建 update 对象，进行更新
 * 2. 函数调用
 *    onClick -> dispatchAction -> scheduleUpdateOnFiber ->        ensureRootIsScheduled -> scheduleCallback -> unstable_scheduleCallback -> performConcurrentWorkOnRoot(render阶段) -> commit阶段
 */

function dispatchAction(fiber, queue, action) {
  var eventTime = requestEventTime();
  var lane = requestUpdateLane(fiber);
  // 创建 update 对象
  var update = {
    lane: lane,
    action: action,
    eagerReducer: null,
    eagerState: null,
    next: null,
  }; // Append the update to the end of the list.

  // update对象 入队处理
  var pending = queue.pending;

  if (pending === null) {
    // This is the first update. Create a circular list.
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }

  queue.pending = update;
  // ...

  if (
    fiber === currentlyRenderingFiber$1 ||
    (alternate !== null && alternate === currentlyRenderingFiber$1)
  ) {
    // ...
  } else {
    // ...

    // 调度更新，进入 render阶段(类似 enqueueUpdate)
    scheduleUpdateOnFiber(fiber, lane, eventTime);
  }
}

// Concurrent 模式 核心特征：时间切片、优先级调度

function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

// 当前时间切片是否到期
function shouldYieldToHost() {
  // performance.now
  return exports.unstable_now() >= deadline;
}

var performWorkUntilDeadline = function () {
  if (scheduledHostCallback !== null) {
    // ...

    // currentTime 是当前时间，yieldInterval 是时间切片的长度
    deadline = currentTime + yieldInterval;

    var hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
    if (!hasMoreWork) {
      // ...
    } else {
      // 执行下一个 task
      port.postMessage(null);
    }
    // ...
  } else {
    // ...
  }
};

// 优先级调度实现
// scheduleUpdateOnFiber 中，ensureRootIsScheduled 调度不同优先级任务（scheduleCallback、scheduleSyncCallback），最后均调用 unstable_scheduleCallback

/**
 * timerQueue 待执行任务（小堆顶-优先队列）
 * taskQueue 已过期任务（小堆顶-优先队列）
 */
function unstable_scheduleCallback(priorityLevel, callback, options) {
  // 当前时间
  var currentTime = exports.unstable_now();
  // 开始时间
  var startTime;

  if (typeof options === "object" && options !== null) {
    // ...
  } else {
    startTime = currentTime;
  }

  // 过期时间间隔
  var timeout;

  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT;
      break;
    // ...
  }

  // 过期时间
  var expirationTime = startTime + timeout;
  // task 对象
  var newTask = {
    id: taskIdCounter++,
    callback: callback, // performSyncWorkOnRoot 或 performConcurrentWorkOnRoot，flushWork 的 workLoop 函数调用 callback
    priorityLevel: priorityLevel,
    startTime: startTime,
    expirationTime: expirationTime,
    sortIndex: -1,
  };

  if (startTime > currentTime) {
    // This is a delayed task.
    newTask.sortIndex = startTime;
    push(timerQueue, newTask);

    // peek获取堆顶元素
    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      // ...

      // 延时任务
      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    newTask.sortIndex = expirationTime;
    push(taskQueue, newTask);
    // wait until the next time we yield.

    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }

  return newTask;
}

// 延时调用（调用优先级）
requestHostTimeout = function (cb, ms) {
  _timeoutID = setTimeout(cb, ms);
};

// 执行 requestHostCallback
function handleTimeout(currentTime) {
  isHostTimeoutScheduled = false;
  advanceTimers(currentTime);

  if (!isHostCallbackScheduled) {
    if (peek(taskQueue) !== null) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    } else {
      var firstTimer = peek(timerQueue);

      if (firstTimer !== null) {
        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
      }
    }
  }
}

// 派发任务 flushWork
requestHostCallback = function (callback) {
  scheduledHostCallback = callback;

  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    port.postMessage(null);
  }
};

channel.port1.onmessage = performWorkUntilDeadline;

// 调用链：requestHostCallback -> performWorkUntilDeadline（异步调用） -> scheduledHostCallback(flushWork) -> workLoop -> task.callback -> performConcurrentWorkOnRoot
function flushWork(hasTimeRemaining, initialTime) {
  // ...
  try {
    if (enableProfiling) {
      try {
        return workLoop(hasTimeRemaining, initialTime);
      } catch (error) {
        // ...
      }
    } else {
      // No catch in prod code path.
      return workLoop(hasTimeRemaining, initialTime);
    }
  } finally {
    // 。。。
  }
}

// 逐一执行 taskQueue 中的任务
function workLoop(hasTimeRemaining, initialTime) {
  // ...
  currentTask = peek(taskQueue);

  while (currentTask !== null && !enableSchedulerDebugging) {
    // ...

    var callback = currentTask.callback;

    if (typeof callback === "function") {
      currentTask.callback = null;
      currentPriorityLevel = currentTask.priorityLevel;
      var didUserCallbackTimeout = currentTask.expirationTime <= currentTime;

      var continuationCallback = callback(didUserCallbackTimeout);
      currentTime = exports.unstable_now();

      if (typeof continuationCallback === "function") {
        currentTask.callback = continuationCallback;
      } else {
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
      }

      advanceTimers(currentTime);
    } else {
      pop(taskQueue);
    }

    currentTask = peek(taskQueue);
  } // Return whether there's additional work

  // ...
}
