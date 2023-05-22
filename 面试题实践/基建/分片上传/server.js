/**
 * 1. connect-multiparty 生成临时文件（切片），使用完后删除
 * 2. 读取上传的blob，存储到指定路径
 * 3. 读取存取的片段，判断是否上传完成。上传完成，则合并文件并返回200，否则返回204
 */
var multipart = require("connect-multiparty");
const express = require("express");
const path = require("path");
const fs = require("fs");

var multipartMiddleware = multipart();
const app = express();
const port = 3000;

var uploadDir = "./upload/";

// 合并文件
function mergeFiles(fileName, fileParts) {
  // console.log("mergeFiles", fileName, fileParts);
  var buffers = [];

  // 获取各个部分的路径
  var filePartsPaths = fileParts.map(function (name) {
    return path.join(uploadDir, name);
  });

  // part排序
  filePartsPaths.sort((a, b) => {
    return Number(a.split(".part")[1]) - Number(b.split(".part")[1]);
  });
  // console.log("filePartsPaths", filePartsPaths);
  // 获取各个 part 的 buffer，并保存到 buffers 中
  filePartsPaths.forEach(function (path) {
    var buffer = fs.readFileSync(path);
    buffers.push(buffer);
  });
  // console.log(buffers);

  // 合并文件
  var concatBuffer = Buffer.concat(buffers);
  console.log(concatBuffer);
  var concatFilePath = path.join(uploadDir, fileName);
  fs.writeFileSync(concatFilePath, concatBuffer);

  // 删除各个 part 的文件
  filePartsPaths.forEach(function (path) {
    fs.unlinkSync(path);
  });
}

function upload(req, res) {
  if (req.method === "POST") {
    var data = req.body;
    // console.log(req.files);
    var _blobPath = req.files._blob.path; //  multipartMiddleware
    // console.log(_blobPath, data);
    var fileName = data.filename;
    var filePath;
    var total = parseInt(data.total);

    // 处理文件路径
    if (total === 1) {
      filePath = path.join(uploadDir, fileName);
    } else {
      var fileNameWithPart = fileName + ".part" + data.index;
      filePath = path.join(uploadDir, fileNameWithPart);
    }

    // 读取上传的数据，保存到指定路径
    var tmpBuffer = fs.readFileSync(_blobPath);
    fs.writeFileSync(filePath, tmpBuffer);

    // 判断是否上传完成
    if (total === 1) {
      res.sendStatus(200);
    } else {
      // 获取指定目录下的所有文件名
      var filesInDir = fs.readdirSync(uploadDir);
      // console.log(filesInDir);
      // 找出指定文件名中带有 .part 的文件
      var fileParts = filesInDir.filter(function (name) {
        return name.substring(0, fileName.length + 5) === fileName + ".part";
      });
      // 判断是否需要合并文件
      if (fileParts.length === total) {
        mergeFiles(fileName, fileParts);
        console.log(req.files);
        res.sendStatus(200);
      } else {
        res.sendStatus(204);
      }
    }
  } else {
    res.send(405);
  }
}

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type");
  next();
});
app.post("/upload", multipartMiddleware, upload);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
