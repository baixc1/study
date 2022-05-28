const fileListTxtWebpackPlugin = require("./fileList-txt-webpack-plugin");

module.exports = {
  entry: {
    a: "./src/a.js",
    index: "./src/index.js",
  },
  plugins: [new fileListTxtWebpackPlugin()],
};
