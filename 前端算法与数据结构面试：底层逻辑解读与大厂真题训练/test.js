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

// console.log("abc".split().reverse().join(""));

// 左右对称
function isPalindrome(str) {
  const len = str.length;
  for (let i = 0; i < len / 2; i++) {
    if (str[i] !== str[len - 1 - i]) {
      return false;
    }
  }
  return true;
}
// console.log(isPalindrome("ababa"));
// console.log(isPalindrome("abb"));

/**
 * 680. 验证回文字符串 Ⅱ :给定一个非空字符串 s，最多删除一个字符。判断是否能成为回文字符串。
 */
// 实现：双指针（对撞指针）往中遍历，不对称时(i,j)，判断(i+1,j)或(i,j-1)是否是回文
var validPalindrome = function (s) {
  const len = s.length;
  let l = 0;
  let r = len - 1;
  // 对称部分
  while (l < r && s[l] === s[r]) {
    l++;
    r--;
  }
  // 判断(l+1,r)或(l,r-1)是否是回文
  if (isPalindrome(l + 1, r) || isPalindrome(l, r - 1)) {
    return true;
  }
  return false;

  // 判断字符串s在下表[i,j]间是否是回文
  function isPalindrome(i, j) {
    while (i < j) {
      if (s[i] !== s[j]) return false;
      i++;
      j--;
    }
    return true;
  }
};

/**
 * leetcode 211 
 * 请你设计一个数据结构，支持 添加新单词 和 查找字符串是否与任何先前添加的字符串匹配 。
实现词典类 WordDictionary ：
WordDictionary() 初始化词典对象
void addWord(word) 将 word 添加到数据结构中，之后可以对它进行匹配
bool search(word) 如果数据结构中存在字符串与 word 匹配，则返回 true ；否则，返回  false 。word 中可能包含一些 '.' ，每个 . 都可以表示任何一个字母。
 */
// 使用对象记录，key为词长度，值为添加词的数组。
// search时，先判断长度是否满足，再判断是否有正则(.)，最后遍历数组用正则判断
var WordDictionary = function () {
  this.words = {};
};

/**
 * @param {string} word
 * @return {void}
 */
WordDictionary.prototype.addWord = function (word) {
  const len = word.length;
  if (!this.words[len]) {
    this.words[len] = [];
  }
  this.words[len].push(word);
};

/**
 * @param {string} word
 * @return {boolean}
 */
WordDictionary.prototype.search = function (word) {
  const len = word.length;
  const ws = this.words[len];
  // 长度判断
  if (!ws) return false;
  // 是否有点
  if (word.indexOf(".") === -1) return ws.includes(word);
  // 遍历ws，正则判断
  const reg = new RegExp(word);
  return ws.some((w) => reg.test(w));
};
