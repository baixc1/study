/**
 * 反转链表
 * 1. 新增临时节点，保存当前节点的下一节点
 * 2. 反转当前节点的下一节点
 */

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 * 遍历过程 [1,2,3,4]
 * 1 -> 1.next = null
 * 2 -> 2.next = 1
 * 3 -> 3.next = 2
 * 4 -> 4.next = 3
 * 无next节点，返回4
 */
var reverseList = function (head) {
  let prevNode = null;
  while (head) {
    let nextNode = head.next; // 记录下个遍历节点
    head.next = prevNode; // 当前指针反转
    prevNode = head; // 记录上个节点
    head = nextNode; // 指针后移
  }
  return prevNode; // 最后一个节点是 null
};
