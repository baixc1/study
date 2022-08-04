// src/index
import React from "../react";

const container = document.getElementById("root");

function App(props) {
  return <h1>H1,{props.name}!</h1>;
}

const updateValue = (e) => {
  rerender(e.target.value);
};

const rerender = (value) => {
  const element = (
    <div>
      <input onInput={updateValue} value={value} />
      <h2>Hello {value}</h2>
      <App name="foo" />
      <Counter />
      <Counter />
      <ClassCom />
    </div>
  );
  React.render(element, container);
};

function Counter() {
  const [state, setState] = React.useState(1);
  return (
    <div>
      <h1>Count: {state}</h1>
      <button onClick={() => setState((c) => c + 1)}>+1</button>
    </div>
  );
}

class ClassCom extends React.Component {
  render() {
    return (
      <div>
        <h1>我是</h1>
        <h2>class组件</h2>
      </div>
    );
  }
}

rerender("World");
