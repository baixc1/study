const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const sourceCode = `
    console.log(1);
`;

const ast = parser.parse(sourceCode, {
  sourceType: "unambiguous",
  plugins: ["jsx"],
});

traverse(ast, {
  CallExpression(path, state) {
    console.log(path);
    // console.log(path.node);
  },
});
