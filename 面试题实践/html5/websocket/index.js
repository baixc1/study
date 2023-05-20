// https://juejin.cn/post/7020964728386093093#heading-0

/**
 * WebSocket
 * 1. WebSocket 是在单个 TCP 连接上进行全双工通讯的协议
 *    a. 一次握手（握手时使用HTTP传输数据）（101升级）
 *    b. 持久性连接
 *    c. 双向数据传输（http2 只能推送静态资源）
 * 2. 应用层协议 ws
 * 3. 没有同源限制
 * 4. WebSocket 握手
 *    a. 请求头
 *      Upgrade: websocket
 *      Connection: Upgrade
 *      Sec-Websocket-Extensions
 *      Sec-Websocket-Key
 *      Sec-Websocket-Version
 *    b. 响应头
 *      Upgrade: websocket
 *      Connection: Upgrade
 *      Sec-Websocket-Accept
 * 5. 优缺点
 *    a. 优点：请求头体积小，服务端推送（替代http轮询）
 *    b. 缺点：浏览器兼容性（IE10）
 * 6. 应用场景（需服务端推送场景，实时数据更新场景）
 *    a. 即时聊天
 *    b. 多玩家游戏
 *    c. 在线协同编辑/编辑
 *    d. 实时数据流的拉取与推送
 *    e. 体育/游戏实况
 *    f. 实时地图位置
 *    g. 即时Web应用程序
 *    h. 游戏应用程序
 */

// https://juejin.cn/post/6945057379834675230
/**
 * 心跳机制与断线重连(实现)
 * demo: heart-beat
 * 1. 基本功能（websocket 通信）
 * 2. 服务端
 *    a. 扩展 ws 的Server类，初始化变量和事件监听（见webSocketServer.handleUpgrade）
 * 3. 客户端
 *    a. 新增连接/发送/关闭功能（事件注册与按钮状态变更）
 *    b. 使用eventBus统一管理按钮事件（设置样式/重新请求）
 * 4. 心跳功能
 *    a. 客户端定时放送请求，如果按时返回（未超时），则未断开，继续该流程。否则已断开，重连（startHeartBeat/reconnectWebSocket）
 *    b. 服务端根据 ModeCode 区分请求类型（心跳/常规请求）
 */
