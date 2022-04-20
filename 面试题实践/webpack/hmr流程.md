### HMR 流程

- webpack 打包代码到内存中，并 watch。
- webpack 和 webpack-dev-server(S) 的中间件（webpack-dev-middleware）交互（访问代码，监听代码变化）
- 编译完后（done），dev-server(S) 发送 hash 给浏览器（websocket 长连接）
- dev-server(S)/client 接收 hash,接收 OK 后，发送 hash 给 webpack 客户端（webpackHotUpdate）
- webpack 接收 hash 后验证并请求模块代码
  - webpack/hot/dev-server(C) 接收 hash
  - dev-server(C)调用 runtime(webpack/lib/HotModuleReplacement.runtime) 的 check 方法检查更新
  - runtime 通过 ajax 获取更新列表（hotDownloadManifest），通过 jsonp 请求最新代码（hotDownloadUpdateChunk）
- 。。。
