const { PubSub } = require("./containerCenter");
const { Publisher } = require("./publisher");
const { Subscriber } = require("./subscribe");

const TYPE_A = "music";
const TYPE_B = "movie";
const TYPE_C = "novel";

const pubsub = new PubSub();

const publisherA = new Publisher("publisherA", pubsub);
publisherA.publish(TYPE_A, "we are young");
publisherA.publish(TYPE_B, "the silicon valley");
const publisherB = new Publisher("publisherB", pubsub);
publisherB.publish(TYPE_A, "stronger");
const publisherC = new Publisher("publisherC", pubsub);
publisherC.publish(TYPE_C, "a brief history of time");

const subscriberA = new Subscriber("subscriberA", pubsub);
subscriberA.subscribe(TYPE_A, (res) => {
  console.log("subscriberA received", res);
});
const subscriberB = new Subscriber("subscriberB", pubsub);
subscriberB.subscribe(TYPE_C, (res) => {
  console.log("subscriberB received", res);
});
const subscriberC = new Subscriber("subscriberC", pubsub);
subscriberC.subscribe(TYPE_B, (res) => {
  console.log("subscriberC received", res);
});

pubsub.notify(TYPE_A);
pubsub.notify(TYPE_B);
pubsub.notify(TYPE_C);
