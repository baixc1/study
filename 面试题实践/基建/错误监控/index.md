### 知识点

- [学习链接](https://juejin.cn/post/6987681953424080926#heading-0)
- 5W1H

  - What
  - When
  - Who
  - Where
  - Why
  - How

- 架构层次

  - 搜集上报端
  - 采集聚合端
  - 可视化分析端
  - 监控告警端

- 搜集上报端（SDK）

  - 错误类型: JS 执行错误（语法、类型、引用、范围等）, 网络错误（资源、请求）
  - 搜集错误
    - try/catch
    - window.onerror: 监听 js 运行时 错误
    - addEventListener('error'): 监听 js 错误，资源加载失败错误（new Image 错误无法捕获）
    - 监听 unhandledrejection: 监听 Promise 错误
    - Vue 错误: 重写 Vue.config.errorHandler
    - React 错误: 错误边界组件（高阶组件），使用 componentDidCatch 钩子捕获错误
  - 跨域问题
    - 跨域脚本错误 Script error
    - 重写 EventTarget.prototype.addEventListener 方法，捕获具体错误（AOP）
  - 上报接口
    - 使用 new Image, POST 一个 1\*1 的 gif 进行上报
    - 优点：跨域、image 请求无需响应、不会携带 cookie、渲染无阻塞、体积最小
  - SDK 非阻塞加载

- 采集聚合端（日志服务器）
  - 错误标识（SDK 配合）, 错误 hash（id）, 错误阿斯克码值(errorKey)
  - 错误过滤（SDK 配合）, 域名过滤（e.filename）, 重复上报（errorKey）
  - 错误接收, 数据接受/校验，处理高并发（削峰机制-每秒阀值），采样处理
  - 错误存储
- 可视分析端（可视化平台）
  - 主功能
    - 首页图标，时间/数量分布和查询
    - 首页列表，查询筛选
    - 错误详细信息
  - 数量排行榜
  - SourceMap
    - 线上环境避免 source-map 泄露
    - hidden-source-map
- 错误报警
  - 报警阀值、轮训间隔
  - 钉钉 Hook
- 行为收集（重写函数或者直接监听）
  - UI 行为
  - 浏览器行为
  - 页面跳转
  - 日志
- 链路
  - SDK -> 接受端 -> 磁盘日志 -> 阿里云 SLS 采集 -> 可视化聚合
