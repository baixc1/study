// map和对象区别

// https://blog.csdn.net/muzidigbig/article/details/121995777

/**
 * 不同点
 * 1. Object 的 key 必须是简单类型，Map的 key 无限制
 * 2. Map支持迭代，Object不能（for...of)(Symbol.iterator)（重点）
 * 3. 遍历Map时，按照插入的顺序遍历（重点）
 * 4. Map.prototype.__proto__ === Object.prototype(Map的原型继承Object的原型->map实例继承Object原型)
 * 5. 判断对象是否有某个key时，需要排除原型干扰（hasOwnProperty）
 * 6. Map 是纯粹的 hash， 而 Object 还存在一些其他内在逻辑（执行 delete 的时候会有性能问题）- 写入删除密集的情况应该使用 Map（重点）
 * 7. Map适合于存储大量元素（hash特性）（性能好）？
 */
