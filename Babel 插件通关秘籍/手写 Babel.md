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

### parser 篇

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

### traverse 篇

- 目的
  - 遍历 AST，支持 visitor 的调用，在 visitor 里实现对 AST 的增删改
  - 实现简易的 traverse api

```javascript
// 不含path
traverse(ast, {
  Identifier(node) {
    node.name = "b";
  },
});
```

- 思路
  - 树的深度优先遍历（关联父子节点关系）
  - 可遍历 ast 的属性集合

```javascript
// 可遍历 ast 的属性集合
const astDefinationsMap = new Map();

astDefinationsMap.set("Program", {
  visitor: ["body"],
});
astDefinationsMap.set("VariableDeclaration", {
  visitor: ["declarations"],
});
astDefinationsMap.set("VariableDeclarator", {
  visitor: ["id", "init"],
});
astDefinationsMap.set("Identifier", {});
astDefinationsMap.set("NumericLiteral", {});
astDefinationsMap.set("FunctionDeclaration", {
  visitor: ["id", "params", "body"],
});
astDefinationsMap.set("BlockStatement", {
  visitor: ["body"],
});
astDefinationsMap.set("ReturnStatement", {
  visitor: ["argument"],
});
astDefinationsMap.set("BinaryExpression", {
  visitor: ["left", "right"],
});
astDefinationsMap.set("ExpressionStatement", {
  visitor: ["expression"],
});
astDefinationsMap.set("CallExpression", {
  visitor: ["callee", "arguments"],
});
```

- 实现 traverse （递归遍历）

```javascript
function traverse(node, visitors) {
  const defination = astDefinationsMap.get(node.type);

  if (defination.visitor) {
    defination.visitor.forEach((key) => {
      const prop = node[key];
      if (Array.isArray(prop)) {
        // 如果该属性是数组
        prop.forEach((childNode) => {
          traverse(childNode, visitors);
        });
      } else {
        traverse(prop, visitors);
      }
    });
  }
}
```

- 实现 visitor
  - visitor 支持 enter 和 exit 阶段

```javascript
function traverse(node, visitors) {
  // 可遍历 ast 集合
  const defination = astDefinationsMap.get(node.type);

  // 自定义 visitor 中，对应的处理
  let visitorFuncs = visitors[node.type] || {};

  // 默认未指定阶段（enter 和 exit），则为 enter 阶段调用
  if (typeof visitorFuncs === "function") {
    visitorFuncs = {
      enter: visitorFuncs,
    };
  }

  // 进入节点调用
  visitorFuncs.enter && visitorFuncs.enter(node);

  if (defination.visitor) {
    // 遍历当前 ast 的可遍历属性
    defination.visitor.forEach((key) => {
      const prop = node[key];
      // 递归遍历
      if (Array.isArray(prop)) {
        // 如果该属性是数组
        prop.forEach((childNode) => {
          traverse(childNode, visitors);
        });
      } else {
        traverse(prop, visitors);
      }
    });
  }

  // 遍历节点和子节点后调用
  visitorFuncs.exit && visitorFuncs.exit(node);
}
```

- enter 和 exit 的区别（enter -> traverse -> exit）
  - enter 阶段修改的节点，可遍历到
  - 可使用 path.skip 跳过遍历

### traverse --- path 篇

- path 作用

  - 记录遍历路径
  - 增删改 ast

- path 类

```javascript
class NodePath {
  constructor(node, parent, parentPath, key, listKey) {
    this.node = node; // 当前节点
    this.parent = parent; // 父节点
    this.parentPath = parentPath; // 父节点的path
    this.key = key; // 属性名
    this.listKey = listKey; // 属性下标

    // is函数写入
    Object.keys(types).forEach((key) => {
      if (key.startsWith("is")) {
        this[key] = types[key].bind(this, node);
      }
    });
  }

  // scope属性
  get scope() {}

  // 增删改...
  replaceWith() {}
}
```

- traverse 中传递 path

```javascript
function traverse(node, visitors, parent, parentPath) {
  // ...
  const path = new NodePath(node, parent, parentPath);

  // enter 和 exit 中传入 path
  enter(path);

  // 属性和子节点递归中传递 path
  traverse(childNode, visitors, node, path);
  // ...
}
```

- visitor 中使用 path

```javascript
traverse(ast, {
  Identifier: {
    exit(path) {
      // ...
    },
  },
});
```

- path.replaceWith

```javascript
replaceWith(node) {
  // 属性是数组
  if (this.listKey != undefined) {
    this.parent[this.key].splice(this.listKey, 1, node);
  } else {
    this.parent[this.key] = node
  }
}
```

- path.findParent
  - 顺着 path 链向上查找 AST

```javascript
findParent(callback) {
  let curPath = this.parentPath;
  while (curPath && !callback(curPath)) {
    curPath = curPath.parentPath;
  }
  return curPath;
}
```

- path.traverse
  - 遍历子节点，当前节点不执行 visitor 中的方法（不遍历当前节点）

```javascript
traverse(visitors) {
  const traverse = require("../index");
  const defination = types.visitorKeys.get(this.node.type);

  if (defination.visitor) {
    defination.visitor.forEach((key) => {
      const prop = this.node[key];
      if (Array.isArray(prop)) {
        // 如果该属性是数组
        prop.forEach((childNode, index) => {
          // this 为 path
          traverse(childNode, visitors, this.node, this);
        });
      } else {
        traverse(prop, visitors, this.node, this);
      }
    });
  }
}
```

- path.skip
  - 标记节点，遍历时跳过该节点的子节点遍历
