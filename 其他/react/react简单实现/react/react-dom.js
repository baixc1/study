// react/react-dom.js

// 下一个功能单元
let nextUnitOfWork = null;
// 根节点
let wipRoot = null;
// 更新前的根节点fiber树
let currentRoot = null;
// 需要删除的节点
let deletions = null;

/**                             dom 渲染                            */
/**
 * 将虚拟 DOM 转换为真实 DOM 并添加到容器中
 * @param {element} 虚拟 DOM
 * @param {container} 真实 DOM
 */
export function render(element, container) {
  // 将根节点设置为第一个将要工作单元
  wipRoot = {
    alternate: currentRoot,
    dom: container,
    props: {
      children: [element],
    },
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
}

/**
 * 创建DOM
 * @param {*} fiber fiber节点
 */
function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);
  return dom;
}

const isEvent = (key) => key.startsWith("on");
const isProperty = (key) => key !== "children" && !isEvent(key);
// 是否有新属性值
const isNew = (prev, next) => (key) => prev[key] !== next[key];
// 是否有旧属性
const isGone = (prev, next) => (key) => !(key in next);

/**
 * 更新dom属性
 * @param {*} dom
 * @param {*} prevProps 老属性
 * @param {*} nextProps 新属性
 */
function updateDom(dom, prevProps, nextProps) {
  // 移除老的事件监听
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // 移除老的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = "";
    });

  // 设置新的属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  // 添加新的事件处理
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

// ------------------------------------- 调和 ----------------------------------

/**
 * 工作循环
 * @param {*} deadline 截止时间
 */
function workLoop(deadline) {
  // 停止循环标识
  let shouldYield = false;

  // 循环条件为存在下一个工作单元，且没有更高优先级的工作
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 当前帧空余时间要没了，停止工作循环
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  // 空闲时间应该任务
  requestIdleCallback(workLoop);
}
// 空闲时间执行任务
requestIdleCallback(workLoop);

/**
 * 处理工作单元，返回下一个单元事件
 * @param {*} nextUnitOfWork
 */
function performUnitOfWork(fiber) {
  // 判断是否为函数
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    fiber.type.prototype.isReactComponent
      ? updateClassComponent(fiber)
      : updateFunctionComponent(fiber);
  } else {
    // 更新普通节点
    updateHostComponent(fiber);
  }

  // 寻找下一个孩子节点，如果有返回
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;

  while (nextFiber) {
    // 如果有兄弟节点，返回兄弟节点
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    // 否则返回父节点
    nextFiber = nextFiber.parent;
  }
}

/**
 * 类组件处理
 * @param {*} fiber
 */
function updateClassComponent(fiber) {
  const { type, props } = fiber;
  const children = [new type(props).render()];
  reconcileChildren(fiber, children);
}

// 函数组件
function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];

  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

// 原生元素
function updateHostComponent(fiber) {
  // 如果fiber上没有dom节点，为其创建一个
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 协调
  reconcileChildren(fiber, fiber.props.children);
}

/**
 * 协调
 * @param {*} wipFiber
 * @param {*} elements
 */
function reconcileChildren(wipFiber, elements) {
  // 索引
  let index = 0;
  // 上一个兄弟节点
  let prevSibling = null;
  // 上一次渲染的fiber
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;

  // 遍历孩子节点
  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    // 创建fiber
    const newFiber = null;

    // 类型判断
    const sameType = oldFiber && element && element.type == oldFiber.type;

    // 类型相同只更新props
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }

    // 新的存在并且类型和老的不同需要新增
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }

    // 老的存在并且类型和新的不同需要移除
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    // 一一对应
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    // 将第一个孩子节点设置为 fiber 的子节点
    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      // 第一个之外的子节点设置为第一个子节点的兄弟节点
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

// ------------------------------------- 提交 ----------------------------------
// 提交任务，将fiber tree 渲染为真实 DOM
/**
 * 处理提交的fiber树
 * @param {*} fiber
 * @returns
 */
function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.parent;
  // 一直向上找直到找到有dom的节点
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  // 处理新增节点标记
  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
    // 处理删除节点标记
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
    // 处理更新属性
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  }

  // 渲染子节点
  commitWork(fiber.child);
  // 渲染兄弟节点
  commitWork(fiber.sibling);
}

/**
 * 删除情况下，不断的向下找，直到找到有dom的子节点
 * @param {*} fiber
 * @param {*} domParent
 */
function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

/**
 * 提交任务，将fiber tree 渲染为真实 DOM
 */
function commitRoot() {
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

// ------------------------------------- hooks ----------------------------------
let hookIndex = null;
let wipFiber = null; // 当前fiber

/**
 * @param {*} initial 传进来的初始值
 * @returns
 */
export function useState(initial) {
  // 检查是否有旧的hooks
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];
  // 如果有旧的，就复制到新的，如果没有初始化
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  // 更新状态
  actions.forEach((action) => {
    hook.state = typeof action === "function" ? action(hook.state) : action;
  });

  // 设置hooks状态
  const setState = (action) => {
    hook.queue.push(action); // 闭包
    // 设置一个新的正在进行的工作根作为下一个工作单元，这样工作循环就可以开始一个新的渲染阶段
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook); // 一个函数组件，包含多个hook
  hookIndex++;
  return [hook.state, setState];
}
