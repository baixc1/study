/**
 * 基础知识
 * 0. 包含并发模式的react17版本（https://github.com/xiaochen1024/react_code_demo）
 * 1. beginWork 将创建新的 Fiber 节点，
 * 2. completeWork 则负责将 Fiber 节点映射为 DOM 节点
 * 3. 渲染初始化时，fiber树：fiberRoot -> rootFiber
 */

// workInProgress 节点的创建

/**
 * render 阶段
 * 1. performSyncWorkOnRoot
 * 2. renderRootSync
 * 3.1 prepareFreshStack
 * 3.1.1 createWorkInProgress
 * 4. workLoopSync
 * 5. performUnitOfWork
 * 6. beginWork
 * 7. updateHostRoot
 * 8. reconcileChildren （获取 workInProgress.child）
 * 9. reconcileChildFibers
 * 10. reconcileSingleElement （创建 App 所对应的 Fiber 节点）
 * 11. placeSingleChild （标记副作用）
 */

function performSyncWorkOnRoot(root) {
  if (
    root === workInProgressRoot &&
    includesSomeLane(root.expiredLanes, workInProgressRootRenderLanes)
  ) {
    // ...
  } else {
    exitStatus = renderRootSync(root, lanes);
  }
}

function renderRootSync(root, lanes) {
  if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) {
    // 重置堆栈环境
    prepareFreshStack(root, lanes);
  }

  do {
    try {
      // 任务队列（执行任务单元）
      workLoopSync();
      break;
    } catch (thrownValue) {
      handleError(root, thrownValue);
    }
  } while (true);
}

function prepareFreshStack(root, lanes) {
  // ...
  workInProgressRoot = root;
  // 创建 workInProgress 树
  workInProgress = createWorkInProgress(root.current, null);

  // ...
}

/**
 * 1. workInProgress 为 fiber
 * 2. current（rootFiber） 和 workInProgress 通过 alternate 互相引用
 */
function createWorkInProgress(current, pendingProps) {
  var workInProgress = current.alternate;

  if (workInProgress === null) {
    // We use a double buffering pooling technique because we know that we'll
    // only ever need at most two versions of a tree. We pool the "other" unused
    // node that we're free to reuse. This is lazily created to avoid allocating
    // extra objects for things that are never updated. It also allow us to
    // reclaim the extra memory if needed.
    workInProgress = createFiber(
      current.tag,
      pendingProps,
      current.key,
      current.mode
    );
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;

    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    // ...
  }

  // ...

  return workInProgress;
}

// 创建 fiber节点 类型（根据 current 节点）
var createFiber = function (tag, pendingProps, key, mode) {
  // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
  return new FiberNode(tag, pendingProps, key, mode);
};

// 同步执行任务单元
function workLoopSync() {
  // Already timed out, so perform work without checking if we need to yield.
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function beginWork(current, workInProgress, renderLanes) {
  // ...

  if (current !== null) {
    var oldProps = current.memoizedProps;
    var newProps = workInProgress.pendingProps;

    if (
      oldProps !== newProps ||
      hasContextChanged() || // Force a re-render if the implementation changed due to hot reload:
      workInProgress.type !== current.type
    ) {
      // If props or context changed, mark the fiber as having performed work.
      // This may be unset if the props are determined to be equal later (memo).
      didReceiveUpdate = true;
    } else if (!includesSomeLane(renderLanes, updateLanes)) {
      didReceiveUpdate = false; // This fiber does not have any pending work. Bailout without entering
      // ...

      return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
    } else {
      if ((current.flags & ForceUpdateForLegacySuspense) !== NoFlags) {
        // This is a special case that only exists for legacy mode.
        // See https://github.com/facebook/react/pull/19216.
        didReceiveUpdate = true;
      } else {
        // An update was scheduled on this fiber, but there are no new props
        // nor legacy context. Set this to false. If an update queue or context
        // consumer produces a changed value, it will set this to true. Otherwise,
        // the component will assume the children have not changed and bail out.
        didReceiveUpdate = false;
      }
    }
  } else {
    didReceiveUpdate = false;
  }

  // ...

  switch (workInProgress.tag) {
    // ...

    case HostRoot:
      return updateHostRoot(current, workInProgress, renderLanes);

    case HostComponent:
      return updateHostComponent(current, workInProgress, renderLanes);
  }
}

function updateHostComponent(current, workInProgress, renderLanes) {
  // ...

  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
  if (current === null) {
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes
    );
  } else {
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes
    );
  }
}

var reconcileChildFibers = ChildReconciler(true);
var mountChildFibers = ChildReconciler(false);

/**
 *
 * @param {boolean} shouldTrackSideEffects 是否需要追踪副作用
 * @returns
 */
function ChildReconciler(shouldTrackSideEffects) {
  // 单个节点的插入逻辑
  function placeSingleChild(newFiber) {
    // This is simpler for the single child case. We only need to do a
    // placement for inserting new children.
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      // effectTag 副作用标记（数据获取、订阅或者修改 DOM）
      newFiber.flags = Placement;
    }

    return newFiber;
  }

  // 此处省略一系列 updateXXX 的函数，它们用于处理 Fiber 节点的更新

  function reconcileChildFibers(
    returnFiber,
    currentFirstChild,
    newChild,
    lanes
  ) {
    // ...
    if (isObject) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(
              returnFiber,
              currentFirstChild,
              newChild,
              lanes
            )
          );
        // ...
      }
    }
    // ...
  }

  // 此处省略一堆 reconcileXXXXX 形式的函数，它们负责处理具体的 reconcile 逻辑

  function reconcileChildFibers(
    returnFiber,
    currentFirstChild,
    newChild,
    lanes
  ) {
    // 这是一个逻辑分发器，它读取入参后，会经过一系列的条件判断，调用上方所定义的负责具体节点操作的函数
  }

  // 将总的 reconcileChildFibers 函数返回
  return reconcileChildFibers;
}

// reconcileSingleElement 内部调用 createFiberFromElement

function createFiberFromElement(element, mode, lanes) {
  var owner = null;

  {
    owner = element._owner;
  }

  var type = element.type;
  var key = element.key;
  var pendingProps = element.props;
  var fiber = createFiberFromTypeAndProps(
    type,
    key,
    pendingProps,
    owner,
    mode,
    lanes
  );

  {
    fiber._debugSource = element._source;
    fiber._debugOwner = element._owner;
  }

  return fiber;
}

/**
 * beginWork 流程（渲染初始化）
 * 1. updateHostRoot 更新 rootFiber （更新 workInProgress 树）
 * 2. reconcileChildren 分发 workInProgress.child 的创建逻辑
 * 3. reconcileChildFibers ->
 *      placeSingleChild（标记 effectTag 为true）
 *      reconcileSingleElement -> createFiberFromElement 分发子节点的创建逻辑（创建 APP FiberNode）
 */

/**
 * 循环创建新的 Fiber 节点
 */
function workLoopSync() {
  // Already timed out, so perform work without checking if we need to yield.
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  // ...

  if ((unitOfWork.mode & ProfileMode) !== NoMode) {
    startProfilerTimer(unitOfWork);
    next = beginWork$1(current, unitOfWork, subtreeRenderLanes);
    stopProfilerTimerIfRunningAndRecordDelta(unitOfWork, true);
  } else {
    next = beginWork$1(current, unitOfWork, subtreeRenderLanes);
  }

  // ...

  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next; // 更新 workInProgress
  }

  // ...
}

// 链表属性：child、return、sibling
