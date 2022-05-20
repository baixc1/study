### wepack 按需加载与 ReactRouter

- 使用 import 函数动态加载（类似 jsonp）
- 使用 webpackChunkName 指定 chunk 名称

```javascript
import "./App.css";
import React, { PureComponent, createElement } from "react";
import { render } from "react-dom";
import { HashRouter, Route, Link } from "react-router-dom";

import PageHome from "./pages/home";

/**
 * 异步加载组件
 * @param load 组件加载函数，load 函数会返回一个 Promise，在文件加载完成时 resolve
 * @returns {AsyncComponent} 返回一个高阶组件用于封装需要异步加载的组件
 */
function getAsyncComponent(load) {
  return class AsyncComponent extends PureComponent {
    componentDidMount() {
      // 在高阶组件 DidMount 时才去执行网络加载步骤
      load().then(({ default: component }) => {
        // 代码加载成功，获取到了代码导出的值，调用 setState 通知高阶组件重新渲染子组件
        this.setState({
          component,
        });
      });
    }

    render() {
      const { component } = this.state || {};
      // component 是 React.Component 类型，需要通过 React.createElement 生产一个组件实例
      return component ? createElement(component) : null;
    }
  };
}
function App() {
  return (
    <HashRouter>
      <div>
        <nav>
          <Link to="/">Home</Link> | <Link to="/about">About</Link> |{" "}
          <Link to="/login">Login</Link>
        </nav>
        <hr />
        <Route exact path="/" component={PageHome} />
        <Route
          path="/about"
          component={getAsyncComponent(
            // 异步加载函数，异步地加载 PageAbout 组件
            () => import(/* webpackChunkName: 'page-about' */ "./pages/about")
          )}
        />
        <Route
          path="/login"
          component={getAsyncComponent(
            // 异步加载函数，异步地加载 PageAbout 组件
            () => import(/* webpackChunkName: 'page-login' */ "./pages/login")
          )}
        />
      </div>
    </HashRouter>
  );
}

export default App;
```

### Scope Hoisting

- 作用域提升
- 核心：多个模块合成一个
  - 限制：该模块只被引用一次
  - 必须使用 es6 模块
    - es6 模块是静态的语法，require 是动态的
    - babel 解析 js 代码是静态代码分析
- 作用
  - 减少代码/函数
  - 运行更快（减少函数调用）

```javascript
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "none",
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        output: {
          beautify: true, // 不压缩代码
        },
        // 不 treeshaking
        compress: false,
        mangle: false, // 不混淆变量名
      },
    }),
    // Scope Hoisting优化
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
};
```
