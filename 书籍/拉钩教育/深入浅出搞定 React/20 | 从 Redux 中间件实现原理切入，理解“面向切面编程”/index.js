/**
 * Redux 中间件是如何与 Redux 主流程相结合的
 * action -> md1 -> md2 -> dispatch -> reducer -> nextState
 * applyMiddleware 将会对 dispatch 函数进行改写，使得 dispatch 在触发 reducer 之前，会首先执行对 Redux 中间件的链式调用
 */

/**
 * redux-thunk
 * 函数重写
 */

// 高阶函数，类似于函数重载。增加了对 action 为函数的处理
// 内部调用 -> 初始store(中间件调用，) -> 初始store(compose调用后调用，中间件函数嵌套) ->  action函数调用
function createThunkMiddleware(extraArgument) {
  var middleware = function middleware(_ref) {
    // _ref 为 middlewareAPI
    var dispatch = _ref.dispatch,
      getState = _ref.getState;
    return function (next) {
      // 新的 dispatch 函数（功能增强）
      return function (action) {
        if (typeof action === "function") {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };

  return middleware;
}

var thunk = createThunkMiddleware();

thunk.withExtraArgument = createThunkMiddleware;
export default thunk;


// Redux 中间件机制是如何实现的
// 包装 createStore，内层函数为重写的 createStore（返回store）
// 使用高阶函数，方便传参（函数链式调用）
export default function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}

// 1. applyMiddleware 是如何与 createStore 配合工作的
/**
 * 中间件情况下的createStore逻辑（重写createStore）
 */
// 创建 store
const store = createStore(
  reducer,
  initial_state,
  applyMiddleware(middleware1, middleware2, ...)
);

// applyMiddleware 是 enhancer 的一种
export default function applyMiddleware(...middlewares) {
  // 它返回的是一个接收 createStore 为入参的函数
  return createStore => (...args) => {
    // ...
  }
}

function createStore(reducer, preloadedState, enhancer) {
  // ...

  // enhancer 为 applyMiddleware的调用（高阶函数第一次调用）
  // enhancer(createStore) 为applyMiddleware返回值的调用（高阶函数第二次调用）
  // enhancer(createStore)(reducer, preloadedState)为applyMiddleware返回值的返回值的调用（高阶函数第三次调用）
  // 把 createStore(reducer,initState) 的调用分为三步。第一步参数middlewares，第二步参数createStore，第三步参数(reducer, preloadedState)
  return enhancer(createStore)(reducer, preloadedState);
}

// 2.dispatch 函数是如何被改写的？
const middlewareAPI = {
  getState: store.getState,
  // 闭包，dispatch为下面重写后的dispatch
  dispatch: (...args) => dispatch(...args)
}
// 遍历中间件，并调用（提供 middlewareAPI 参数，获取中间件内层函数 next）
const chain = middlewares.map(middleware => middleware(middlewareAPI))
// 重写dispatch（组合函数）（按顺序组合中间件的调用）（传递参数store.dispatch，原始dispatch）
dispatch = compose(...chain)(store.dispatch)

return {
  ...store,
  // 调用dispatch时，先依次执行中间件
  dispatch
}

// 3. compose 源码解读：函数的合成
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  // 函数嵌套调用（实现中间件的按顺序调用）
  // 把 a, b 当作参数，返回新的嵌套函数
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

// 组合函数demo
var a1 = x => x * 2
var a2 = x => x + 3
var b = compose(a1,a2)
b(3) // 12

// 中间件与面向切面编程(AOP)

/**
 * OOP 模式下的继承：class A 继承 class B，class B 继承 class C......这样一层一层将逻辑向下传递
 * AOP 模式下的继承: action -> reducer -> store 到 action -> 功能1 -> 功能2... -> reducer -> store
 * AOP 模式: “非侵入式”的逻辑扩充思路(Koa、Express)
 */

// 中间件调用链路 demo

// 日志中间件
const middleware1 =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    console.log("1");
    return next(action);
  };

// 异步action中间件
const middleware2 =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    console.log("2");
    // 若 action 是一个函数，就会执行 action
    if (typeof action === "function") {
      return action(dispatch, getState);
    }
    // 若 action 不是一个函数，则不处理，直接放过
    return next(action);
  };

const store = createStore(
  rootReducer,
  applyMiddleware(middleware1, middleware2)
);

// demo1
store.dispatch((dispatch) => {
  console.log(3)
  // 模拟异步
  setTimeout(() => {
    dispatch({ type: "ADD_TODO", id: 2, text: "22" });
  }, 100);
});

/**
 * 初始化
 * 1. applyMiddleware 增强 createStore，调用后返回新的 createStore - enhancer（接受createStore、reducer, preloadedState等参数）
 * 2. createStore 传参调用， enhancer(createStore)(reducer, preloadedState) 
 * 3. createStore 内部调用
 *    a. 初始化 store
 *    b. 初始化中间件，第一次传参调用，获取 chain。参数 getState， dispatch（dispatch 的参数为初始化的reducer和initState）
 *    c. 初始化中间件，第二次传参调用 dispatch = compose(...chain)(store.dispatch)。先生成中间件的组合函数，再使用store.dispatch(原始dispatch)调用，每次调用均返回新的dispatch函数，最后返回chain[0]的内部函数(action => {})。调用 next => action => {} 时，第一次调用的next为原始dispatch，其返回值为第二个中间件的next（第n个中间件的next调用返回值，为第n+1个中间件的next参数）
 *    d. 生成新的dispatch函数，dispatch为第一个中间件的action函数，他的next指向第二个中间件的action函数，依次类推，最后一个next为store.dispatch(原始dispatch)。返回store
 * demo1调用时
 * 1. 执行第一个中间件，输出1
 * 2. 通过next(), 执行第二个中间件,输出2
 * 3. 第二个中间件，判断action为函数，执行该action
 * 4. 执行action，输出3，执行定时器，执行dispatch(中间件dispatch === 新的store.dispatch)
 * 5. 重复步骤1, 2
 * 6. 第二个中间件，判断action为对象，执行next，next为store.dispatch(原始dispatch)
 * 7. 最终结果为调用原始dispatch，流程结束
 */