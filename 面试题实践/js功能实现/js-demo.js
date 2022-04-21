Promise.reject(2)
  .catch((err) => console.log("err1,", err)) // 输出 2
  .then((res) => {
    console.log("then1", res); // 输出 undefined
  })
  .catch((err) => console.log("err2,", err));
