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
// 微任务输出，和node版本有关
// 和node事件阶段有关
setTimeout(function timeout() {
  console.log("timeout");
  Promise.resolve(1).then((v) => console.log(21));
  process.nextTick(() => console.log("n1"));
});
setImmediate(function immediate() {
  console.log("immediate");
  Promise.resolve(1).then((v) => console.log(22));
  process.nextTick(() => console.log("n2"));
});
setImmediate(function immediate() {
  console.log("immediate2");
  Promise.resolve(1).then((v) => console.log(2));
  process.nextTick(() => console.log("n3"));
});
```

- process.nextTick 比 promise 先执行

```javascript
Promise.resolve(1).then((v) => console.log(1));
process.nextTick((v) => console.log(3));
```
