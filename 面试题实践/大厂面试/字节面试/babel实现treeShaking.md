### 示例一：删除 return 后的无效代码

- 遍历函数作用域内代码块，使用变量记录是否到了 return，后面的遍历，删除无作用域提升的语句

````javascript
BlockStatement(path) {
  const statementPaths = path.get("body");
  let purge = false;
  for (let i = 0; i < statementPaths.length; i++) {
    if (statementPaths[i].isCompletionStatement()) {
      purge = true;
      continue;
    }

    if (purge && !canExistAfterCompletion(statementPaths[i])) {
      statementPaths[i].remove();
    }
  }
},
```
````
