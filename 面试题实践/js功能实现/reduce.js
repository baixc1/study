Array.prototype.myReduce = function (cb, initValue) {
  const arr = this;
  let index;
  let res;
  if (initValue === undefined) {
    index = 1;
    res = arr[0];
  } else {
    index = 0;
    res = initValue;
  }
  for (let i = index; i < arr.length; i++) {
    res = cb(res, arr[i], i, arr);
  }
  return res;
};

console.log(
  [1, 2, 3].myReduce((prev, next) => {
    return prev + next;
  })
);

console.log(
  [1, 2, 3].myReduce((prev, next) => {
    return prev + next;
  }, 1)
);
