window.addEventListener("unhandledrejection", (event) => {
  event.preventDefault();
  console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
});

Promise.reject(1).then();

document.addEventListener("error", (e) => {
  console.log("error", e);
});

try {
  throw new Error(1);
} catch (e) {
  //
}
