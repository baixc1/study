// react diff 算法
// https://juejin.cn/post/7212548256944767034#heading-1
// https://xiaochen1024.com/courseware/60b1b2f6cf10a4003b634718/60b1b354cf10a4003b634721

/**
 * 同层key比较，位置改变（第三次遍历）
 * [A,B,C,D] -> [A,C,D,B]
 * 比较逻辑：顺位比较，找不同（A/C/D顺序不变，B移位）
 *  遍历[A,C,D,B]
 *    A 相同，复用 lastPlacedIndex = 0
 *    B 不同，跳出循环
 *  记录Map(B,C,D) existingChildren
 *  遍历[C,D,B]
 *    existingChildren[C] = 2 > lastPlacedIndex 无需移动 lastPlacedIndex = 2
 *    existingChildren[D] = 3 > lastPlacedIndex 无需移动 lastPlacedIndex = 3
 *    existingChildren[B] = 1 < lastPlacedIndex 根据 lastPlacedIndex 移动
 */

function reconcileChildrenArray(
  returnFiber, // 父Fiber
  currentFirstChild, // 父Fiber的child
  newChildren, // 新列表的虚拟dom对象
  lanes
) {
  // ...

  // 第三次遍历处理节点位置改变
  // 记录旧的位置映射（existingChildren key->Fiber Map{B->{bFiber...}}）
  var existingChildren = mapRemainingChildren(returnFiber, oldFiber); // Keep scanning and use the map to restore deleted items as moves.

  // 遍历新fibers, 从变化的位置开始
  for (; newIdx < newChildren.length; newIdx++) {
    // 创建fiber(新建/复用workInProgressFiber)
    var _newFiber2 = updateFromMap(
      existingChildren,
      returnFiber,
      newIdx,
      newChildren[newIdx],
      lanes
    );

    // existingChildren 数据同步
    if (_newFiber2 !== null) {
      if (shouldTrackSideEffects) {
        if (_newFiber2.alternate !== null) {
          existingChildren.delete(
            _newFiber2.key === null ? newIdx : _newFiber2.key
          );
        }
      }

      // 更新lastPlacedIndex（移动打tag）
      lastPlacedIndex = placeChild(_newFiber2, lastPlacedIndex, newIdx);

      // 新列表的fiber树链表
      if (previousNewFiber === null) {
        resultingFirstChild = _newFiber2;
      } else {
        previousNewFiber.sibling = _newFiber2;
      }

      previousNewFiber = _newFiber2;
    }
  }
}

// updateFromMap->updateElement->useFiber
// current: currentFiber, element虚拟dom
function updateElement(returnFiber, current, element, lanes) {
  // ...
  var existing = useFiber(current, element.props);
  // ...

  return existing;
}

function useFiber(fiber, pendingProps) {
  // We currently set sibling to null and index to 0 here because it is easy
  // to forget to do before returning it. E.g. for the single child case.
  var clone = createWorkInProgress(fiber, pendingProps);
  clone.index = 0;
  clone.sibling = null;
  return clone;
}

// 标记副作用（移动）
function placeChild(newFiber, lastPlacedIndex, newIndex) {
  newFiber.index = newIndex; // 通过index移动？
  // ...
  var current = newFiber.alternate;

  if (current !== null) {
    var oldIndex = current.index;

    if (oldIndex < lastPlacedIndex) {
      // This is a move.（副作用-移动）
      newFiber.flags |= Placement;
      return lastPlacedIndex;
    } else {
      // This item can stay in place.
      return oldIndex;
    }
  } else {
    // ...
  }
}

/**
 * 同层key比较，位置改变（第一次遍历）
 * key不同，第一次循环结束
 */
function reconcileChildrenArray(
  returnFiber,
  currentFirstChild,
  newChildren,
  lanes
) {
  var previousNewFiber = null;
  var oldFiber = currentFirstChild;
  var lastPlacedIndex = 0;
  var newIdx = 0;
  var nextOldFiber = null;

  // 第一次遍历
  for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
    if (oldFiber.index > newIdx) {
      nextOldFiber = oldFiber;
      oldFiber = null;
    } else {
      nextOldFiber = oldFiber.sibling;
    }

    // newChild.key !== key 返回null(key不同，第一次循环结束)
    var newFiber = updateSlot(
      returnFiber,
      oldFiber,
      newChildren[newIdx],
      lanes
    );

    if (newFiber === null) {
      // ...
      break;
    }
    // ...

    // 记录复用的 oldFiber 的 index
    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
    // ...
  }
  // ...
}

/**
 * 同层key比较，位置改变（第er次遍历）
 * 老节点没了（将剩余新节点标记为Placement）
 */
