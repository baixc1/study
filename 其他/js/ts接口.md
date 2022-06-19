- 接口(interface)的作用

  - 对 对象的形状 进行描述
  - 对 类 的一部分行为 进行抽象

- 核心

  - 接口 提取 类 的 共有功能

- 类实现接口
  - 类中必须实现接口中定义的方法

```typescript
interface Alarm {
  alert(): void;
}

class Door {}

class SecurityDoor extends Door implements Alarm {
  alert() {
    console.log("SecurityDoor alert");
  }
}

class Car implements Alarm {
  alert() {
    console.log("Car alert");
  }
}
```

- 打包后代码

```javascript
(() => {
  var __webpack_exports__ = {};
  class Door {}
  class SecurityDoor extends Door {
    alert() {
      console.log("SecurityDoor alert");
    }
  }
  class Car {
    alert() {
      console.log("Car alert");
    }
  }
})();
```

- 一个类实现多个接口

```javascript
interface Alarm {
  alert(): void;
}

interface Light {
  lightOn(): void;
  lightOff(): void;
}

class Car implements Alarm, Light {
  alert() {
    console.log("Car alert");
  }
  lightOn() {
    console.log("Car light on");
  }
  lightOff() {
    console.log("Car light off");
  }
}
```

- 接口继承接口

```javascript
interface Alarm {
  alert(): void;
}

interface LightableAlarm extends Alarm {
  lightOn(): void;
  lightOff(): void;
}
```

- 接口继承类
  - 接口主要约束类的创建
  - 声明类时，同时也创建了一个类型（p: Point)
  - 创建的新类型，包含实例属性，原型方法，不包含静态属性和构造函数

```javascript
class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

interface Point3d extends Point {
  z: number;
}

let point3d: Point3d = { x: 1, y: 2, z: 3 };
```

- 编译后

```javascript
(() => {
  var __webpack_exports__ = {};
  class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }
  let point3d = {
    x: 1,
    y: 2,
    z: 3,
  };
})();
```
