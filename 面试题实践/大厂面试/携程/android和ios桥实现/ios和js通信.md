### 知识点

- IOS8 之前使用 UIWebView，之后使用 WKWebView
  - WKWebView 性能较好
  - 对 js 和 html5 的支持更好

### iOS 与 JS 交互的方法

- 拦截 url
  - 核心：js 运行与原生的 webview 上，js 的相关 API，native 底层做了封装
  - 适用于 UIWebView 和 WKWebView
- JavaScriptCore
  - 只适用于 UIWebView，iOS7+
- WKScriptMessageHandler
  - WKWebView 特有
- WebViewJavascriptBridge
  - 第三方框架
  - 适用于 UIWebView 和 WKWebView

### 拦截 url

- 原生使用 UIWebView
- web 调用原生
  - 定义好协议 url，原生监听请求的 url 并处理
  - 类似 jsonp 请求

```java
- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType{
    if ([request.URL.absoluteString hasPrefix:@"jxaction://scan"]) {
        //调用原生扫描二维码
       return NO;
    }
    return YES;
}
```

- 原生调用 web
  - 调用回调函数

```java
[self.webView stringByEvaluatingJavaScriptFromString:@"scanResult('我是扫描结果~')"];
```

### JavaScriptCore

- Safari 的 JavaScript 引擎
- IOS7+
- 优雅地实现 js 和原生交互
  - url 的方式需要拼接参数，编码特殊字符
- js 调用原生

  - UIWebView 加载后，可以把 AppJSObject 实例对象注入到 js 中
  - js 可直接调用原生方法（对象映射）

- native 注册 web 对象（app）

```java
-(void)webViewDidFinishLoad:(UIWebView *)webView
{
    JSContext *context=[webView valueForKeyPath:@"documentView.webView.mainFrame.javaScriptContext"];

    AppJSObject *jsObject = [AppJSObject new];
    jsObject.delegate = self;
    context[@"app"] = jsObject;
}
```

- AppJSObject.m 暴露 scan 方法

```java
#import "AppJSObject.h"

@implementation AppJSObject
-(void)scan:(NSString *)message{
    [self.delegate scan:message];
}
@end
```

- h5 调用

```javascript
app.scan("scanResult");
```

- 原生调用 js
  - 通过方法一中的方法
  - 通过 JSCore 中的 JSContext

### WKScriptMessageHandler

- WKWebView 不支持 WKWebView
- WKWebView 有 WKScriptMessageHandler
- h5 调用 native

```javascript
window.webkit.messageHandlers.scan.postMessage();
```

- native 监听 scan 事件的调用

```javascript
- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message{
    if ([message.name isEqualToString:@"scan"]) {
        //调用原生扫码
     }
}
```

- iOS 调用 JS
  - 与方法一中的方法一样
- 问题： 退出页面后，WKWebView 未释放

### WebViewJavascriptBridge 和 DSBridge

- 三方库
- 跨平台，三端易用
- 双向调用
- android 支持 x5 内核
- 支持同步／异步调用
