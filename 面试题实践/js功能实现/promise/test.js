// resolvePromise(promise2, x, resolve, reject)
// x 为对象
Promise.resolve({ a: 1 }).then((x) => console.log(x));
Promise.resolve(() => console.log(1)).then((x) => console.log(x));
console.log("end");
