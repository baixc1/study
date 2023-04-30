// https://xiaochen1024.com/courseware/60b1b2f6cf10a4003b634718/60b1b360cf10a4003b634722

/**
 * commit阶段 调用栈
 * 1. performSyncWorkOnRoot
 * 2. commitRoot
 * 3. commitRootImpl
 */

function commitRoot(root) {
  var renderPriorityLevel = getCurrentPriorityLevel();
  // 调度 commitRootImpl
  runWithPriority$1(
    ImmediatePriority$1,
    commitRootImpl.bind(null, root, renderPriorityLevel)
  );
  return null;
}

/**
 * commit阶段前置工作
 * 1. 调用flushPassiveEffects执行完所有effect的任务
 * 2. 初始化相关变量
 * 3. 赋值firstEffect给后面遍历effectList用
 */

/**
 * mutation阶段
 * 执行对应的dom操作和生命周期
 * 1. commitBeforeMutationEffects
 * 2. commitMutationEffects
 * 3. commitLayoutEffects
 *
 * a. componentWillUnmount发生在commitMutationEffects函数中
 * b. componentDidMount和componentDidUpdate会在commitLayoutEffects中执行
 */

/**
 * mutation 后
 * 1. 变量赋值
 * 2. 执行flushSyncCallbackQueue处理componentDidMount等生命周期或者useLayoutEffect等同步任务
 */
function commitRootImpl(root, renderPriorityLevel) {
  /************** commit阶段前置工作 ****************/
  do {
    flushPassiveEffects();
  } while (rootWithPendingPassiveEffects !== null);

  // 重置变量

  // root 为 fiberRoot, finishedWork 为 rootFiber
  root.finishedWork = null;
  root.finishedLanes = NoLanes;

  // ...

  // 重置全局变量
  if (root === workInProgressRoot) {
    // We can reset these now that they are finished.
    workInProgressRoot = null;
    workInProgress = null;
    workInProgressRootRenderLanes = NoLanes;
  } // Get the list of effects.

  // rootFiber可能会有新的副作用 将它也加入到effectLis
  var firstEffect;

  if (finishedWork.flags > PerformedWork) {
    // A fiber's effect list consists only of its children, not itself. So if
    // the root has an effect, we need to add it to the end of the list. The
    // resulting list is the set that would belong to the root's parent, if it
    // had one; that is, all the effects in the tree including the root.
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork;
      firstEffect = finishedWork.firstEffect;
    } else {
      firstEffect = finishedWork;
    }
  } else {
    // There is no effect on the root.
    firstEffect = finishedWork.firstEffect;
  }

  /************** mutation阶段 ****************/
  if (firstEffect !== null) {
    // ...

    do {
      {
        // 1. commitBeforeMutationEffects
        invokeGuardedCallback(null, commitBeforeMutationEffects, null);
        // ...
      }
    } while (nextEffect !== null); // We no longer need to track the active instance fiber

    do {
      {
        // 2. commitMutationEffects
        invokeGuardedCallback(
          null,
          commitMutationEffects,
          null,
          root,
          renderPriorityLevel
        );

        // ...
      }
    } while (nextEffect !== null);

    do {
      {
        // 3. commitLayoutEffects
        invokeGuardedCallback(null, commitLayoutEffects, null, root, lanes);
      }
    } while (nextEffect !== null);

    // ...
  } else {
    // ...
  }

  /************** mutation后 ****************/
  // 1. 变量赋值
  var rootDidHavePassiveEffects = rootDoesHavePassiveEffects;

  if (rootDoesHavePassiveEffects) {
    // This commit has passive effects. Stash a reference to them. But don't
    // schedule a callback until after flushing layout work.
    rootDoesHavePassiveEffects = false;
    rootWithPendingPassiveEffects = root;
    pendingPassiveEffectsLanes = lanes;
    pendingPassiveEffectsRenderPriority = renderPriorityLevel;
  } else {
    // ...
  } // Read this again, since an effect might have updated it

  // ...

  onCommitRoot(finishedWork.stateNode, renderPriorityLevel);

  {
    onCommitRoot$1();
  } // Always call this before exiting `commitRoot`, to ensure that any
  // additional work on this root is scheduled.

  // 确保被调度
  ensureRootIsScheduled(root, now());

  // ...

  // 执行flushSyncCallbackQueue处理componentDidMount等生命周期或者useLayoutEffect等同步任务
  flushSyncCallbackQueue();

  return null;
}

