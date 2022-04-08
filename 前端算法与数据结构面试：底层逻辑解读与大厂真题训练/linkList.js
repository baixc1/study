function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

// 数组转化为链表
function generateLinkList(list) {
  if (!list?.length) return;

  let head = new ListNode(list[0]);
  cur = head;

  let i = 1;
  while (i < list.length) {
    cur.next = new ListNode(list[i]);
    cur = cur.next;
    i++;
  }
  return head;
}

/**
 * leetcode 21. 合并两个有序链表
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function (l1, l2) {
  // 头节点
  let head = new ListNode();
  // 编译两个链表
  while (l1 && l2) {
    if (l1.val < l2.val) {
      head.next = l1;
      l1 = l1.next;
    } else {
      head.next = l2;
      l2 = l2.next;
    }
  }
  // 两个链表未遍历部分
  if (l1) {
    l2.next = l1;
  } else if (l2) {
    l1.next = l2;
  }
  return head.next;
};
console.log(
  mergeTwoLists(generateLinkList([1, 3, 5]), generateLinkList([2, 4, 6]))
);
