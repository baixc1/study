(() => {
    var __webpack_modules__ = [ , module => {
        let num = 1;
        module.exports = {
            num: num,
            increase: function() {
                return num++;
            }
        };
    } ], __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        cachedModule = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        return __webpack_modules__[moduleId](cachedModule, cachedModule.exports, __webpack_require__), 
        cachedModule.exports;
    }
    {
        const {
            num,
            increase
        } = __webpack_require__(1);
        console.log(num), increase(), console.log(num);
    }
})();