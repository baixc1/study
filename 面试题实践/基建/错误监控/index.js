const originAddEventListener = EventTarget.prototype.addEventListener;
// 劫持原生方法（获取准确的报错信息）（无侵入）
EventTarget.prototype.addEventListener = function (type, listener, options) {
  const wrappedListener = function (...args) {
    try {
      return listener.apply(this, args);
    } catch (err) {
      // 捕获具体错误
      throw err;
    }
  };
  return originAddEventListener.call(this, type, wrappedListener, options);
};

window.onerror = function (message, url, line, column, error) {
  console.log(message, url, line, column, error);
};

// unhandledrejection
window.addEventListener("unhandledrejection", (e) => {
  console.log(e);
  // 定制化e.reason，上报具体错误信息
});

// errorKey(随机数)
const errorKey = `${+new Date()}@${randomString(8)}`;

function randomString(len) {
  len = len || 32;
  let chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  let maxPos = chars.length;
  let pwd = "";
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

// errorKey(通过message、colno与lineno进行相加计算阿斯克码值)
const eventKey = compressString(
  String(e.message),
  String(e.colno) + String(e.lineno)
);

function compressString(str, key) {
  let chars = "ABCDEFGHJKMNPQRSTWXYZ";
  if (!str || !key) {
    return "null";
  }
  let n = 0,
    m = 0;
  for (let i = 0; i < str.length; i++) {
    n += str[i].charCodeAt();
  }
  for (let j = 0; j < key.length; j++) {
    m += key[j].charCodeAt();
  }
  let num =
    n +
    "" +
    key[key.length - 1].charCodeAt() +
    m +
    str[str.length - 1].charCodeAt();
  if (num) {
    num = num + chars[num[num.length - 1]];
  }
  return num;
}

// 行为收集机制

// 记录点击事件及其触发dom链
const _breadcrumbEventHandle = (eName) => {
  return (e) => {
    // 点击元素不变
    if (this._lastCaptureEvent === e) return;
    this._lastCaptureEvent = e;
    // 获取根目录到当前dom的链路
    const target = getStringByDomLayer(e.target);

    // 收集行为信息
    self._captureBreadcrumb({
      category: `ui.${eName}`,
      msg: target,
    });
  };
};

// 记录xhr请求

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  // ... 原有功能
  self._captureBreadcrumb({
    type: `http`,
    category: "xhr",
    data: xhr,
  });
};

// 记录页面跳转行为
let oldOnPopState = window.onpopstate;
window.onpopstate = function (...args) {
  // 收集行为信息
  self._captureUrlChange(self._lastHref, location.href);
  // 继续原有功能...
};
