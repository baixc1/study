const http = require("http");
http
  .createServer(function (request, response) {
    console.log("request come", request.url);
    response.writeHead(200, {
      // "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Origin": "http://localhost:3001",
      "Access-Control-Allow-Origin": "http://localhost:8080",
      "Access-Control-Allow-Credentials": true,
    });
    response.end("123");
  })
  .listen(3000);
