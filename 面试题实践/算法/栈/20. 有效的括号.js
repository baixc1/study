/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  const dict = {
    "(": ")",
    "{": "}",
    "[": "]",
  };
  // 遍历字符串 s，依次入栈。消除有效括号
  const arr = [];
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (dict[char]) {
      // 左括号入栈
      arr.push(char);
    } else {
      // 右括号
      // 有效则消除，无效则返回false
      if (dict[arr[arr.length - 1]] === char) {
        arr.pop();
      } else {
        return false;
      }
    }
  }
  return arr.length === 0;
};

console.log(isValid("()[]{}"));