/**
 * mutation阶段的三个函数
 */

/**
 * commitBeforeMutationEffects
 * commitRootImpl -> commitBeforeMutationEffects -> flushPassiveEffectsImpl（异步调度）
 * 1. commitBeforeMutationLifeCycles 中，同步调用 getSnapshotBeforeUpdate(生命周期钩子)
 * 2. 异步调度useEffect
 */

function commitBeforeMutationEffects() {
  while (nextEffect !== null) {
    var current = nextEffect.alternate;

    var flags = nextEffect.flags;

    if ((flags & Snapshot) !== NoFlags) {
      setCurrentFiber(nextEffect);
      // commitBeforeMutationLifeCycles
      commitBeforeMutationLifeCycles(current, nextEffect);
      resetCurrentFiber();
    }

    if ((flags & Passive) !== NoFlags) {
      // If there are passive effects, schedule a callback to flush at
      // the earliest opportunity.
      if (!rootDoesHavePassiveEffects) {
        rootDoesHavePassiveEffects = true;
        // 异步调度flushPassiveEffects
        scheduleCallback(NormalPriority$1, function () {
          flushPassiveEffects();
          return null;
        });
      }
    }

    nextEffect = nextEffect.nextEffect;
  }
}

function commitBeforeMutationLifeCycles(current, finishedWork) {
  switch (finishedWork.tag) {
    // ...
    case ClassComponent: {
      if (finishedWork.flags & Snapshot) {
        if (current !== null) {
          // ...

          var snapshot = instance.getSnapshotBeforeUpdate(
            finishedWork.elementType === finishedWork.type
              ? prevProps
              : resolveDefaultProps(finishedWork.type, prevProps),
            prevState
          );

          // ...
        }
      }

      return;
    }
  }
}

function flushPassiveEffectsImpl() {
  var unmountEffects = pendingPassiveHookEffectsUnmount;
  pendingPassiveHookEffectsUnmount = [];

  // ...
  // useEffect销毁函数
  for (var i = 0; i < unmountEffects.length; i += 2) {
    var _effect = unmountEffects[i];
    var destroy = _effect.destroy;
    // ...
    if (typeof destroy === "function") {
      invokeGuardedCallback(null, destroy, null);
    }
  }
  // useEffect回调函数
  var mountEffects = pendingPassiveHookEffectsMount;
  pendingPassiveHookEffectsMount = [];

  for (var _i = 0; _i < mountEffects.length; _i += 2) {
    var _effect2 = mountEffects[_i];
    var _fiber = mountEffects[_i + 1];
    // ...
    if (typeof destroy === "function") {
      invokeGuardedCallback(null, invokePassiveEffectCreate, null, _effect2);
    }
  }
}

function invokePassiveEffectCreate(effect) {
  var create = effect.create;
  effect.destroy = create(); // useEffect 回调函数
}

/**
 * commitMutationEffects
 * 1. 调用commitDetachRef解绑ref
 * 2. 根据effectTag执行对应的dom操作
 */

