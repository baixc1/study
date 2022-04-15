// 232. 用栈实现队列
// 原理： 使用双栈
var MyQueue = function () {
  this.stack1 = []; // 入栈容器
  this.stack2 = []; // 出栈容器
};

/**
 * @param {number} x
 * @return {void}
 */
MyQueue.prototype.push = function (x) {
  this.stack1.push(x);
};

/**
 * @return {number}
 */
MyQueue.prototype.pop = function () {
  // 出栈容器没数据时，把入栈容器的数据入栈到出栈容器
  if (!this.stack2.length) {
    while (this.stack1.length) {
      this.stack2.push(this.stack1.pop());
    }
  }
  return this.stack2.pop();
};

/**
 * @return {number}
 */
MyQueue.prototype.peek = function () {
  if (!this.stack2.length) {
    while (this.stack1.length) {
      this.stack2.push(this.stack1.pop());
    }
  }
  return this.stack2[this.stack2.length - 1];
};

/**
 * @return {boolean}
 */
MyQueue.prototype.empty = function () {
  return !this.stack1.length && !this.stack2.length;
};

/**
 * Your MyQueue object will be instantiated and called as such:
 * var obj = new MyQueue()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.peek()
 * var param_4 = obj.empty()
 */
var obj = new MyQueue();
obj.push(1);
obj.push(2);
obj.push(3);
console.log(obj);
var param_2 = obj.pop();
console.log(obj, param_2);
obj.push(4);
var param_3 = obj.peek();
console.log(obj, param_3);
var param_4 = obj.empty();
console.log(obj, param_4);
