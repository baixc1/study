const http = require("http");

http
  .createServer((req, res) => {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "http://localhost:8080",
      "Access-Control-Allow-Headers": "Xss-Token,Content-Type",
      "Access-Control-Allow-Methods": "PUT",
    });
    res.end(JSON.stringify({ name: "奇怪的栗子", age: 18 }));
  })

  .listen(3002, () => {
    console.log("[server] Server is running");
  });
