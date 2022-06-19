/**
 * RegExp.prototype.exec()
 * exec() 方法在一个指定字符串中执行一个搜索匹配。返回一个结果数组或 null。
 */

const regex1 = RegExp("foo*", "g");
const str1 = "table football, foooosball fo";
let array1;

while ((array1 = regex1.exec(str1)) !== null) {
  //   console.log(array1, regex1.lastIndex);
  //   console.log(`Found ${array1[0]}. Next starts at ${regex1.lastIndex}.`);
}

var matches = /\s+(hello \S+)/.exec("This is a   hello world!");
// console.log(matches);

/**
 * String.prototype.match()
 * match() 方法检索返回一个字符串匹配正则表达式的结果
 * 如果未使用g标志，则仅返回第一个完整匹配及其相关的捕获组（Array）
 * 如果未使用g标志，str.match() 将返回与 RegExp.exec(). 相同的结果
 */
const paragraph = "The quick brown fox jumps over the lazy dog. It barked.";
const regG = /[A-Z]/g;
const reg = /[A-Z]/;

console.log(
  paragraph.match(regG),
  paragraph.match(reg),
  regG.exec(paragraph),
  regG.exec(paragraph),
  reg.exec(paragraph)
);
