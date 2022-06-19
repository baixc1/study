const { codeFrameColumns } = require("@babel/code-frame");

const code = `
const a = 1
const b = 2
`;

const res = codeFrameColumns(
  code,
  {
    start: { line: 2, column: 0 },
    end: { line: 2, column: 4 },
  },
  {
    highlightCode: true,
    forceColor: true,
    message: "这里出错了",
  }
);

// console.log(res);
console.log(
  "\033[0m \033[90m 1 |\033[39m\033[0m\n\033[0m\033[31m\033[1m>\033[22m\033[39m\033[90m 2 |\033[39m \033[36mconst\033[39m a \033[33m=\033[39m \033[35m1\033[39m\033[0m\n\033[0m \033[90m   |\033[39m \033[31m\033[1m^\033[22m\033[39m\033[31m\033[1m^\033[22m\033[39m\033[31m\033[1m^\033[22m\033[39m\033[31m\033[1m^\033[22m\033[39m \033[31m\033[1m这里出错了\033[22m\033[39m\033[0m\n\033[0m \033[90m 3 |\033[39m \033[36mconst\033[39m b \033[33m=\033[39m \033[35m2\033[39m\033[0m\n\033[0m \033[90m 4 |\033[39m\033[0m"
);
