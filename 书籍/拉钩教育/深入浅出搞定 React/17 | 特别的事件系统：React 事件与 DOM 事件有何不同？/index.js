// react 版本 16.13.x

// React 事件系统工作流拆解：事件绑定和事件触发

/**
 * 事件的绑定（调用链路）
 * 1. completeWork
 * 2. createInstance 创建dom， appendAllChildren 插入节点，finalizeInitialChildren 设置节点属性
 * 3. setInitialProperties
 * 4. ensureListeningTo 进入事件监听注册流程
 * 5. legacyListenToTopLevelEvent 分发事件监听的注册逻辑（区分捕获/冒泡）
 */

function ensureListeningTo(rootContainerElement, registrationName) {
  // DOM是否是DOCUMENT相关类型
  var isDocumentOrFragment =
    rootContainerElement.nodeType === DOCUMENT_NODE ||
    rootContainerElement.nodeType === DOCUMENT_FRAGMENT_NODE;
  // ownerDocument返回当前节点的顶层的 document 对象
  var doc = isDocumentOrFragment
    ? rootContainerElement
    : rootContainerElement.ownerDocument;
  legacyListenToEvent(registrationName, doc);
}

// 监听顶层的事件
function legacyListenToEvent(registrationName, mountAt) {
  // 记录当前 document 已经监听了哪些事件
  var listenerMap = getListenerMapForElement(mountAt);
  var dependencies = registrationNameDependencies[registrationName];

  for (var i = 0; i < dependencies.length; i++) {
    var dependency = dependencies[i];
    legacyListenToTopLevelEvent(dependency, mountAt, listenerMap);
  }
}

function legacyListenToTopLevelEvent(topLevelType, mountAt, listenerMap) {
  // 跳过已在document注册的事件（实际注册的是一个统一的事件分发函数）
  if (!listenerMap.has(topLevelType)) {
    switch (topLevelType) {
      case TOP_SCROLL:
        trapCapturedEvent(TOP_SCROLL, mountAt);
        break;
      // ...
      default:
        // By default, listen on the top level to all non-media events.
        // Media events don't bubble so adding the listener wouldn't do anything.
        var isMediaEvent = mediaEventTypes.indexOf(topLevelType) !== -1;

        if (!isMediaEvent) {
          trapBubbledEvent(topLevelType, mountAt);
        }

        break;
    }

    listenerMap.set(topLevelType, null);
  }
}

// 注册冒泡事件
function trapBubbledEvent(topLevelType, element) {
  trapEventForPluginEventSystem(element, topLevelType, false);
}

// 获取统一的事件分发函数listener，注册事件
function trapEventForPluginEventSystem(container, topLevelType, capture) {
  var listener;

  switch (getEventPriorityForPluginSystem(topLevelType)) {
    case DiscreteEvent:
      listener = dispatchDiscreteEvent.bind(
        null,
        topLevelType,
        PLUGIN_EVENT_SYSTEM,
        container
      );
      break;
    // ...
  }

  var rawEventName = getRawEventName(topLevelType);

  if (capture) {
    addEventCaptureListener(container, rawEventName, listener);
  } else {
    addEventBubbleListener(container, rawEventName, listener);
  }
}

// 注册原生事件（冒泡阶段）
function addEventBubbleListener(element, eventType, listener) {
  element.addEventListener(eventType, listener, false);
}

// listener情况：dispatchDiscreteEvent等 通过调用 dispatchEvent 执行事件分发

/**
 * 事件的触发（调用链路）
 * 1. dispatchDiscreteEvent
 * 2. dispatchEvent
 * 3. runExtractedPluginEventsInBatch 收集节点及其回调函数，并执行事件
 * 4. extractPluginEvents 收集节点及其回调函数(捕获和冒泡)
 * 5. traverseTwoPhase -> accumulateDirectionalDispatches -> accumulateInto 按顺序收集节点及其回调函数
 * 6. executeDispatch 执行派遣事件 -> invokeGuardedCallback(invokeGuardedCallbackImpl) -> callCallback -> onClick
 */

function dispatchEvent(topLevelType, eventSystemFlags, container, nativeEvent) {
  // ...
  // 事件分发，调用链 handleTopLevel -> runExtractedPluginEventsInBatch
  var blockedOn = attemptToDispatchEvent(
    topLevelType,
    eventSystemFlags,
    container,
    nativeEvent
  );
  // ...
}

function runExtractedPluginEventsInBatch(
  topLevelType,
  targetInst,
  nativeEvent,
  nativeEventTarget,
  eventSystemFlags
) {
  // 事件收集： event 上 生成 _dispatchInstances/_dispatchListeners数组
  var events = extractPluginEvents(
    topLevelType,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags
  );
  // 事件执行
  runEventsInBatch(events);
}

function traverseTwoPhase(inst, fn, arg) {
  // 当前dom（arg）及其父元素的列表
  var path = [];

  while (inst) {
    path.push(inst);
    inst = getParent(inst); // 获取原生父dom
  }

  var i;

  // 收集 path 数组中会参与捕获过程的节点与对应回调
  for (i = path.length; i-- > 0; ) {
    fn(path[i], "captured", arg);
  }

  // 收集 path 数组中会参与冒泡过程的节点与对应回调
  for (i = 0; i < path.length; i++) {
    fn(path[i], "bubbled", arg);
  }
}

// fn 为 accumulateDirectionalDispatches, arg 为 原生 event 对象
function accumulateDirectionalDispatches(inst, phase, event) {
  var listener = listenerAtPhase(inst, event, phase);

  if (listener) {
    // 事件监听函数列表（函数和dom一一对应）
    event._dispatchListeners = accumulateInto(
      event._dispatchListeners,
      listener
    );
    // 事件触发dom列表
    event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
  }
}

// 按顺序收集回调函数和元素
function accumulateInto(current, next) {
  // ...

  if (Array.isArray(current)) {
    if (Array.isArray(next)) {
      current.push.apply(current, next);
      return current;
    }

    current.push(next);
    return current;
  }

  // ...

  return [current, next];
}

function invokeGuardedCallback(name, func, context, a, b, c, d, e, f) {
  hasError = false;
  caughtError = null;
  // arguments ['click', func, ...]
  invokeGuardedCallbackImpl$1.apply(reporter, arguments);
}

var invokeGuardedCallbackDev = function (
  name,
  func,
  context,
  a,
  b,
  c,
  d,
  e,
  f
) {
  var funcArgs = Array.prototype.slice.call(arguments, 3);

  function callCallback() {
    // ...
    // func 为注册事件的回调函数
    func.apply(context, funcArgs);
  }
};
