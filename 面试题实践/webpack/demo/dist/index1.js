(() => {
  "use strict";
  var _counter1__WEBPACK_IMPORTED_MODULE_0__,
    __webpack_modules__ = {
      3: (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__),
          // 定义拦截器，获取动态的num
          __webpack_require__.d(__webpack_exports__, {
            increase: () =>
              function () {
                return num++;
              },
            num: () => num,
          });
        let num = 1;
      },
    },
    __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (void 0 !== cachedModule) return cachedModule.exports;
    cachedModule = __webpack_module_cache__[moduleId] = {
      exports: {},
    };
    return (
      __webpack_modules__[moduleId](
        cachedModule,
        cachedModule.exports,
        __webpack_require__
      ),
      cachedModule.exports
    );
  }
  (__webpack_require__.d = (exports, definition) => {
    for (var key in definition)
      __webpack_require__.o(definition, key) &&
        !__webpack_require__.o(exports, key) &&
        Object.defineProperty(exports, key, {
          enumerable: !0,
          get: definition[key],
        });
  }),
    (__webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop)),
    (__webpack_require__.r = (exports) => {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(exports, Symbol.toStringTag, {
          value: "Module",
        }),
        Object.defineProperty(exports, "__esModule", {
          value: !0,
        });
    })({}),
    (_counter1__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3)),
    console.log(_counter1__WEBPACK_IMPORTED_MODULE_0__.num),
    (0, _counter1__WEBPACK_IMPORTED_MODULE_0__.increase)(),
    console.log(_counter1__WEBPACK_IMPORTED_MODULE_0__.num);
})();
