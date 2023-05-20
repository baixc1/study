// 自定义websocket

const WebSocket = require("ws");

class WebSocketServer extends WebSocket.Server {
  constructor() {
    super(...arguments);
    this.webSocketClient = {}; //存放已连接的客户端
  }

  set ws(val) {
    //代理当前的ws，赋值时将其初始化
    this._ws = val;
    val.t = this;
    val.on("error", this.errorHandler);
    val.on("close", this.closeHandler);
    val.on("message", this.messageHandler);
  }

  get ws() {
    return this._ws;
  }

  messageHandler(e) {
    // 必须转换，否则返回客户端的是buffer
    e = JSON.stringify(JSON.parse(e));
    let data = JSON.parse(e);
    switch (data.ModeCode) {
      case "message":
        console.log("收到消息" + data.msg);
        this.send(e);
        break;
      case "heart_beat":
        console.log(`收到${this.name}心跳${data.msg}`);
        this.send(e);
        break;
    }
  }

  errorHandler(e) {
    this.t.removeClient(this);
    console.info("客户端出错");
  }

  closeHandler(e) {
    this.t.removeClient(this);
    console.info("客户端已断开");
  }

  addClient(item) {
    //设备上线时添加到客户端列表
    if (this.webSocketClient[item["name"]]) {
      console.log(item["name"] + "客户端已存在");
      this.webSocketClient[item["name"]].close();
    }
    console.log(item["name"] + "客户端已添加");
    this.webSocketClient[item["name"]] = item;
  }

  removeClient(item) {
    //设备断线时从客户端列表删除
    if (!this.webSocketClient[item["name"]]) {
      console.log(item["name"] + "客户端不存在");
      return;
    }
    console.log(item["name"] + "客户端已移除");
    this.webSocketClient[item["name"]] = null;
  }
}

exports.WebSocketServer = WebSocketServer;
