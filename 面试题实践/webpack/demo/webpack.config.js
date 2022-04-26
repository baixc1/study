const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    index: "./src/index.js",
    index1: "./src/index1.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        output: {
          beautify: true, // 不压缩代码
        },
        mangle: false, // 不混淆变量名
      },
    }),
  ],
};
