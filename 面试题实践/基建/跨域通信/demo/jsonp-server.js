// https://juejin.cn/post/6901838829217382407#heading-6
// https://developer.aliyun.com/article/389705
const express = require("express");
const app = express();

app.get("/getinfo.js", function (req, res, next) {
  var _data = { email: "example@163.com", name: "jaxu" };
  res.type("application/json");
  res.jsonp(_data);
});

app.listen(3001);
