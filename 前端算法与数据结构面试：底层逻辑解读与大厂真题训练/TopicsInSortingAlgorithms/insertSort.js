/**
 * 插入排序
 * 过程：当前元素插入到它前面（已排序列表）的正确位置
 * 遍历：外层：1...len-1, 内层：i-1...0（i为外层当前下标）（插入从后往前遍历）
 * 核心：已排序数组（基于该数组插入）
 */
function insertSort(arr) {
  const len = arr.length;
  let temp; // 需要被插入的元素
  for (let i = 1; i < len; i++) {
    temp = arr[i];
    let j = i - 1;
    // 找到插入位置
    for (; j >= 0; j--) {
      // 如果当前元素大于temp,后移。否则跳出
      if (arr[j] > temp) {
        arr[j + 1] = arr[j];
      } else {
        break;
      }
    }
    // 插入
    arr[j + 1] = temp;
  }
  return arr;
}
console.log(insertSort([3, 1, 5, 2]));
