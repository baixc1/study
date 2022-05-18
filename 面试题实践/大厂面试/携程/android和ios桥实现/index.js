var window = window || {
  alert(...rest) {
    console.warn(...rest);
  },
};
window.WebViewJavascriptBridge = {
  hasHandler: () => false,
};

function callHandler(name, params, fallback) {
  return function (callback, ...rest) {
    const paramsList = {};
    for (let i = 0; i < params.length; i++) {
      paramsList[params[i]] = rest[i];
    }
    if (!callback) {
      callback = function (result) {};
    }
    if (fallback && !window.WebViewJavascriptBridge.hasHandler(name)) {
      fallback(paramsList, callback);
    } else {
      window.WebViewJavascriptBridge.callHandler(name, params, callback);
    }
  };
}

function fallback(params, callback) {
  let content = `${params.title}\n${params.content}`;
  window.alert(content);
  callback && callback(0);
}

function nativeAlert(title, content, cb) {
  return callHandler("alert", ["title", "content"], fallback)(
    cb,
    title,
    content
  );
}
nativeAlert(`this is title`, `hahaha`, function () {
  console.log("success");
});
