// 深拷贝（简单版：考虑循环引用）
// 递归
function clone(obj, map = new WeakMap()) {
  if (typeof obj === "object" && obj !== null) {
    if (map.get(obj)) return map.get(obj);
    const cloneObj = Array.isArray(obj) ? [] : {};
    map.set(obj, cloneObj);
    for (let key in obj) {
      cloneObj[key] = clone(obj[key], map);
    }
    return cloneObj;
  } else {
    return obj;
  }
}

var obj = { a: 1, b: null, c: [{ c1: 1 }, 2] };
obj.obj = obj;

console.log(clone(obj));
