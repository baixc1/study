/**
 * 归并排序：将数组分两半，递归该操作（外->里），直至不能分。然后从一个元素开始，俩俩排序合并，递归该操作（里->外），得出解
 * 分治思想
 *    解题步骤： 1. 分解子问题 2. 求解子问题 3. 合并子问题的解，得出大问题的解
 *    核心：总->分， 分->总
 *    实现：递归
 * 实现
 *    过程：递归求0-len/2, len/2到2，然后排序
 */
function mergeSort(arr) {
  const len = arr.length;
  // 递归边界
  if (len <= 1) return arr;
  const mid = Math.floor(len / 2);
  // 递归式
  const leftArr = mergeSort(arr.slice(0, mid));
  const rightArr = mergeSort(arr.slice(mid));
  // 解
  return mergeArr(leftArr, rightArr);
}

// 双指针排序（两个有序数组）
function mergeArr(arr1, arr2) {
  let p = 0;
  let q = 0;
  let len1 = arr1.length;
  let len2 = arr2.length;
  const ret = [];
  while (p < len1 && q < len2) {
    if (arr1[p] < arr2[q]) {
      ret.push(arr1[p]);
      p++;
    } else {
      ret.push(arr2[q]);
      q++;
    }
  }
  return ret.concat(p < len1 ? arr1.slice(p) : arr2.slice(q));
}
console.log(mergeSort([1, 4, 7, 2, 3, 6]));
