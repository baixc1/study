class Subject {
  constructor() {
    this.observerList = [];
  }

  addObserver(observer) {
    this.observerList.push(observer);
  }

  removeObserver(observer) {
    const index = this.observerList.findIndex((o) => o.name === observer.name);
    this.observerList.splice(index, 1);
  }

  notifyObservers(message) {
    const observers = this.observerList;
    observers.forEach((observer) => observer.notified(message));
  }
}
module.exports = {
  Subject,
};
