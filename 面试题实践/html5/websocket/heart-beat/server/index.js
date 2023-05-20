// https://juejin.cn/post/6945057379834675230

// const { WebSocketServer } = require("ws");

// const wss = new WebSocketServer({ port: 1024 });

// wss.on("connection", function connection(ws) {
//   ws.on("error", console.error);

//   ws.on("message", function message(data) {
//     console.log("received: %s", Object.keys(JSON.parse(data)));
//     ws.send(JSON.stringify(JSON.parse(data)));
//   });
// });

const { WebSocketServer } = require("./websocketServer");
const port = 1024; //端口
const pathname = "/ws/"; //访问路径
const http = require("http");
const server = http.createServer();
const webSocketServer = new WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  //通过http.server过滤数据
  let url = new URL(req.url, `http://${req.headers.host}`);
  let name = url.searchParams.get("name"); //获取连接标识
  // if (!checkUrl(url.pathname, pathname)) {
  //   //未按标准
  //   socket.write("未按照标准访问");
  //   socket.destroy();
  //   return;
  // }
  webSocketServer.handleUpgrade(req, socket, head, function (ws) {
    ws.name = name;
    //添加索引，方便在客户端列表查询某个socket连接
    webSocketServer.addClient(ws);
    webSocketServer.ws = ws;
  });
});

server.listen(port, () => {
  console.log("服务开启");
});

//验证url标准
function checkUrl(url, key) {
  //判断url是否包含key（按位取反）
  return ~url.indexOf(key);
}
