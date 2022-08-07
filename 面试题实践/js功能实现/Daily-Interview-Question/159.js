// 第 159 题：实现 Promise.retry，成功后 resolve 结果，失败后重试，尝试超过一定次数才真正的 reject

Promise.retry = function (promiseFn, times = 3) {
  return new Promise((resolve, reject) => {
    try {
    } catch (e) {
      if (times === 0) {
        reject(e);
      }
    }
  });
};

// promise 请求模拟
function getProm() {
  const n = Math.random();
  return new Promise((resolve, reject) => {
    setTimeout(() => (n > 0.9 ? resolve(n) : reject(n)), 1000);
  });
}
//
Promise.retry(getProm)
  .then((v) => console.log("success", v))
  .catch((v) => {
    console.log("error", v);
  });
