// react 17.x版本
/**
 * ReactDOM.render 调用链路的三个阶段
 * 1. 初始化阶段 legacyRenderSubtreeIntoContainer -> scheduleUpdateOnFiber（触发performSyncWorkOnRoot - render）
 * 2. render 阶段 scheduleUpdateOnFiber -> commitRoot
 * 3. commit 阶段 commitRoot -> 结束
 */

/**
 * 初始化阶段
 * 作用：完成 Fiber 树中基本实体的创建
 * 1. ReactDOM.render
 * 2. legacyRenderSubtreeIntoContainer
 * 3. updateContainer
 * 4. scheduleUpdateOnFiber
 * 5. performSyncWorkOnRoot
 */

function render(element, container, callback) {
  // ...

  return legacyRenderSubtreeIntoContainer(
    null,
    element,
    container,
    false,
    callback
  );
}

/**
 * 逻辑链路
 * 1. 调用 legacyCreateRootFromDOMContainer 创建 container._reactRootContainer 对象，并赋值给 root
 * 2. 将 root 对象的 _internalRoot 属性赋值给 fiberRoot
 * 3. 将 fiberRoot 与 入参一起，传入 updateContainer ，形成回调
 * 4. 将 updateContainer 回调作为参数，调用 unbatchedUpdates
 */
function legacyRenderSubtreeIntoContainer(
  parentComponent,
  children,
  container,
  forceHydrate,
  callback
) {
  // container 为DOM对象 - App容器
  var root = container._reactRootContainer;
  var fiberRoot;

  // 首次渲染
  if (!root) {
    // Initial mount
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate
    );
    fiberRoot = root._internalRoot;

    // ...

    unbatchedUpdates(function () {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    fiberRoot = root._internalRoot;

    //...

    updateContainer(children, fiberRoot, parentComponent, callback);
  }

  return getPublicRootInstance(fiberRoot);
}

// 容器对象DOM
container = {
  _reactRootContainer: {
    // fiberRoot(FiberRootNode 实例)
    _internalRoot: {
      // rootFiber，Fiber树 头部节点（FiberNode 实例）
      current: {},
      // dom容器
      containerInfo: {},
    },
  },
};

// unbatchedUpdates 主要为针对 updateContainer 的调用
function unbatchedUpdates(fn, a) {
  // ...

  try {
    return fn(a);
  } finally {
    // ...
  }
}

/**
 * updateContainer 作用
 * 1. 请求当前 Fiber 节点的 lane
 * 2. 结合 lane（优先级），创建当前 Fiber 节点的 update 对象，并将其入队
 * 3. 调度当前节点（rootFiber）
 */
function updateContainer(element, container, parentComponent, callback) {
  // ...

  var current$1 = container.current;
  var eventTime = requestEventTime();

  // ...

  // 优先级
  var lane = requestUpdateLane(current$1);

  // ...

  // 更新对象
  var update = createUpdate(eventTime, lane); // Caution: React DevTools currently depends on this property
  // being called "element".

  update.payload = {
    element: element,
  };

  // ...

  // 将 update 入队
  enqueueUpdate(current$1, update);

  // 调度 fiberRoot
  scheduleUpdateOnFiber(current$1, lane, eventTime);
  return lane;
}

// react 启动模式
// legacy 同步模式
ReactDOM.render(<App />, rootNode);

// concurrent 异步模式
ReactDOM.createRoot(rootNode).render(<App />);

// react 18版本
/**
 * ReactDOMRoot.prototype.render 调用链路
 * 1. updateContainer
 * 2. scheduleUpdateOnFiber
 * 3. ensureRootIsScheduled（同步模式：scheduleLegacySyncCallback -> ）
 */

/**
 * ReactDOM.render 调用链路
 * legacyRenderSubtreeIntoContainer
 *    legacyCreateRootFromDOMContainer -> flushSync
 *        updateContainer -> scheduleUpdateOnFiber -> ensureRootIsScheduled
 *        flushSyncCallbacks -> performSyncWorkOnRoot
 *
 */
