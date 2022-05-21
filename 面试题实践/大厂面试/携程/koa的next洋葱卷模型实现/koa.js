const { compose } = require("./compose");

class Koa {
  constructor() {
    this.middleware = [];
  }

  use(fn) {
    // 维护中间件数组——middleware
    this.middleware.push(fn);
    return this;
  }

  listen(...args) {
    // node http 创建一个服务
    const server = require("http").createServer(this.callback());
    return server.listen(...args);
  }
  callback() {
    // 返回值是一个函数
    const fn = compose(this.middleware);
    const handleRequest = (req, res) => {
      // 创建 ctx 上下文环境
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };
    return handleRequest;
  }
  createContext(req, res) {
    return {
      req,
      res,
      onerror() {},
    };
  }

  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    const onerror = (err) => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    // onFinished(res, onerror);
    // 执行 compose 中返回的函数，将结果返回
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
    function respond(ctx) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.write(`${ctx.req.url}`);
      res.end();
    }
  }
}

//Applications
const app = new Koa();

app.use(async (ctx, next) => {
  // 过滤favicon请求
  if (ctx.req.url === "/favicon.ico") {
    ctx.res.end();
  } else {
    next();
  }
});
// 中间件1
app.use(async (ctx, next) => {
  console.log(1);
  await next();
  console.log(2);
});

// 中间件 2
app.use(async (ctx, next) => {
  console.log(3);
  await new Promise((r) => {
    setTimeout(r, 3000);
  });
  next();
  console.log(4);
});

app.listen(9000, "0.0.0.0", () => {
  console.log(`Server is starting`);
});
