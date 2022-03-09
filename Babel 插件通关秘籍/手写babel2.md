## traverse -- scope 篇

### 概念

- path.scope 中记录着作用域相关的数据

  - 函数作用域、全局作用域、块级作用域
  - 作用域链（链表）
  - 变量的声明（bindings）和引用（reference）

- 能生成 scope 的 AST 叫做 block
- 应用：删除无效 js 代码(tree shaking)

### 实现

- Binding 类和 Scope 类

```javascript
// 声明类（记录作用域中的所有声明）
class Binding {
  constructor(id, path, scope, kind) {
    this.id = id;
    this.path = path;
    this.referenced = false;
    this.referencePaths = [];
  }
}

// 作用域类，注册、查找、判断声明
class Scope {
  constructor(parentScope, path) {
    this.parent = parentScope;
    this.bindings = {};
    this.path = path;

    // 初始化 bindings
    path.traverse({
      //...
    });

    // binding 的 reference 赋值
    path.traverse({
      //...
    });
  }

  registerBinding(id, path) {}

  getOwnBinding(id) {}
  // 沿作用域查找
  getBinding(id) {}

  hasBinding(id) {}
}
```

- path 类中 定义 scope 的 get 方法
  - 遍历耗时，用到时创建（get）

```javascript
get scope() {
  if (this.__scope) {
    return this.__scope;
  }
  // 能生成 scope 的 AST 叫做 block
  const isBlock = this.isBlock();
  // 父作用域
  const parentScope = this.parentPath && this.parentPath.scope;
  return this.__scope = isBlock ? new Scope(parentScope, this) : parentScope;
}
```

- 注册 bindings

```javascript
// 初始化 scope 时，注册bindings
path.traverse({
  VariableDeclarator: (childPath) => {
    this.registerBinding(childPath.node.id.name, childPath);
  },
  FunctionDeclaration: (childPath) => {
    // 函数声明，跳过子节点（函数体）的遍历
    childPath.skip();
    this.registerBinding(childPath.node.id.name, childPath);
  },
});
```

- bindings 的引用
  - 设置 referenced 和 referencePaths 属性

```javascript
// 初始化 scope 时，遍历所有 标志符 （Identifier）
path.traverse({
  Identifier: (childPath) => {
    // 排除声明语句
    if (
      !childPath.findParent(
        (p) => p.isVariableDeclarator() || p.isFunctionDeclaration()
      )
    ) {
      const id = childPath.node.name;
      // 根据 标志符id，延作用域 查找 binding
      const binding = this.getBinding(id);
      if (binding) {
        binding.referenced = true;
        binding.referencePaths.push(childPath);
      }
    }
  },
});
```

- 应用：删除掉未被引用的变量
  - 删除 referenced 为 false 的节点

```javascript
traverse(ast, {
  // 全局作用域
  Program(path) {
    // 遍历作用域内的变量声明
    Object.entries(path.scope.bindings).forEach(([id, binding]) => {
      // 擦除未被引用的变量
      if (!binding.referenced) {
        binding.path.remove();
      }
    });
  },
  // 函数作用域
  FunctionDeclaration(path) {
    Object.entries(path.scope.bindings).forEach(([id, binding]) => {
      if (!binding.referenced) {
        binding.path.remove();
      }
    });
  },
});
```

## generator 篇

### 概念

- 作用：打印 AST 为目标代码，并生成 sourcemap
- sourcemap 记录源码位置和目标代码位置的关联（mapping）
  - parse 时获取源码位置
  - 打印时获取目标代码位置
  - sourcemap 由 mapping 组成
- 实现：遍历 ast ， 拼接字符串生成代码

### 实现
- 打印类
  - 记录生成的源码（buf）
  - 记录代码的起始位置（行、列）
  - 添加mapping信息
  - ast 转化为 代码
- 使用 source-map 包生成 sourcemap

```javascript
const { SourceMapGenerator } = require('source-map');
class Printer {
  constructor(source, fileName) {
    this.buf = ""; // 记录源码的字符串
    this.sourceMapGenerator = new SourceMapGenerator({
      file: fileName + ".map.json",
    }); //  sourcemap 生成器
    this.fileName = fileName;
    this.sourceMapGenerator.setSourceContent(fileName, source);
    // 生成源码的位置
    this.printLine = 1; 
    this.printColumn = 0;
  }

  addMapping(node) {
    if (node.loc) {
      // sourcemap 添加 mapping
      this.sourceMapGenerator.addMapping({
        // 编译后位置
        generated: {
          line: this.printLine,
          column: this.printColumn,
        },
        source: this.fileName,
        // 原始位置
        original: node.loc && node.loc.start,
      });
    }
  }

  // 打印换行
  nextLine() {
    this.buf += "\n";
    this.printLine++;
    this.printColumn = 0;
  }

  // 打印 root（递归遍历）
  Program(node) {
    this.addMapping(node);
    node.body.forEach((item) => {
      this[item.type](item) + ";";
      this.printColumn++;
      this.nextLine();
    });
  }

  // 打印二进制表达式（a+b）
  BinaryExpression(node) {
    this.addMapping(node);

    this[node.left.type](node.left);
    this.buf += node.operator;
    this[node.right.type](node.right);
  }

  // 打印其他 ast
  // ...
}
```

- Generator 类实现
  - 继承 打印类
  - 可生成 编译后代码和sourcemap

```javascript
class Generator extends Printer {
  // 实例化打印类
  constructor(source, fileName) {
    super(source, fileName);
  }

  // 生成编译后代码和sourcemap
  generate(node) {
    this[node.type](node);
    return {
      code: this.buf,
      map: this.sourceMapGenerator.toString(),
    };
  }
}

function generate(node, source, fileName) {
  return new Generator(source, fileName).generate(node);
}
```
- 生成的源码中添加 sourceMappingURL ，映射之前的源码

```javascript
//# sourceMappingURL=./xxx.map.json
```
