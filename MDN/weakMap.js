// map 可以按照数据插入时的顺序遍历所有的元素
// 键可以是任意类型
const map = new Map([
  [3, 1],
  [1, 2],
  [2, 3],
]);
console.log(map.size);
for (let [key, val] of map) {
  // console.log(key, val);
}

// WeakMap 的 key 只能是 Object 类型
// 键被弱保持，无引用时释放内存
// map实现：双数组，按顺序插入，搜索。
// map问题：（时间复杂度O(n)）（数组引用导致不能内存回收）
class ClearableWeakMap {
  constructor(init) {
    this._wm = new WeakMap(init);
  }
  clear() {
    this._wm = new WeakMap();
  }
  delete(k) {
    return this._wm.delete(k);
  }
  get(k) {
    return this._wm.get(k);
  }
  has(k) {
    return this._wm.has(k);
  }
  set(k, v) {
    this._wm.set(k, v);
    return this;
  }
}
const obj = {};
const arr = [];
const wm = new ClearableWeakMap([
  [obj, 1],
  [arr, 2],
]);
console.log(wm.has(obj), wm.has(arr));
wm.set(obj, 2);
console.log(wm.get(obj));
wm.clear();
console.log(wm.has(obj));
wm.set(arr, 22);

// weakMap 不可枚举
// console.log(wm.size);
// for (let v of wm) {
//   console.log(v);
// }
