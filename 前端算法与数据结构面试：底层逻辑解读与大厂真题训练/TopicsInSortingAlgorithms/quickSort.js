/**
 * 快速排序：选择一个基准点，小于基准点的放左边，大于基准点的放右边。重复该操作直至得到解。
 * 核心：递归
 */

/**
 * 方案一：非原地排序
 * 实现：使用left和right数组。小于基准点的放左边，大于基准点的放右边。然后返回排序结果（递归左边和右边）。
 * 核心：划分 left < 基准点 < right
 */
function quickSort(arr) {
  const len = arr.length;
  // 递归边界
  if (len <= 1) return arr;
  const pivotIndex = Math.floor(len / 2); // 基准点下标
  const left = []; // 小于基准点的放左边数组
  const right = [];
  for (let i = 0; i < len; i++) {
    if (i === pivotIndex) continue;
    if (arr[i] < arr[pivotIndex]) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  // 递归式
  return [...quickSort(left), arr[pivotIndex], ...quickSort(right)];
}
console.log(quickSort([3, 1, 2, 5, 6, 7]));

/**
 * 方案二：原地排序（不申请多余的空间来进行的排序，在原来的排序数据中比较和交换的排序）
 * 实现
 *    一次排序：确立基准点（比如右边），使用指针p。遍历1...len-1（len为当前数组长度）,
 * 找到小于基准点的元素，则p加1，并且交换下标i（遍历的当前下标）和下标p的元素。遍历完后，交换p+1和基准点元素
 *    递归一次排序函数（递归式）
 *    核心：使用p划分left和right,然后插入基准点（left < 基准点 < right）
 */
function quickSort2(list) {
  // 原地排序，直接修改数组，不返回新数组
  fn(list, 0, list.length - 1);
  return list;

  // 数组list，left->right区间排序
  function fn(arr, left, right) {
    // 终止条件
    if (left >= right) return;
    // 求解
    const p = partition(arr, left, right);
    // 递归式
    fn(arr, left, p);
    fn(arr, p + 2, right);
  }

  // 一次解
  function partition(arr, left, right) {
    let pivot = arr[right];
    let p = left - 1;
    for (let i = left; i < right; i++) {
      // 小于pivot的放p左边
      if (arr[i] < pivot) {
        p++;
        [arr[p], arr[i]] = [arr[i], arr[p]];
      }
    }
    // pivot放到p+1
    [arr[p + 1], arr[right]] = [pivot, arr[p + 1]];
    return p;
  }
}
console.log("方案二", quickSort2([1, 6, 2, 9, 3, 2, 1]));
console.log("方案二", quickSort2([1, 2, 3]));
console.log("方案二", quickSort2([3, 2, 1, 1, 2, 3]));
