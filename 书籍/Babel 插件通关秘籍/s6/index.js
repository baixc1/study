const acorn = require("acorn");

const Parser = acorn.Parser;
const TokenType = acorn.TokenType;

Parser.acorn.keywordTypes["guang"] = new TokenType("guang", {
  keyword: "guang",
});

var guangKeyword = function (Parser) {
  return class extends Parser {
    parse(program) {
      let newKeywords =
        "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this const class extends export import super";
      newKeywords += " guang";
      this.keywords = new RegExp(
        "^(?:" + newKeywords.replace(/ /g, "|") + ")$"
      );
      return super.parse(program);
    }

    parseStatement(context, topLevel, exports) {
      var starttype = this.type;

      if (starttype == Parser.acorn.keywordTypes["guang"]) {
        // 创建一个新的AST节点
        var node = this.startNode();
        return this.parseGuangStatement(node);
      } else {
        return super.parseStatement(context, topLevel, exports);
      }
    }

    parseGuangStatement(node) {
      // 消费掉这个 token
      this.next();
      // 返回新的 AST 节点
      return this.finishNode({ value: "guang" }, "GuangStatement"); //新增加的ssh语句
    }

    parseLiteral(...args) {
      const node = super.parseLiteral(...args);
      switch (typeof node.value) {
        case "number":
          node.type = "NumericLiteral";
          break;
        case "string":
          node.type = "StringLiteral";
          break;
      }
      return node;
    }
  };
};
const newParser = Parser.extend(guangKeyword);

var program = `
    guang
    const a = 1
`;

const ast = newParser.parse(program);
console.log(ast.body[1].declarations);