function commitMutationEffects(root, renderPriorityLevel) {
  // TODO: Should probably move the bulk of this function to commitWork.
  while (nextEffect !== null) {
    setCurrentFiber(nextEffect);
    var flags = nextEffect.flags;
    // ...

    if (flags & Ref) {
      var current = nextEffect.alternate;

      if (current !== null) {
        // 1. 调用commitDetachRef解绑ref
        commitDetachRef(current);
      }
    }

    var primaryFlags = flags & (Placement | Update | Deletion | Hydrating);

    // 2. 根据effectTag执行对应的dom操作
    switch (primaryFlags) {
      // 插入dom
      case Placement: {
        commitPlacement(nextEffect); // Clear the "placement" from effect tag so that we know that this is
        // inserted, before any life-cycles like componentDidMount gets called.
        // TODO: findDOMNode doesn't rely on this any more but isMounted does
        // and isMounted is deprecated anyway so we should be able to kill this.

        nextEffect.flags &= ~Placement;
        break;
      }

      case PlacementAndUpdate: {
        // Placement
        commitPlacement(nextEffect); // Clear the "placement" from effect tag so that we know that this is
        // inserted, before any life-cycles like componentDidMount gets called.

        nextEffect.flags &= ~Placement; // Update

        var _current = nextEffect.alternate;
        commitWork(_current, nextEffect);
        break;
      }
      // ...

      case Update: {
        var _current3 = nextEffect.alternate;
        commitWork(_current3, nextEffect);
        break;
      }

      case Deletion: {
        commitDeletion(root, nextEffect);
        break;
      }
    }

    resetCurrentFiber();
    nextEffect = nextEffect.nextEffect;
  }
}

// commitPlacement插入节点
function commitPlacement(finishedWork) {
  var parentFiber = getHostParentFiber(finishedWork); // 找到最近的parent

  var parent;
  var isContainer;
  var parentStateNode = parentFiber.stateNode;

  switch (parentFiber.tag) {
    case HostComponent:
      parent = parentStateNode;
      isContainer = false;
      break;

    // dom容器（根节点）
    case HostRoot:
      parent = parentStateNode.containerInfo;
      isContainer = true;
      break;

    // eslint-disable-next-line-no-fallthrough

    // ...
  }
  // ...

  var before = getHostSibling(finishedWork); // We only have the top Fiber that was inserted but we need to recurse down its
  // children to find all the terminal nodes.

  if (isContainer) {
    insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
  } else {
    insertOrAppendPlacementNode(finishedWork, before, parent);
  }
}

/**
 * commitWork更新节点
 * 1. 执行销毁函数
 * 2. commitUpdate -> updateDOMProperties, 处理对应Update的dom操作
 */
function commitWork(current, finishedWork) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case MemoComponent:
    case SimpleMemoComponent:
    case Block: {
      // 销毁函数(同步执行useLayoutEffect的销毁函数)
      commitHookEffectListUnmount(Layout | HasEffect, finishedWork);

      return;
    }

    case ClassComponent: {
      return;
    }

    case HostComponent: {
      var instance = finishedWork.stateNode;

      if (instance != null) {
        // ...

        if (updatePayload !== null) {
          commitUpdate(instance, updatePayload, type, oldProps, newProps);
        }
      }

      return;
    }

    // ...
  }
}

function commitUpdate(
  domElement,
  updatePayload,
  type,
  oldProps,
  newProps,
  internalInstanceHandle
) {
  // Update the props handle so that we know which props are the ones with
  // with current event handlers.
  updateFiberProps(domElement, newProps); // Apply the diff to the DOM node.

  updateProperties(domElement, updatePayload, type, oldProps, newProps);
}

// 修改dom属性
function updateFiberProps(node, props) {
  node[internalPropsKey] = props;
}

function updateProperties(
  domElement,
  updatePayload,
  tag,
  lastRawProps,
  nextRawProps
) {
  // ...

  updateDOMProperties(
    domElement,
    updatePayload,
    wasCustomComponentTag,
    isCustomComponentTag
  ); // TODO: Ensure that an update gets scheduled if any of the special props
  // changed.

  // ...
}

// 修改dom内容的方法
function updateDOMProperties(
  domElement,
  updatePayload,
  wasCustomComponentTag,
  isCustomComponentTag
) {
  // TODO: Handle wasCustomComponentTag
  for (var i = 0; i < updatePayload.length; i += 2) {
    var propKey = updatePayload[i];
    var propValue = updatePayload[i + 1];

    if (propKey === STYLE) {
      setValueForStyles(domElement, propValue);
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      setInnerHTML(domElement, propValue);
    } else if (propKey === CHILDREN) {
      setTextContent(domElement, propValue);
    } else {
      setValueForProperty(domElement, propKey, propValue, isCustomComponentTag);
    }
  }
}

