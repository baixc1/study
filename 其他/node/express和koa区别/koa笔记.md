- koa-compose 原理

```javascript
/**
 * koa-compose 模拟
 * 关键点：
 *    1. 高阶函数，接收中间件列表，返回函数的参数为 ctx, next
 *    2. 调用返回函数，依次执行中间件，返回promise（递归，嵌套promsie）
 */
function compose(middleware) {
  return function (ctx, next) {
    return dispatch(0);
    // 递归函数，依次调用中间件，返回 promise
    function dispatch(i) {
      const fn = middleware[i];
      // 递归终止条件
      if (!fn) return Promise.resolve();
      // 递归式
      return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));
    }
  };
}

// 中间件 fn1 和 fn2
async function fn1(ctx, next) {
  console.log("第一个start");
  await next();
  console.log("第一个 end");
  return "xx";
}
async function fn2(ctx, next) {
  console.log("第二个 start");
  await next();
  console.log("第二个 end");
}
// 模拟中间件数组
const arr = [fn1, fn2];
// 执行函数，这里返回的是一个 Promise 对象
// compose(arr)().then((v) => console.log(v));

// 实际调用 mycompose = compose(arr)
function mycompose() {
  return function (ctx) {
    return Promise.resolve(
      fn1(ctx, () => {
        return Promise.resolve(
          fn2(ctx, () => {
            return Promise.resolve();
          })
        );
      })
    );
  };
}
// 第一个调用传递ctx，第二个调用开始执行fn1...
mycompose()().then((v) => console.log(v));
```

- reduce 实现函数嵌套调用

```javascript
// middleware中间件函数嵌套调用，fn1(fn2(fn3(...)))
// 高阶函数, reduce实现嵌套调用
function compose1(middleware) {
  // 返回一个函数
  return middleware.reduce((a, b) => {
    return (arg) => a(b(arg));
  });
}

const f1 = (a) => a + 1;
const f2 = (a) => {
  console.log("f2");
  return a * 2;
};
const f3 = (a) => a + 100;
// f1(f2(f3(1)))
const fn = compose([f1, f2, f3]);
fn(1);
```
