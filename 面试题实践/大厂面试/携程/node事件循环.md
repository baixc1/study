- setTimeout 和 setImmediate
  - libuv 引擎事件循环：timers->I/O callbacks -> idle,prepare -> poll -> check -> close callbacks

```javascript
// check -> timer
setImmediate(() => {
  const now = Date.now();
  setTimeout(function timeout() {
    console.log("timeout");
  }, 9);
  setImmediate(function immediate() {
    console.log("immediate");
  });
  while (Date.now() - now < 10) {}
});
// timer -> check
setTimeout(() => {
  const now = Date.now();
  setTimeout(function timeout() {
    console.log("timeout");
  }, 9);
  setImmediate(function immediate() {
    console.log("immediate");
  });
  while (Date.now() - now < 10) {}
});
// 不确定
setTimeout(function timeout() {
  console.log("timeout");
});
setImmediate(function immediate() {
  console.log("immediate");
});
```

- poll 阶段

  - 回到 timer 阶段执行回调
  - 执行 I/O 回调
  - 清空 poll 队列
  - 有 setImmediate 则进入 check 阶段，没有则会等待一会

- 宏任务中，微任务的执行顺序

```javascript
// timer和promise输出，和node版本有关
setTimeout(() => {
  console.log("timer1");
  Promise.resolve().then(function () {
    console.log("promise1");
  });
}, 10);
setTimeout(() => {
  console.log("timer2");
  Promise.resolve().then(function () {
    console.log("promise2");
  });
}, 10);
```

- process.nextTick 比 promise 先执行

```javascript
Promise.resolve(1).then((v) => console.log(1));
process.nextTick((v) => console.log(3));
```
