// https://juejin.cn/post/6844903816060469262#heading-2
/**
 * 知识点
 * 1. 同源策略限制
 *    a. 数据存储 cookie storage indexedDB
 *    b. DOM iframe
 *    c. ajax fetch
 * 2. 跨域解决方案
 *    a. CORS Cross-origin resource sharing 简单请求/非简单请求
 *
 */

/**
 * cors 判定流程（服务端返回跨域配置给客户端判断？）
 * 1. 浏览器根据同源策略，发送数据请求 或 跨域请求（请求头 Origin）
 * 2. 服务端收到跨域请求后，判断是否允许跨域（响应头 Access-Control-Allow-Origin + 对应配置规则里的域名的方式 用于判断是否允许跨域）
 * 3. 浏览器根据 Access-Control-Allow-Origin + 对应配置规则里的域名的方式 判断是否允许跨域
 */

/**
 * 简单请求（同时满足下列条件）
 * 1. 使用 GET、POST、HEAD
 * 2. HTTP的头信息不超出 Accept、Accept-Language、Content-Language、Last-Event-ID、Content-Type
 * 3. Content-Type 只限于三个值 application/x-www-form-urlencoded、multipart/form-data、text/plain
 */

/**
 * 非简单请求
 * 1. 举例
 *    a. 请求方法 put 或 delete
 *    b. Content-Type 为 application/json
 * 2. 流程
 *    a. 预检请求（preflight），类型 OPTIONS
 *    b. 预检通过，发起 xhr 请求
 */

/**
 * JSONP
 * 1. 动态插入script标签（GET）
 * 2. 客户端定义全局回调函数，script脚本触发回调
 */

// 服务器代理

// document.domain

// postMessage

// location.hash
