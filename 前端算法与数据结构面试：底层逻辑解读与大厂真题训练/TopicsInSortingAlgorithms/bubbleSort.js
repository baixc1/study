/**
 * 冒泡排序
 * 过程：从第一个元素开始，重复比较相邻的元素，若第一项比第二项大，则交换位置，否则不变
 * 遍历：外层：0...len-2, 内层：0...len-2-i（i为外层当前下标）
 * 核心：最大值（每轮操作，都会排序好一个最大值）
 */
function bubbleSort(arr) {
  const len = arr.length;
  let flag = false;
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        flag = true;
      }
      // 若所有元素都满足递增规律（最好时间复杂度：O(n)）
      if (!flag) return arr;
    }
  }
  return arr;
}
console.log(bubbleSort([5, 3, 2, 4, 1]));
console.log(bubbleSort([1, 2, 3]));
