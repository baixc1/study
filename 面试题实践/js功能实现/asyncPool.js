const timeout = (i) =>
  new Promise((resolve) => setTimeout(() => resolve(i), i));

(async () => {
  var s = Date.now();
  const res = await asyncPool(2, [100, 600, 300, 400], timeout);
  // console.log(Date.now() - s);
  // console.log(res);
})();

// 方法一
// 接口并发控制
// 原理：for 循环中，使用 Promise.race + await + 实时异步任务 实现并发
async function asyncPool(poolLimit, array, iteratorFn) {
  const ret = []; // 存储所有任务的数组
  const currentArr = []; // 当前执行的任务数组

  for (let item of array) {
    // 获取结果的异步任务(返回Promise)
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);

    // 控制并发的异步任务
    const e = p.then(() => {
      currentArr.splice(currentArr.indexOf(e), 1);
    });
    currentArr.push(e);

    // 任务达到最大数时，先等待
    if (currentArr.length >= poolLimit) {
      await Promise.race(currentArr);
    }
  }
  return Promise.all(ret);
}

// 方法二（有问题：异步任务直接调用了）
const tasks = [1000, 1000, 1000].map(timeout);

// 闭包 + arr控制

// arr -> 接口数组
// max -> 最大并发数
const poll = (arr, max) => {
  const run = () => {
    if (!arr.length) return;
    const min = Math.min(arr.length, max);
    for (let i = 0; i < min; i++) {
      max--;
      const item = arr.shift();
      Promise.resolve(item)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          max++;
          run();
        });
    }
  };
  run();
};

poll(tasks, 2);
