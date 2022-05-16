### Scheduler 的行为（任务调度）

- 管理多个任务
- 控制单个任务的执行

### 核心

- 任务队列管理
  - 任务优先级
  - 任务队列
    - 未过期队列 timerQueue
      - 根据 startTime 排序
    - 过期队列 taskQueue
      - 根据 过期时间 expirationTime 排序
  - 任务是否过期
    - startTime 和 currentTime 比较
- 单个任务的执行
  - 单个任务的最大执行时间（一帧内）
  - 任务的中断与恢复
  - 调度者与执行者
    - 调度者调度一个执行者，执行者遍历 taskQueue
    - 超时后，执行者中断任务，并告诉调度者去调度一个新的执行者（绑定新函数）
    - 下一帧时，新的执行者继续任务，重复上面的步骤，直至该任务完成，出队

### 流程

- react 产生任务
  - performConcurrentWorkOnRoot
  - performSyncWorkOnRoot
- react 和 Scheduler 交流的集成器
  - SchedulerWithReactIntegration
  - scheduleCallback
  - scheduleSyncCallback
  - cancalCallback
- Scheduler
  - unstable_scheduleCallback
  - unstable_cancelCallback
  - timerQueue
  - taskQueue
  - 调度者：requestHostCallback 通过 MessageChannel 通知 performWorkUntilDeadline 调用执行者清空 taskQueue，执行任务
  - 执行者：flushWork 调用 workLoop 清空 taskQueue

### 调度入口 - unstable_scheduleCallback

- 任务形式

```javascript
function unstable_scheduleCallback(priorityLevel, callback, options) {
  // 创建调度任务
  var newTask = {
    id: taskIdCounter++,
    // 真正的任务函数，重点
    callback,
    // 任务优先级
    priorityLevel,
    // 任务开始的时间，表示任务何时才能执行
    startTime,
    // 任务的过期时间
    expirationTime,
    // 在小顶堆队列中排序的依据
    sortIndex: -1,
  };
  // 是否过期判断
  // 任务调度
  return newTask;
}
```

- 是否过期

```javascript
var currentTime = getCurrentTime();
// timeout 未不同优先级的过期时间间隔
var expirationTime = startTime + timeout;
if (startTime > currentTime) {
  newTask.sortIndex = startTime;
  push(timerQueue, newTask);
  // ...
} else {
  newTask.sortIndex = expirationTime;
  push(taskQueue, newTask);
  //...
}
```

- 任务调度

```javascript
if (startTime > currentTime) {
  // ...
  // 调用requestHostTimeout实现任务的转移，开启调度
  requestHostTimeout(handleTimeout, startTime - currentTime);
} else {
  //...
  // 开始执行任务，使用flushWork去执行taskQueue
  if (!isHostCallbackScheduled && !isPerformingWork) {
    isHostCallbackScheduled = true;
    requestHostCallback(flushWork);
  }
}
```

- 调度者与执行者

```javascript
const channel = new MessageChannel();
const port = channel.port2;
// 执行者 performWorkUntilDeadline
channel.port1.onmessage = performWorkUntilDeadline;

requestHostCallback = function (callback) {
  scheduledHostCallback = callback;
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    // 调度者 port.postMessage
    port.postMessage(null);
  }
};
```

- 任务执行
  - scheduledHostCallback 为 flushWork
  - 任务中断后，调度者调度执行者，继续任务（port.postMessage）

```javascript
const performWorkUntilDeadline = () => {
  if (scheduledHostCallback !== null) {
    const currentTime = getCurrentTime();
    deadline = currentTime + yieldInterval;
    const hasTimeRemaining = true;
    try {
      const hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);

      if (!hasMoreWork) {
        // 如果没有任务了，停止调度
        isMessageLoopRunning = false;
        scheduledHostCallback = null;
      } else {
        // 如果还有任务，继续让调度者调度执行者，便于继续完成任务
        port.postMessage(null);
      }
    } catch (error) {
      port.postMessage(null);
      throw error;
    }
  } else {
    isMessageLoopRunning = false;
  }
  needsPaint = false;
};

function flushWork(hasTimeRemaining, initialTime) {
  // ...
  return workLoop(hasTimeRemaining, initialTime);
}
```

- 任务的中断与恢复 - workloop
  - shouldYieldToHost 是否让出执行权给主线程

```javascript
function workLoop(hasTimeRemaining, initialTime) {
  // 获取taskQueue中排在最前面的任务
  currentTask = peek(taskQueue);
  while (currentTask !== null) {
    if (
      currentTask.expirationTime > currentTime &&
      (!hasTimeRemaining || shouldYieldToHost())
    ) {
      // break掉while循环
      break;
    }

    // 执行任务

    // 任务执行完毕，从队列中删除
    pop(taskQueue);

    // 获取下一个任务，继续循环
    currentTask = peek(taskQueue);
  }

  // 有更多任务
  if (currentTask !== null) {
    return true;
  } else {
    // taskQueue无任务，重新调度
    const firstTimer = peek(timerQueue);
    if (firstTimer !== null) {
      // 调用requestHostTimeout实现任务的转移，开启调度
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }
    return false;
  }
}
```

- 单个任务的完成情况
  - 任务完成返回 null，否则返回可执行的任务函数（根据任务函数的返回值，判断任务完成状态）

```javascript
function workLoop(hasTimeRemaining, initialTime) {
  let currentTime = initialTime;
  // 开始执行前检查一下timerQueue中的过期任务，放到taskQueue中
  advanceTimers(currentTime);
  currentTask = peek(taskQueue);

  while (
    currentTask !== null &&
    !(enableSchedulerDebugging && isSchedulerPaused)
  ) {
    // ...
    // 获取任务的执行函数，这个callback就是React传给Scheduler
    // 的任务。例如：performConcurrentWorkOnRoot
    const callback = currentTask.callback;
    if (typeof callback === "function") {
      currentTask.callback = null;
      // 获取任务的优先级
      currentPriorityLevel = currentTask.priorityLevel;
      // 任务是否过期
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      // 获取任务函数的执行结果
      const continuationCallback = callback(didUserCallbackTimeout);
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
    // 从taskQueue中继续获取任务，如果上一个任务未完成，那么它将不会
    // 被从队列剔除，所以获取到的currentTask还是上一个任务，会继续
    // 去执行它
    currentTask = peek(taskQueue);
  }
  // ...
}
```

- 取消调度

```javascript
function workLoop(hasTimeRemaining, initialTime) {
  // ...
  // 获取taskQueue中最紧急的任务
  currentTask = peek(taskQueue);
  while (currentTask !== null) {
    // ...
    const callback = currentTask.callback;

    if (typeof callback === "function") {
      // 执行任务
    } else {
      // 如果callback为null，将任务出队
      pop(taskQueue);
    }
    currentTask = peek(taskQueue);
  }
  // ...
}
function unstable_cancelCallback(task) {
  // ...
  task.callback = null;
}
```
