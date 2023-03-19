/**
 * 中心扩散法
 * 1. 遍历每个位置
 * 2. 向两边扩散，不是回文时停止，记录最大长度和位置
 */

/**
 * 一个位置的最大回文
 * 1. 首先往左寻找与当期位置相同的字符，直到遇到不相等为止
 * 2. 然后往右寻找与当期位置相同的字符，直到遇到不相等为止
 * 3. 最后左右双向扩散，直到左和右不相等
 */

/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
  let maxLen = 0;
  let curLen = 1;
  let maxStart = 0;
  for (let i = 0; i < s.length; i++) {
    let left = i - 1;
    let right = i + 1;

    while (left >= 0 && s[left] === s[i]) {
      left--;
      curLen++;
    }
    while (right < s.length && s[right] === s[i]) {
      right++;
      curLen++;
    }
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
      curLen += 2;
    }
    if (curLen > maxLen) {
      maxLen = curLen;
      maxStart = left;
    }
    curLen = 1;
  }
  return s.substring(maxStart + 1, maxStart + 1 + maxLen);
};

console.log(longestPalindrome(""));
