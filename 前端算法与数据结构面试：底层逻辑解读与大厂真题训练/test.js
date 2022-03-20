var twoSum = function (nums, target) {
  // 记录遍历过的数组项及其下标
  const dict = {};
  const len = nums.length;
  for (let i = 0; i < len; i++) {
    // 判断差值（目标值与当前值）是否存在（是否已遍历）
    if (dict[target - nums[i]] !== undefined) {
      return [dict[target - nums[i]], i];
    }
    dict[nums[i]] = i;
  }
};

/**
 * letcode 88：给你两个按 非递减顺序 排列的整数数组 nums1 和 nums2，另有两个整数 m 和 n ，分别
 * 表示 nums1 和 nums2 中的元素数目。请你 合并 nums2 到 nums1 中，使合并后的数组同样按 非递减顺序 排列。
 */
var merge = function (nums1, m, nums2, n) {
  // 双指针记录nums1,nums2，从后往前遍历有效值
  let p = m - 1;
  let q = n - 1;
  const len1 = nums1.length;
  // 从后往前遍历num1
  for (let i = len1 - 1; i >= 0; i--) {
    // nums2 遍历完成
    if (q < 0) break;
    // num1 遍历完成（可以和下面合成）
    if (p < 0) {
      nums1[i] = nums2[q];
      q--;
      continue;
    }
    // 比较num1和nums2
    if (nums1[p] >= nums2[q]) {
      nums1[i] = nums1[p];
      p--;
    } else {
      nums1[i] = nums2[q];
      q--;
    }
  }
};

/**
 * letcode15：给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。
 */
// 实现：转为求差问题，固定一个数，在剩余数中寻找满足条件的两个数（使用左右指针 - 左指针从左往右，右指针从右往左寻找）
var threeSum = function (nums) {
  if (nums.length < 3) {
    return [];
  }
  // 排序
  nums = nums.sort((a, b) => a - b);
  const ret = [];
  const len = nums.length;
  // 遍历到倒数第三个元素
  for (let i = 0; i < len - 2; i++) {
    let p = i + 1; // 左指针
    let q = len - 1; // 右指针
    // 去除重复解（子集）
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }
    while (p < q) {
      const sum = nums[i] + nums[p] + nums[q];
      if (sum < 0) {
        p++;
        // 左指针重复，跳过
        while (p < q && nums[p - 1] === nums[p]) {
          p++;
        }
      } else if (sum > 0) {
        q--;
        // 右指针重复，跳过
        while (p < q && nums[q] === nums[q + 1]) {
          q--;
        }
      } else {
        ret.push([nums[i], nums[p], nums[q]]);
        p++;
        q--;
        // 答案重复
        while (p < q && nums[p - 1] === nums[p]) {
          p++;
        }
        while (p < q && nums[q] === nums[q + 1]) {
          q--;
        }
      }
    }
  }
  return ret;
};
console.log(threeSum([-1, 0, 1, 2, -1, -4]));
