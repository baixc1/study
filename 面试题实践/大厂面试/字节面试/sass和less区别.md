### Sass 和 SCSS

- Sass 是 Haml 的一部分，Haml 是基于 Ruby 的预处理器
- Sass 使用类似 Ruby 的语法
  - 没有花括号、分号
  - 变量使用 !而不是 $
  - 分配符是 = 而不是 :
  - 严格的缩紧
- SCSS
  - Sass3 即 SCSS
  - Sassy CSS
  - 兼容 CSS
  - 语义化（@mixin, @include），易于阅读

```sass
// Variable
!primary-color= hotpink

// Mixin
=border-radius(!radius)
    -webkit-border-radius= !radius
    -moz-border-radius= !radius
    border-radius= !radius

.my-element
    color= !primary-color
    width= 100%
    overflow= hidden

.my-other-element
    +border-radius(5px)
```

```scss
// Variable
$primary-color: hotpink;

// Mixin
@mixin border-radius($radius) {
  -webkit-border-radius: $radius;
  -moz-border-radius: $radius;
  border-radius: $radius;
}

.my-element {
  color: $primary-color;
  width: 100%;
  overflow: hidden;
}

.my-other-element {
  @include border-radius(5px);
}
```

### Sass 和 Less

- 相同
  - 动态样式语言（变量，继承，运算，函数，作用域等）
  - 混合（Mixins）
  - 嵌套（Nesting）
  - @规则嵌套和冒泡
  - 运算（Operations）
- 不同
  - 编译环境不同
    - Sass 在服务端处理，Ruby, Dart-Sass, Node-Sass
    - Less 引入 less.js 处理代码，也可以在开发者服务器将 less 转化为 css
    - sass-loader, less-loader
  - 变量符不同
  - sass 有输出设置（嵌套，压缩，简洁，展开）
  - sass 支持条件/循环语句
  - sass 引用外部文件，以 \_ 开头的文件，不会编译成 css 文件（直接引入）
  - sass 有工具库 Compass, Less 有 UI 组件库 Bootstrap
  - npm 安装 sass 需翻墙（ruby 需翻墙）
  - sass 功能比 less 强大，是真正的编程语言
