## 思路篇

### babel 的编译流程

- parse
  - 解析源码成 AST
  - @babel/parser
- transform
  - 遍历 AST 并调用 visitor 函数
    - @babel/types 创建、判断 AST
    - @babel/template 根据模块批量创建 AST
  - @babel/traverse
- generate
  - 打印 AST 成目标代码并生成 sourcemap
  - @babel/generate

### babel7 内置的其他包

- 功能入口
  - @babel/core
  - 解析配置、应用 plugin、preset，整体编译流程
- 插件和插件之间有一些公共函数
  - @babel/helpers
    - 转换 es next
    - \_typeof、\_defineProperties 等
  - @babel/helper-xxx
    - 插件之间共享函数
- 运行时公共函数
  - @babel/runtime
    - helper: helper 函数的运行时版本
    - corejs: es next 的 api 的实现
    - regenerator: async await 的实现, 由 facebook 维护
  - polyfill 借助了第三方的 corejs、regenerator
  - @babel/cli 命令行工具

### 需要实现的包

- parser
  - 基于 acorn
- traverse
  - 遍历所有类型 AST(类型定义在 @babel/types)
  - 调用对应的 visitor
- generate
  - 打印不同类型的 AST
  - 使用 source-map
- types
  - 创建 AST
  - 判断 AST 类型
- template
  - 批量创建 AST
  - 简易版: 传入字符串，parse 成 AST
- core
  - 支持 plugins 和 presets
  - 调用插件
  - 生成 visitors
  - traverse
- helper
  - 实现一些公共的函数
- runtime
  - 实现语法转换的辅助函数
- cli
  - 调用 core 包

## parser 篇

- 关系
  - estree 标准 -> acorn -> babel parser
  - acorn 支持插件，可以扩展语法，实现 babel parser
- 实现 parser 插件
  - 继承和重写 acorn 的 Parser， 返回新 Parser

```javascript
// Parser 类继承与重写
module.exports = function (Parser) {
  return class extends Parser {
    // 重写类的 parseLiteral 方法
    parseLiteral(...args) {
      // 调用父方法
      const node = super.parseLiteral(...args);
      // 功能增强
      switch (typeof node.value) {
        case "number":
          node.type = "NumericLiteral";
          break;
        case "string":
          node.type = "StringLiteral";
          break;
      }
      // 返回 ast 节点
      return node;
    }
  };
};
```

- 实现 parse 函数
  - acorn 的 Parser 继承与重写

```javascript
const acorn = require("acorn");

// 自定义插件枚举，parser 时 传入 plugins 启用
const syntaxPlugins = {
  literal: require("./plugins/literal"),
  guangKeyword: require("./plugins/guangKeyword"),
};

// 默认插件列表
const defaultOptions = {
  plugins: [],
};

function parse(code, options) {
  // 合并配置项
  const resolvedOptions = Object.assign({}, defaultOptions, options);
  // 扩展 acorn.Parser 类，增强功能
  const newParser = resolvedOptions.plugins.reduce((Parser, pluginName) => {
    let plugin = syntaxPlugins[pluginName];
    // 链式调用插件
    return plugin ? Parser.extend(plugin) : Parser;
  }, acorn.Parser);
  // 返回扩展后的 acorn.Parser 的 parse 方法调用
  return newParser.parse(code, {
    locations: true, // 保留 AST 在源码中的位置信息，用于 sourcemap
  });
}

module.exports = {
  parse,
};

// 调用
const ast = parser.parse(sourceCode, {
  plugins: ["literal", "guangKeyword"],
});
```
