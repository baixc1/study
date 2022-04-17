### HTTP 缓存

- Web 缓存减少了等待时间和网络流量
- 缓存种类：私有缓存（浏览器缓存）和共享缓存（代理缓存）
- 缓存操作的目标：GET 请求（文件，图片）
- 缓存控制
  - Cache-control 头
    - HTTP/1.1
    - no-store 没有缓存
    - no-cache 缓存但重新验证(协商缓存)
    - public 可被中间人缓存
    - private
    - max-age=<seconds> 过期时间
    - must-revalidate 资源过期时必须验证
  - Pragma 头
    - 和 no-cache 相同
    - http1.0
- 新鲜度
  - 缓存驱逐（请求时触发）
  - expires 响应头
    - 格式：时间
    - 问题：浏览器和服务器时间可能不一致（少用）
  - last-modified 头
  - if-modified-since 头
    - 时间
  - If-None-Match 头
    - hash 值
    - 304 表示值是新鲜的
  - Etag 响应头
  - age 响应头
  - date 响应头
- 改进资源
  - revving 技术（文件 hash）

### 强缓存和协商缓存

- 类型判断：是否需要和服务器通信
- 强缓存
  - 200（from disk cache），200（from memory cache）
- 协商缓存
  - 304 (not modified)
- 判断流程
  - 根据 响应中的 cache-control 和 expires 判断是否使用强缓存
  - 如果是强缓存，取缓存
  - 如果是协商缓存，则发送请求（请求头包含 IF-Modified-Since：Last-Modified 或者 IF-None-Match： Etag）
    - 如果命中，返回 304，取缓存
    - 否则实际请求，更新缓存字段
- Last-Modified 问题
  - 内容不变，改变修改时间时。不希望被认为是修改
  - 只能精确到秒
- Etag > Last-Modified

### 缓存是否过期

- freshness_lifetime（缓存最大有效时间） - current_age（缓存已经存在的时间）
- freshness_lifetime 优先级
  - s-maxage（适用于 public） > max-age > expires > (DownloadTime - LastModified)\*10%
- current_age
  - age > date?
