/**
 * Promise.all 实现
 * param: Array<any>
 * return: Promise
 */
Promise.all = function (list) {
  return new Promise((resolve, reject) => {
    const res = [];
    const len = list.length;
    let p = 0;
    // let 作用域
    for (let i = 0; i < len; i++) {
      Promise.resolve(list[i])
        .then((data) => {
          res[i] = data;
          p++;
          if (p === len) {
            resolve(res);
          }
        })
        .catch(reject);
    }
  });
};
Promise.all([Promise.resolve(1), Promise.reject(2)]).catch((d) =>
  console.log(d)
);
Promise.all([sleep(1, 2), sleep(2, 3), Promise.resolve(4)]).then((d) =>
  console.log(d)
);

function sleep(n, num) {
  return new Promise((r) => {
    setTimeout(() => {
      r(num);
    }, n * 1000);
  });
}
