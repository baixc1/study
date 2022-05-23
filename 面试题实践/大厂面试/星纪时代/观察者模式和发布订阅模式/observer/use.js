const { Observer } = require("./observer");
const { Subject } = require("./subject");

const subject = new Subject();
const observerA = new Observer("observerA", subject);
const observerB = new Observer("observerB");
subject.addObserver(observerB);
subject.notifyObservers("Hello from subject");
subject.removeObserver(observerA);
console.log("---");
subject.notifyObservers("Hello again");
