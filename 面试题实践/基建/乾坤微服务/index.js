// https://juejin.cn/post/7107841837675020302#heading-2

/**
 * 总应用初始化调用链路
 * 1. registerMicroApps
 * 2. loadApp
 * 3. importEntry -> importHTML 解析子应用html(import-html-entry)
 * 4. createSandboxContainer -> ProxySandbox 创建沙箱（隔离/还原全局环境）
 * 5. execScripts -> _execScripts(import-html-entry) 将子应用的window挂载到根应用的window.proxy上，通过eval执行script
 */

/**
 * 1. 通过fetch(url).(res=>res.text()) 获取子应用的html
 * 2. 子应用html解析与修改（资源提取）
 */
export default function importHTML(url) {
  // ...
  return (
    embedHTMLCache[url] ||
    (embedHTMLCache[url] = fetch(url)
      .then(function (response) {
        return readResAsString(response, autoDecodeResponse);
      })
      // 获取html
      .then(function (html) {
        var assetPublicPath = getPublicPath(url);

        // script/style 资源提取（不直接请求，走execScripts/getExternalStyleSheets等）（为了修改资源相关的字符串）
        var _processTpl = processTpl(getTemplate(html), assetPublicPath),
          template = _processTpl.template,
          scripts = _processTpl.scripts,
          entry = _processTpl.entry,
          styles = _processTpl.styles;

        return getEmbedHTML(template, styles, {
          fetch: fetch,
        }).then(function (embedHTML) {
          return {
            template: embedHTML,
            assetPublicPath: assetPublicPath,
            getExternalScripts: function getExternalScripts() {
              return _getExternalScripts(scripts, fetch);
            },
            getExternalStyleSheets: function getExternalStyleSheets() {
              return _getExternalStyleSheets(styles, fetch);
            },
            // proxy代理对象
            execScripts: function execScripts(proxy, strictGlobal) {
              // ...

              return _execScripts(entry, scripts, proxy, {
                fetch: fetch,
                strictGlobal: strictGlobal,
                beforeExec: execScriptsHooks.beforeExec,
                afterExec: execScriptsHooks.afterExec,
              });
            },
          };
        });
      }))
  );
}

/**
 * ProxySandbox多例沙箱
 * 1. createFakeWindow 创建沙箱
 */

var ProxySandbox = /*#__PURE__*/ (function () {
  function ProxySandbox(name) {
    var _this = this;

    //...
    var _createFakeWindow = createFakeWindow(rawWindow),
      fakeWindow = _createFakeWindow.fakeWindow, // 沙箱全局变量
      propertiesWithGetter = _createFakeWindow.propertiesWithGetter;
    // ...

    // fakeWindow代理
    var proxy = new Proxy(fakeWindow, {
      set: function set(target, p, value) {},
      get() {},
      has() {},
      getOwnPropertyDescriptor() {},
      ownKeys() {},
      defineProperty() {},
      deleteProperty() {},
    });
    this.proxy = proxy;
    activeSandboxCount++;
  }

  _createClass(ProxySandbox, [
    {
      key: "active",
      value: function active() {},
    },
    {
      key: "inactive",
      value: function inactive() {},
    },
  ]);

  return ProxySandbox;
})();

// 创建fakeWindow（拷贝window）
function createFakeWindow(global) {
  var propertiesWithGetter = new Map();
  var fakeWindow = {};

  Object.getOwnPropertyNames(global)
    .filter(function (p) {
      // ...
    })
    .forEach(function (p) {
      //...

      rawObjectDefineProperty(fakeWindow, p, Object.freeze(descriptor));
    });
  return {
    fakeWindow: fakeWindow,
    propertiesWithGetter: propertiesWithGetter,
  };
}

// 批量执行js（通过eval）schedule -> exec -> geval -> getExecutableScript
function _execScripts(entry, scripts) {
  // ...
  return _getExternalScripts(scripts, fetch, error).then(function (
    scriptsText
  ) {
    var geval = function geval(scriptSrc, inlineScript) {
      var code = getExecutableScript(scriptSrc, rawCode, proxy, strictGlobal);
      (0, eval)(code); // 执行eval
    };

    function exec(scriptSrc, inlineScript, resolve) {
      // ...
      geval(scriptSrc, inlineScript);
      // ...
    }

    function schedule(i, resolvePromise) {
      if (i < scripts.length) {
        // ...
        exec(scriptSrc, inlineScript, resolvePromise); // resolve the promise
      }
    }

    return new Promise(function (resolve) {
      return schedule(0, success || resolve);
    });
  });
}

// 通过with执行eval(所有操作在window.proxy上)
function getExecutableScript(scriptSrc, scriptText, proxy, strictGlobal) {
  // ...

  var globalWindow = (0, eval)("window");
  globalWindow.proxy = proxy; // TODO 通过 strictGlobal 方式切换切换 with 闭包，待 with 方式坑趟平后再合并

  return strictGlobal
    ? ";(function(window, self, globalThis){with(window){;"
        .concat(scriptText, "\n")
        .concat(
          sourceUrl,
          "}}).bind(window.proxy)(window.proxy, window.proxy, window.proxy);"
        )
    : ";(function(window, self, globalThis){;"
        .concat(scriptText, "\n")
        .concat(
          sourceUrl,
          "}).bind(window.proxy)(window.proxy, window.proxy, window.proxy);"
        );
}

// https://github.com/li1164267803/qiankun-demo
/**
 * 1. 子应用暴露接口 bootstrap、mount、unmount
 * 2. 路由 activeRule
 * 3. 请求子应用时，需在子应用配置跨域
 */
