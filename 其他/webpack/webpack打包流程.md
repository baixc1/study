### 打包流程

- 初始化参数
  - 合并配置文件和 Shell 中参数
- 开始编译
  - 初始化 compiler 对象和插件
  - 执行 run 方法
- 确定入口
- 编译模块
  - 使用 loader 翻译文件
  - 递归模块依赖，执行编译
- 完成编译
  - 得到编译后模块内容及其依赖关系
- 输出资源
  - 根据模块依赖，组装 chunk 并加入到输入文件列表
- 输出完成
  - 写入文件

### 构建主要流程

- compile（run）
  - 构建 compilation 对象
- make
  - 初始化 module 对象
- build-module
  - 调用 loaders，将模块转化为 js 模块
  - 计算依赖模块列表
- seal
  - 生成 chunks 并优化，最后生成输出代码
  - 三种 chunk
    - 入口
    - import()
    - 公共代码提取
- emit
  - 输出文件前
