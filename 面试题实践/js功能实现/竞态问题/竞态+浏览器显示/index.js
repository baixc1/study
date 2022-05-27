function autoCancel(fn) {
  const cancelSymbol = Symbol("cancel");
  let running;
  return async function (...args) {
    // 取消上一次请求
    console.log("running", running);
    if (running) {
      running();
      running = null;
    }
    // 请求竞态
    const ret = await Promise.race([
      fn.apply(this, args),
      (() => {
        return new Promise((resolve) => {
          running = resolve.bind(null, cancelSymbol);
        });
      })(),
    ]);
    return ret === cancelSymbol ? null : ret;
  };
}

const sleep = (s) => {
  return new Promise((r) => {
    setTimeout(r, s);
  });
};

// 多次调用的接口
async function test(i, sleepMs) {
  console.log("task", i, "will take", sleepMs, "ms");
  await sleep(sleepMs);
  console.log("task", i, "finished after", sleepMs, "ms");
  return [i, sleepMs].join(" ");
}

const autoCancelTest = autoCancel(test);
const arr = new Array(10).fill(1);
arr.forEach(async (_, i) => {
  console.log(await autoCancelTest(i, (10 - i) * 1000));
});
