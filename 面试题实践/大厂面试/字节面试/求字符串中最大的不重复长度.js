/**
 * 3. 无重复字符的最长子串
 * 思路：滑动窗口问题（双端队列）
 * 滑动窗口模型：窗口内数组（最值开始的单调递增/减数组）（不重复元素的数组）
 * 实现：滑动窗口开始长度为0，遍历字符串，加入新元素。若该元素不重复则窗口右侧右移，否则
 * 窗口左侧右移, 直至无重复元素。计算窗口的最大值
 */
var lengthOfLongestSubstring = function (s) {
  const len = s.length;
  let max = 0;
  const dict = {}; // 滑动窗口内的数据枚举（无重复）
  let left = 0; // 窗口左侧下标
  for (let i = 0; i < len; i++) {
    const char = s[i];
    // 元素重复时，left右移直至无重复
    while (dict[char]) {
      dict[s[left]] = false;
      left++;
    }
    dict[char] = true;
    max = Math.max(max, i - left + 1);

    console.log(
      "i:",
      i,
      "char:",
      char,
      "dict:",
      dict,
      "left:",
      left,
      "max:",
      max
    );
  }
  return max;
};
console.log(lengthOfLongestSubstring("pwwkew"));
