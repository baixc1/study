/**
 * Redux 背后的架构思想——认识 Flux 架构
    1. View Action Dispatcher Store 
    2. Action -> Dispatcher -> Store -> View 单向数据流
    3. View -> Action
 */

/**
 * 前端场景下的 MVC 架构
 * 1. View -> Controller -> Model -> View 单向数据流
 * 2. 前端应用/框架往往出于交互的需要，允许 View 和 Model 直接通信
 */

// 可预测：Flux 最核心的地方在于严格的单向数据流，在单向数据流下，状态的变化是可预测的

// store 只能由Dispatcher 派发 Action 来修改

/**
 * Redux 组成部分: Store Reducer 和 Action。
 * 1. View -> Action -> Reducer -> Store -> View 单向数据流
 */

// Redux 核心 API createStore

/**
 * 发布订阅模式 闭包 dispatch - emit, subscribe - on
 * @param {*} reducer
 * @param {*} preloadedState 初始化 state
 * @param {*} enhancer 中间件
 * @returns
 */
function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  // preloadedState 为中间件情况
  if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== "undefined") {
    // ... enhancer校验

    // 函数重写（enhancer 功能增强）
    return enhancer(createStore)(reducer, preloadedState);
  }

  // ... reducer 校验

  var currentReducer = reducer; // 当前 reducer
  var currentState = preloadedState; // 当前 state
  var currentListeners = []; // 当前事件监听容器
  var nextListeners = currentListeners; // currentListeners 快照
  var isDispatching = false; // 锁
  /**
   * This makes a shallow copy of currentListeners so we can use
   * nextListeners as a temporary list while dispatching.
   *
   * This prevents any bugs around consumers calling
   * subscribe/unsubscribe in the middle of a dispatch.
   */
  // 防止发布订阅时，新增/取消订阅导致的问题
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  // 获取当前 state
  function getState() {
    return currentState;
  }

  // 订阅（dispatch调用时触发）
  function subscribe(listener) {
    if (typeof listener !== "function") {
      // 函数校验
    }

    if (isDispatching) {
      // 禁止在 reducer 中调用 subscribe（死循环）
    }

    // 避免多次调用
    var isSubscribed = true;

    // diapatch中可能触发 subscribe/unsubscribe，回调函数数组调用过程中不能增删（currentListeners 不变，变 nextListeners）
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        // ...
      }

      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }

  // 发布 Action -> Reducer -> Store
  function dispatch(action) {
    // 校验

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = (currentListeners = nextListeners);

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }

  // ....

  // 初始化 state
  dispatch({
    type: ActionTypes.INIT,
  });

  // 定义 store 并返回
  return (
    (_ref2 = {
      dispatch: dispatch,
      subscribe: subscribe,
      getState: getState,
      replaceReducer: replaceReducer,
    }),
    (_ref2[$$observable] = observable),
    _ref2
  );
}
