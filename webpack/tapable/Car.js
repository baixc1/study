const { SyncHook } = require("tapable");

const hook = new SyncHook(["newSpeed"]);
class Car {
  constructor() {
    this.hooks = {
      accelerate: hook,
    };
  }
  setSpeed(newSpeed) {
    console.log(this.hooks.accelerate === hook);
    this.hooks.accelerate.call(newSpeed);
  }
}
const myCar = new Car();

myCar.hooks.accelerate.tap("LoggerPlugin", (newSpeed) =>
  console.log(`Accelerating to ${newSpeed}`)
);
myCar.hooks.accelerate.tap("LoggerPlugin2", (newSpeed) =>
  console.log(`2Accelerating to ${newSpeed}`)
);
myCar.hooks.accelerate.tap("LoggerPlugin3", (newSpeed) =>
  console.log(`3Accelerating to1 ${newSpeed}`)
);

myCar.setSpeed(1);
