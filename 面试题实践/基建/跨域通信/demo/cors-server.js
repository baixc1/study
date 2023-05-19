// https://juejin.cn/post/6901838829217382407#heading-6
// https://developer.aliyun.com/article/389705
const express = require("express");
const app = express();

//设置允许跨域访问该服务.
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8081");
  // res.header("Access-Control-Allow-Headers", "Content-Type");
  // 允许所有方法跨域
  res.header("Access-Control-Allow-Methods", "*");
  // res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.put("/put", function (req, res) {
  res.send("Hello put");
});

app.listen(3000);
