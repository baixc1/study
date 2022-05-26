### useRef 模拟

```javascript
import { useState, useEffect } from "react";

function useRef1(initialValue) {
  const [val] = useState({ current: initialValue });
  return val;
}
function App() {
  const [inputValue, setInputValue] = useState("");
  const count = useRef1(0);
  const ref = useRef1(null);
  console.log(count, ref);

  useEffect(() => {
    count.current = count.current + 1;
  });

  return (
    <>
      <input
        ref={ref}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <h1>Render Count: {count.current}</h1>
      <button
        onClick={() => {
          ref.current.focus();
        }}
      >
        focus
      </button>
    </>
  );
}
export default App;
```
