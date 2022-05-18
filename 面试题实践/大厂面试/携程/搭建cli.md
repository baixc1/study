### 搭建 cli

- 基本流程
  - 输入命令 -> 选择模版 -> 调取模版 -> 创建文件
- package.json 配置
  - bin 属性配置全局命令及其入口脚本
  - npm link 生成全局命令
- 脚本入口
  - #!/usr/bin/env node 声明为 node 环境
  - 使用 commander, inquirer 等插件读取命令，生成文件
- 模版与配置编写
  - 编写代码模版（可使用远程的）
  - 编写生成项目的配置文件
- inquirer
  - 和用户对话，获取用户的选择或输入

```javascript
inquirer
  .prompt([
    {
      name: "templateName",
      type: "list",
      message: "请选择你想要生成的代码模板：",
      choices: templates,
    },
    {
      name: "filename",
      type: "input",
      message: "请输入代码文件中类名或方法名：",
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "请输入代码文件中类名或方法名";
        }
      },
    },
  ])
  .then((resObj) => {
    console.log(resObj);
  });
```

- fs
  - 判断是否有同名文件
  - 生成文件/目录
- commander
  - command 生成命令
  - alias 命令别名
  - action 设置该命令执行的回调函数
  - description 帮助中命令的描述
  - version 设置查看版本的返回值和命令参数

```javascript
#!/usr/bin/env node

const { program } = require("commander");

program.version(require("../package").version, "-v, --version");

program
  .command("create")
  .description("Create a file")
  .alias("c")
  .action(() => {
    require("../command/createFile")();
  });

program
  .command("create-many")
  .description("Create many folders and files")
  .alias("cm")
  .action(() => {
    require("../command/createManyFiles")();
  });
```

- 批量、递归生成目录

```javascript
fileList.forEach(mkdirsSync);
// 递归创建目录 同步方法
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    // 先创建父目录
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
    }
  }
}
```

### vue-cli 的搭建

- figlet
  - 在终端生成艺术字体
- chalk
  - 设置字体颜色和背景
- download-git-repo
  - 从 node 下载并提取 git 仓库(GitHub、 GitLab、 Bitbucket)
- util.promisify
  - node 内置，异步调用封装成 promise
- ora
  - 加载状态的效果
- child_process.spawn
  - 子进程运行命令（安装依赖，项目启动）
  - 对接输入流

```javascript
// 对接输出流
const promisitySpawn = async (...args) => {
  const { spawn } = require("child_process");
  return new Promise((resolve) => {
    const proc = spawn(...args);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    proc.on("close", () => {
      resolve();
    });
  });
};
```
