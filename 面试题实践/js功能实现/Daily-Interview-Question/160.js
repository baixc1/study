// 第 160 题：输出以下代码运行结果，为什么？如果希望每隔 1s 输出一个结果，应该如何改造？
// 注意不可改动 square 方法

const list = [1, 2, 3, 4, 5];
// 高阶函数
const square = (num) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(num * num);
    }, 1000);
  });
};

let p = Promise.resolve();
function test(i = 0) {
  p = p.then((val) => {
    if (i !== 0) {
      console.log(val);
    }
    return square(list[i]);
  });
  if (i >= list.length) return;
  test(i + 1); // 尾递归函数
}
test();
console.log("end");
