### TLS 握手

- 客户端请求服务端证书（包含服务端公钥，hash 函数？，签名等）
- 第一次非对称加密（解密），用 CA 的公钥解密证书签名，如果解出来的 hash 和证书信息 hash 一致则合法
- 第二次非对称加密，客户端使用服务端公钥加密随机数
- 服务端使用服务端私钥解密随机数
- 使用随机数进行对称加密
