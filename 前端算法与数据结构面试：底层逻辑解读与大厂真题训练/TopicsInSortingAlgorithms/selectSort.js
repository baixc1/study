/**
 * 选择排序
 * 过程：遍历数组，每次都找出当前范围内的最小值，放到当前范围的头部。然后缩小该范围，重复以上操作，直至完成排序（指针）
 * 遍历：外层：0...len-2, 内层：i...len-1(i为外层当前下标)
 * 核心：最小值（每次排序，确认一个最小值放到前面）
 */
function selectSort(arr) {
  const len = arr.length;
  let minIndex; // 最小值下标（用于替换）
  for (let i = 0; i < len - 1; i++) {
    minIndex = i; // j = i 的情况
    for (let j = i + 1; j < len; j++) {
      if (arr[minIndex] > arr[j]) {
        minIndex = j;
      }
    }
    // 每次排序一个最小值
    if (i !== minIndex) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}
console.log(selectSort([2, 3, 1]));
