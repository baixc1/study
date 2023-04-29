// https://github.com/brickspert/blog/issues/26

// useState useEffect 简单版
const memoizedState = []; // hook数组（每次遍历，hook的顺序不变，用于保存/获取当前hook信息）
let index = 0; // 当前遍历hook的下标

/**
 * 实现（简单版，不考虑各种参数类型）
 * 1. 返回数组
 * 2. 第一个参数是state, 第二个参数为修改state的函数（闭包+触发更新）
 */
function useState(initValue) {
  // 外部变量记录hook信息（state）
  memoizedState[index] = memoizedState[index] || initValue;

  const curIndex = index;
  function setState(newVal) {
    memoizedState[curIndex] = newVal;
    render();
  }
  return [memoizedState[index++], setState];
}

/**
 * 实现（简单版）
 * 1. 第一个参数是回调函数, 第二个参数是依赖数组
 * 2. 根据第二个参数，判断是否执行cb（是否有依赖+依赖是否变化）
 */
function useEffect(cb, depArray) {
  const hasNoDeps = !depArray; // 是否有依赖数组
  // 外部变量记录hook信息(depArray)
  const deps = memoizedState[index];
  const hasChangedDeps = deps
    ? !depArray.every((el, i) => el === deps[i])
    : true;
  if (hasNoDeps || hasChangedDeps) {
    cb();
    memoizedState[index] = depArray;
  }
  index++;
}

function FiberNode() {
  this.memoizedState = null; // 指向 hook 链表
}

type Hooks = {
  memoizedState: any, // hook 记录的状态相关信息（useState为state值，useEffect为依赖信息对象）
  baseState: any,
  baseUpdate: Update<any> | null,
  queue: UpdateQueue<any> | null,
  next: Hook | null, // link 到下一个 hooks，通过 next 串联每一 hooks
};
