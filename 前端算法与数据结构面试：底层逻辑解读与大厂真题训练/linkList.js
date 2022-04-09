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
  // 指针
  let cur = head;
  // 遍历两个链表
  while (l1 && l2) {
    if (l1.val < l2.val) {
      cur.next = l1;
      l1 = l1.next;
    } else {
      cur.next = l2;
      l2 = l2.next;
    }
    // 指针前移
    cur = cur.next;
  }
  // 两个链表未遍历部分
  cur.next = l1 ? l1 : l2;
  return head.next;
};
// 递归
var mergeTwoLists2 = function (l1, l2) {
  if (!l1) return l2;
  if (!l2) return l1;
  if (l1.val < l2.val) {
    l1.next = mergeTwoLists2(l1.next, l2);
    return l1;
  }
  l2.next = mergeTwoLists2(l1, l2.next);
  return l2;
};
// console.log(
//   mergeTwoLists2(generateLinkList([1, 3, 5]), generateLinkList([2, 4, 6]))
// );

/**
 * leetcode 83. 删除排序链表中的重复元素
 */
var deleteDuplicates = function (head) {
  // 将重复节点的前驱节点的next指向重复节点的next节点
  var cur = head;
  while (cur && cur.next) {
    // 当前节点和下一节点重复，删除下一节点
    if (cur.val === cur.next.val) {
      cur.next = cur.next.next;
    }
    // 否则循环链表节点
    else {
      cur = cur.next;
    }
  }
  return head;
};
// console.log(deleteDuplicates(generateLinkList([1, 1, 2, 22, 3, 3, 4])));

/**
 * leetcode 82. 删除排序链表中的重复元素 II
 */
var deleteDuplicates = function (head) {
  // 新的头部节点（head节点可能被删除）
  const newHead = new ListNode();
  newHead.next = head;
  let cur = newHead;
  while (cur.next && cur.next.next) {
    // 节点重复，删除重复的节点。否则继续遍历
    if (cur.next.val === cur.next.next.val) {
      // 被删除节点值
      const val = cur.next.val;
      // 删除两个重复节点
      cur.next = cur.next.next.next;
      // 继续删除重复节点
      while (cur.next && cur.next.val === val) {
        cur.next = cur.next.next;
      }
    } else {
      cur = cur.next;
    }
  }
  return newHead.next;
};
console.log(deleteDuplicates(generateLinkList([1, 1, 1, 2, 2, 3, 4, 5])));
