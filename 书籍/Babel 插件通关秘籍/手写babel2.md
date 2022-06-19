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
  - 添加 mapping 信息
  - ast 转化为 代码
- 使用 source-map 包生成 sourcemap

```javascript
const { SourceMapGenerator } = require("source-map");
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
  - 可生成 编译后代码和 sourcemap

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

## core 篇

### 概念

- 作用：串联整个编译流程，实现 plugin 和 preset
- 调用方式
  - transformSync 实现 parse、traverse、generate 和 plugin、 preset

```javascript
const { code, map } = transformSync(sourceCode, {
  parserOpts: {
    plugins: ["xx"],
  },
  fileName: "xx.js",
  plugins: [[plugin1, {}]],
  presets: [],
});
```

- preset：插件的合集
- babel 顺序：先 plugin 后 preset，plugin 从前往后、preset 从后往前

### 实现

```javascript
function transformSync(code, options) {
  // parse 阶段
  const ast = parser.parse(code, options.parserOpts);

  // 内置的API
  const pluginApi = {
    template,
  };
  const visitors = {};
  // 遍历plugins 和 presets ，合成 visitors(相同类型ast合并？)
  options.plugins &&
    options.plugins.forEach(([plugin, options]) => {
      const res = plugin(pluginApi, options);
      Object.assign(visitors, res.visitor);
    });
  options.presets &&
    options.presets.reverse().forEach(([preset, options]) => {
      const plugins = preset(pluginApi, options);
      plugins.forEach(([plugin, options]) => {
        const res = plugin(pluginApi, options);
        Object.assign(visitors, res.visitor);
      });
    });

  // 遍历 ast
  traverse(ast, visitors);
  // 生成源码
  return generate(ast, code, options.fileName);
}
```

## cli 篇

### 知识

- npm link

  - 作用：到本地项目，链接本地 npm 包（npm 包调试）
  - npm 全局包路径
    - {prefix}/lib/node_modules/<package>
    - 获取 prefix
      - npm config get prefix
    - xx 包 目录下，执行 npm link，在全局生成 xx 的快捷方式
  - 本地开发时
    - 执行 npm link xx，在本地 node_modules 生成 xx 包的快捷方式
    - 本地依赖直接 映射 到 本地 xx 包
  - #!/usr/bin/env node
    - 在环境变量 PATH 中查找 node
    - 命令行启动时，添加在 js 中

- commander 解析命令行参数

```javascript
// 命令行执行：my-babel ./input/*.js --out-dir ./dist --watch

const commander = require("commander");

commander.option("--out-dir <outDir>", "输出目录");
commander.option("--watch", "监听文件变动");

// 命令行参数过滤
commander.parse(process.argv);

// 输出 { outDir: './dist', watch: true }
commander.opts();

/*
 当前目录结构
  - input
    - input1.js
    - input2.js
*/
// 输出 [ './input/input1.js', './input/input2.js' ]
commander.args;

// 输出帮助信息
commander.outputHelp();
```

- glob.sync
  - 使用 shell 的方式模糊匹配文件
- cosmiconfig
  - 查找配置文件
  - explorerSync.search().config 输出配置文件对象
- chokidar
  - 监听文件的变动
  - 变动后重新编译

### cli 实现

- commander 解析命令行参数（输出目录，是否监听）
- 获取 babel 配置文件信息
- 根据 glob 获取源码，编译后输出源码和 map
- 监听文件变化，变化后重新编译

```javascript
// 命令行运行，指定 node
#!/usr/bin/env node
const commander = require("commander");
const { cosmiconfigSync } = require("cosmiconfig");
const glob = require("glob");
const myBabel = require("../core");
const fsPromises = require("fs").promises;
const path = require("path");

// 获取命令行参数
commander.option("--out-dir <outDir>", "输出目录");
commander.option("--watch", "监听文件变动");

commander.parse(process.argv);
const cliOpts = commander.opts();

// 监听文件变化
if (cliOpts.watch) {
  const chokidar = require("chokidar");

  chokidar.watch(commander.args[0]).on("all", (event, path) => {
    console.log("检测到文件变动，编译：" + path);
    compile([path]);
  });
}

// 源码路径
const filenames = glob.sync(commander.args[0]);

// 获取Babel配置文件
const explorerSync = cosmiconfigSync("myBabel");
const searchResult = explorerSync.search();

const options = {
  babelOptions: searchResult.config,
  cliOptions: {
    ...cliOpts,
    filenames,
  },
};

// 编译文件
function compile(fileNames) {
  fileNames.forEach(async (filename) => {
    // 读取源码
    const fileContent = await fsPromises.readFile(filename, "utf-8");
    const baseFileName = path.basename(filename);
    // sourcemap 文件名
    const sourceMapFileName = baseFileName + ".map.json";

    // 解析/转换/生成源码
    const res = myBabel.transformSync(fileContent, {
      ...options.babelOptions,
      fileName: baseFileName,
    });
    // 添加sourcemap映射
    const generatedFile =
      res.code + "\n" + "//# sourceMappingURL=" + sourceMapFileName;

    const distFilePath = path.join(options.cliOptions.outDir, baseFileName);
    const distSourceMapPath = path.join(
      options.cliOptions.outDir,
      baseFileName + ".map.json"
    );

    // 生成目录
    try {
      await fsPromises.access(options.cliOptions.outDir);
    } catch (e) {
      await fsPromises.mkdir(options.cliOptions.outDir);
    }
    // 输出dist
    await fsPromises.writeFile(distFilePath, generatedFile);
    await fsPromises.writeFile(distSourceMapPath, res.map);
  });
}

compile(options.cliOptions.filenames);
```
