// https://www.jianshu.com/p/5314488cdd6e

// 获取一个websocket server对象
var WebSocketServer = require("ws").Server;
// 创建ws服务器
var ws = new WebSocketServer({
  port: 1234, // 监听的端口
});

// 处理连接
ws.on("connection", function (socket) {
  socket.onmessage = message;
  socket.send(JSON.stringify({ a: 1 }), function () {
    console.log("data has send");
  });
});

function message(msg) {
  //对接收到的消息做些什么
  console.log(msg.data);
}
