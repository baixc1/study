## JS 调用 Android 方法

### 方法一：通过 WebView 的 addJavascriptInterface 进行对象映射

- 核心

  - Android 对象 和 JS 对象 映射，使用简单
  - 缺点：存在漏洞

- Android 暴露对象和方法

```java
public class JsInterface {
    @JavascriptInterface
    public void callAndroid(String value) {
      // ...
    }
}

webView.addJavascriptInterface(new JsInterface(this), "launcher");
```

- JS 访问 Android 方法

```javascript
if (window.launcher) {
  launcher.callAndroid();
}
```

### 方法二：Android 拦截 url 请求

- 核心
  - WebViewClient 的 shouldOverrideUrlLoading 方法
  - 拦截请求，约定特殊的开头作为 js 调用原生的情况
  - 不存在漏洞
  - JS 不好获取返回值

### 方法三：拦截 JS 的对话框消息

- 核心
  - WebChromeClient 的 onJsAlert 等
  - JS 的 alert, confirm, prompt

## Android 调用 JS 方法

- 通过 WebView 的 loadUrl()
  - 会刷新页面，效率低
- 通过 WebView 的 evaluateJavascript()
  - 不会刷新页面，效率高
  - Android 4.4 后可用
- 可搭配 [Android 拦截 url 请求] 一起使用
  - 设置 window 对象的回调函数
  - 请求 url，Android 处理后调用回调函数
- Android 代码

```java
// Android 调用 JS 方法
webView.loadUrl("javascript:if(window.callJS){window.callJS('" + str + "');}");

if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
    webView.evaluateJavascript("javascript:if(window.callJS){window.callJS('" + str + "');}", new ValueCallback<String>() {
        @Override
        public void onReceiveValue(String value) {
            Log.e("TAG", "--------->>" + value);
        }
    });
}

```
