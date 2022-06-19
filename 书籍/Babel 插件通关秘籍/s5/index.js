const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const types = require("@babel/types");

const sourceCode = `
    console.log(1);

    function func() {
        console.info(2);
    }

    export default class Clazz {
        say() {
            console.debug(3);
        }
        render() {
            return <div>{console.error(4)}</div>
        }
    }
`;

const ast = parser.parse(sourceCode, {
  sourceType: "unambiguous",
  plugins: ["jsx"],
});

const targetCalleeName = ["log", "info", "error", "debug"].map(
  (item) => `console.${item}`
);
traverse(ast, {
  // CallExpression(path, state) {
  //   if (
  //     types.isMemberExpression(path.node.callee) &&
  //     path.node.callee.object.name === "console" &&
  //     ["log", "info", "error", "debug"].includes(path.node.callee.property.name)
  //   ) {
  //     // console.log(1, path.node);
  //     const { line, column } = path.node.loc.start;
  //     path.node.arguments.unshift(
  //       types.stringLiteral(`filename: (${line}, ${column})`)
  //     );
  //   }
  // },
  CallExpression(path, state) {
    const calleeName = generate(path.node.callee).code;
    // console.log(2, path.get("callee").toString());
    if (targetCalleeName.includes(calleeName)) {
      const { line, column } = path.node.loc.start;
      path.node.arguments.unshift(
        types.stringLiteral(`filename: (${line}, ${column})`)
      );
    }
  },
});

const { code, map } = generate(ast);
console.log(code);