/**
 * 删除节点
 * 执行 componentWillUnmount 回调
 * commitMutationEffects -> commitDeletion -> unmountHostComponents -> callComponentWillUnmountWithTimer -> invokeGuardedCallback（调度） -> callCallback -> instance.componentWillUnmount
 */
function commitDeletion(finishedRoot, current, renderPriorityLevel) {
  {
    // Recursively delete all host nodes from the parent.
    // Detach refs and call componentWillUnmount() on the whole subtree.
    unmountHostComponents(finishedRoot, current);
  }
  // ...
}

/**
 * commitLayoutEffects
 * 在commitMutationEffects之后所有的dom操作都已经完成，可以访问dom
 * 1. commitLifeCycles 执行相关生命周期函数
 * 2. 执行 commitAttachRef
 */

function commitLayoutEffects(root, committedLanes) {
  while (nextEffect !== null) {
    setCurrentFiber(nextEffect);
    var flags = nextEffect.flags;

    if (flags & (Update | Callback)) {
      var current = nextEffect.alternate;
      commitLifeCycles(root, current, nextEffect);
    }

    {
      if (flags & Ref) {
        commitAttachRef(nextEffect);
      }
    }

    resetCurrentFiber();
    nextEffect = nextEffect.nextEffect;
  }
}

function commitLifeCycles(finishedRoot, current, finishedWork, committedLanes) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
    case Block: {
      {
        // 上述组件，执行 useLayoutEffect等 钩子
        commitHookEffectListMount(Layout | HasEffect, finishedWork);
      }

      // 向pendingPassiveHookEffectsUnmount和pendingPassiveHookEffectsMount中push effect
      schedulePassiveEffects(finishedWork);
      return;
    }

    case ClassComponent: {
      // ...
      // 类组件，执行componentDidMount/componentDidUpdate
      if (finishedWork.flags & Update) {
        if (current === null) {
          instance.componentDidMount();
        } else {
          instance.componentDidUpdate();
        }
      }

      // 执行setState第二个参数
      if (updateQueue !== null) {
        commitUpdateQueue(finishedWork, updateQueue, instance);
      }
    }

    case HostRoot: {
      // TODO: I think this is now always non-null by the time it reaches the
      // commit phase. Consider removing the type check.
      var _updateQueue = finishedWork.updateQueue;

      if (_updateQueue !== null) {
        // ...
        // 执行ReactDOM.render函数的第三个参数
        commitUpdateQueue(finishedWork, _updateQueue, _instance);
      }

      return;
    }
  }
}

function schedulePassiveEffects(finishedWork) {
  // ...
  if (lastEffect !== null) {
    do {
      // ...

      // 在schedulePassiveEffects中会将useEffect的销毁和回调函数push到pendingPassiveHookEffectsUnmount和pendingPassiveHookEffectsMount中
      if ((tag & Passive$1) !== NoFlags$1 && (tag & HasEffect) !== NoFlags$1) {
        enqueuePendingPassiveHookEffectUnmount(finishedWork, effect);
        enqueuePendingPassiveHookEffectMount(finishedWork, effect);
      }
    } while (effect !== firstEffect);
  }
}

function commitAttachRef(finishedWork) {
  var ref = finishedWork.ref;

  if (ref !== null) {
    var instance = finishedWork.stateNode;
    var instanceToUse;

    switch (finishedWork.tag) {
      case HostComponent:
        instanceToUse = getPublicInstance(instance);
        break;

      default:
        instanceToUse = instance;
    } // Moved outside to ensure DCE works with this flag

    if (typeof ref === "function") {
      ref(instanceToUse);
    } else {
      // 给ref赋值（实例）
      ref.current = instanceToUse;
    }
  }
}
