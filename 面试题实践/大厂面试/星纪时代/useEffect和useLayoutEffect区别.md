### 组件渲染时的运行过程

- 触发组件重新渲染
- 组件函数执行
- useLayoutEffect 执行（同步执行，阻塞渲染）
- 组件渲染后呈现到屏幕
- useEffect hook 执行（异步）

### 测试 demo

```javascript
import ReactDom from "react-dom";
import React, { useEffect, useLayoutEffect, useState } from "react";
const App = () => {
  const [_, change] = useState({});
  useEffect(() => {
    console.log("useEffect");
  });
  useLayoutEffect(() => {
    console.log("useLayoutEffect");
  });
  return (
    <>
      <Test1 />
      <Test2 />
      <div
        onClick={() => {
          change({});
        }}
      >
        parent change
      </div>
    </>
  );
};

const Test1 = () => {
  const [value, setValue] = useState(0);
  useLayoutEffect(() => {
    if (value === 0) {
      setValue(10 + Math.random() * 200);
    }
  }, [value]);
  console.log("render", value);
  return <div onClick={() => setValue(0)}>useLayoutEffect value: {value}</div>;
};
const Test2 = () => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (value === 0) {
      setValue(10 + Math.random() * 200);
    }
  }, [value]);
  console.log("render", value);
  return <div onClick={() => setValue(0)}>useEffect value: {value}</div>;
};

export default App;
```
