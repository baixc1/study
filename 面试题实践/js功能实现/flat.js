function flat(arr) {
  return arr.reduce((prev, next) => {
    return prev.concat(Array.isArray(next) ? flat(next) : next);
  }, []);
}

// [1, 2, 3, 4, 5, 6, 7]
flat([[1, 2, 3], 4, [[5, 6, [7]]]]);
