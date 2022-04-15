/**
 * 20. 有效的括号
 */
var isValid = function (s) {
  // 左/右括号的对应关系
  const leftToRight = {
    "(": ")",
    "[": "]",
    "{": "}",
  };
  const stack = [];
  let i = 0;
  const len = s.length;
  while (i < len) {
    const char = s[i];
    // 如果是左括号
    if (leftToRight[char]) {
      stack.push(leftToRight[char]);
    } else {
      if (char !== stack.pop()) {
        // 对称性比较
        return false;
      }
    }
    i++;
  }
  return !stack.length;
};

/**
 * 739. 每日温度
 * 原理：维护一个存储下标的单调递减栈，栈中元素表示尚未找到更高温度元素
 */
var dailyTemperatures = function (temperatures) {
  const len = temperatures.length;
  const ans = new Array(len).fill(0);
  const queue = [];

  // 遍历温度列表，当前元素温度大于栈顶元素时，出栈/求ans[i](循环)，小于时压栈
  for (let i = 0; i < len; i++) {
    const temp = temperatures[i];
    while (queue.length && temp > temperatures[queue[queue.length - 1]]) {
      const prev = queue.pop();
      ans[prev] = i - prev;
    }
    queue.push(i);
  }
  return ans;
};

/**
 * 155. 最小栈
 */

var MinStack = function () {
  this.stack = [];
  this.minStack = [];
};

/**
 * @param {number} val
 * @return {void}
 */
MinStack.prototype.push = function (val) {
  this.stack.push(val);
  // 若入栈的值小于当前最小值，则推入辅助栈栈顶
  if (!this.minStack.length || this.minStack[this.minStack.length - 1] >= val) {
    this.minStack.push(val);
  }
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function () {
  // 弹出最小值时，更新最小值栈
  if (this.stack.pop() === this.minStack[this.minStack.length - 1]) {
    this.minStack.pop();
  }
};

/**
 * @return {number}
 */
MinStack.prototype.top = function () {
  return this.stack[this.stack.length - 1];
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function () {
  return this.minStack[this.minStack.length - 1];
};

/**
 * Initialize your data structure here.
 */
var MyQueue = function () {
  this.inArr = [];
  this.outArr = [];
};

/**
 * Push element x to the back of queue.
 * @param {number} x
 * @return {void}
 */
MyQueue.prototype.push = function (x) {
  this.inArr.push(x);
};

/**
 * Removes the element from in front of queue and returns that element.
 * @return {number}
 */
MyQueue.prototype.pop = function () {
  if (!this.outArr.length) {
    this.in2out();
  }
  return this.outArr.pop();
};

/**
 * Get the front element.
 * @return {number}
 */
MyQueue.prototype.peek = function () {
  if (!this.outArr.length) {
    this.in2out();
  }
  return this.outArr[this.outArr.length - 1];
};

/**
 * Returns whether the queue is empty.
 * @return {boolean}
 */
MyQueue.prototype.empty = function () {
  return !this.inArr.length && !this.outArr.length;
};

MyQueue.prototype.in2out = function () {
  while (this.inArr.length) {
    this.outArr.push(this.inArr.pop());
  }
};
