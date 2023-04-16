/**
 * completeWork——将 Fiber 节点映射为 DOM 节点
 * 调用链路：performUnitOfWork -> completeUnitOfWork -> completeWork
 */


/**
 * completeUnitOfWork —— 开启收集 EffectList 的“大循环”
 * 任务循环：
 * 1. 针对传入的当前节点，调用 completeWork
 * 2. 将当前节点的副作用链（EffectList）插入到其父节点对应的副作用链（EffectList）中
 * 3. 以当前节点为起点，循环遍历其兄弟节点及其父节点。当遍历到兄弟节点时，将 return 掉当前调用，触发兄弟节点对应的 performUnitOfWork 逻辑；而遍历到父节点时，则会直接进入下一轮循环，也就是重复 1、2 的逻辑。
 */

/**
 * 元素层级：div.APP > div.container > h1 / p.p1 / p.p2 
 * 递归流程：
 * (深度优先遍历算法，先 begin ，再 complete)
 * (completeWork 的执行是严格自底向上的，子节点的 completeWork 总会先于父节点执行)
 * 1. beginWork$1(s) 执行 递的过程，到达叶子结点 
 *    rootFiber(s) -> APP(s) -> container(s) -> h1(s)
 * 2. h1 节点，执行 completeWork(c)后，进入兄弟节点 p1 的 beginWork 流程
 *    rootFiber(s) -> APP(s) -> container(s) -> h1(s/c) -> p1(s)
 * 3. p1 节点，执行 completeWork(当前函数 return 掉)，进入兄弟节点 p2 的 beginWork 流程
 *    rootFiber(s) -> APP(s) -> container(s) -> h1(s/c) -> p1(s/c) -> p2(s/c)
 * 4. p2 节点，执行 completeWork 后，执行父节点的 completeWork（当前函数 while循环）
 *    rootFiber(s) -> APP(s) -> container(s) -> h1(s/c) -> p1(s/c) -> p2(s/c) -> container(c) -> APP(c) -> rootFiber(c) -> null
 */
function completeUnitOfWork(unitOfWork) {
  // ...

  do {
    // ...

    if ((completedWork.flags & Incomplete) === NoFlags) {
      if ((completedWork.mode & ProfileMode) === NoMode) {
        next = completeWork(current, completedWork, subtreeRenderLanes);
      } else {
        next = completeWork(current, completedWork, subtreeRenderLanes);
      }

      if (next !== null) {
        // Completing this fiber spawned new work. Work on that next.
        workInProgress = next;
        return;
      }

      // ...
    } else {
      // ...
    }

    // 获取当前节点的兄弟节点
    var siblingFiber = completedWork.sibling;

    if (siblingFiber !== null) {
      // If there is more work to do in this returnFiber, do that next.
      workInProgress = siblingFiber;
      return;
    } // Otherwise, return to the parent

    completedWork = returnFiber; // Update the next thing we're working on in case something throws.

    workInProgress = completedWork;
  } while (completedWork !== null); // We've reached the root.
}

function performUnitOfWork(unitOfWork) {
  // ...

  // 创建当前节点的子节点
  if ((unitOfWork.mode & ProfileMode) !== NoMode) {
    next = beginWork$1(current, unitOfWork, subtreeRenderLanes);
  } else {
    next = beginWork$1(current, unitOfWork, subtreeRenderLanes);
  }

  // ...

  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    // 按照深度优先遍历的原则，当遍历到叶子节点时，“递”阶段就结束了，随之而来的是“归”的过程
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }

  ReactCurrentOwner$2.current = null;
}

function completeWork(current, workInProgress, renderLanes) {
  var newProps = workInProgress.pendingProps;

  switch (workInProgress.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case SimpleMemoComponent:
    case FunctionComponent:
    case ForwardRef:
    case Fragment:
    case Mode:
    case Profiler:
    case ContextConsumer:
    case MemoComponent:
      return null;

    case ClassComponent: {
      var Component = workInProgress.type;

      if (isContextProvider(Component)) {
        popContext(workInProgress);
      }

      return null;
    }

    // h1 节点的类型属于 HostComponent
    case HostComponent: {
      // 容器DOM
      var rootContainerInstance = getRootHostContainer();
      // 节点类型
      var type = workInProgress.type;

      // 挂载阶段 current 为 null
      if (current !== null && workInProgress.stateNode != null) {
        // ...
      } else {
        var currentHostContext = getHostContext();

        // _wasHydrated 是一个与服务端渲染有关的值，这里不用关注
        var _wasHydrated = popHydrationState(workInProgress);

        if (_wasHydrated) {
          // ...
        } else {
          // 创建 DOM
          var instance = createInstance(
            type,
            newProps,
            rootContainerInstance,
            currentHostContext,
            workInProgress
          );
          // 挂载 DOM
          appendAllChildren(instance, workInProgress, false, false);
          // stateNode 存储 DOM
          workInProgress.stateNode = instance; // Certain renderers require commit-time effects for initial mount.
          // (eg DOM renderer supports auto-focus for certain elements).
          // Make sure such renderers get scheduled for later work.

          // 为 DOM 节点设置属性
          if (
            finalizeInitialChildren(
              instance,
              type,
              newProps,
              rootContainerInstance
            )
          ) {
            markUpdate(workInProgress);
          }
        }

        if (workInProgress.ref !== null) {
          // If there is a ref on a host node we need to schedule a callback
          markRef$1(workInProgress);
        }
      }

      return null;
    }

    // ...
  }
}

/**
 * completeWork
 * 1. 负责处理 Fiber 节点到 DOM 节点的映射逻辑
 * 2. completeWork 关键点
 * 2.1 创建DOM 节点（createInstance）
 * 2.2 将 DOM 节点插入到 DOM 树中（appendAllChildren）
 * 2.3 为 DOM 节点设置属性（finalizeInitialChildren）
 * 3. 创建好的 DOM 节点会被赋值给 workInProgress 节点的 stateNode 属性
 */

// 2.2
appendAllChildren = function (
  parent,
  workInProgress,
  needsVisibilityToggle,
  isHidden
) {
  // We only have the top Fiber that was created but we need recurse down its
  // children to find all the terminal nodes.
  var node = workInProgress.child;

  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode); // 添加子元素
    } else if (node.tag === HostPortal);
      // ...
    }
    // ...
  }
};

function appendInitialChild(parentInstance, child) {
  parentInstance.appendChild(child); // dom 方法
}

// 2.3 设置文本属性
var setTextContent = function (node, text) {
  // ...
  node.textContent = text;
};

/**
 * completeUnitOfWork 中的 effectList 逻辑
 * 1. render 阶段的工作目标是找出界面中需要处理的更新
 * 2. fiber 的 effectList中， 记录其需要更新的后代节点
*/ 
function completeUnitOfWork(unitOfWork) {
  // ...
  var flags = completedWork.flags;

  if (flags > PerformedWork) {
    if (returnFiber.lastEffect !== null) {
      // ...
    } else {
      returnFiber.firstEffect = completedWork;
    }

    returnFiber.lastEffect = completedWork;
  }
  // ...
}

/**
 * effectList 创建过程（初始化渲染阶段）
 * 1. AppFiber 的 flags 属性为 3，大于 PerformedWork
 * 2. rootFiber.firstEffect = AppFiber
 * 3. rootFiber.lastEffect = AppFiber
 */