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

// 链表转化为数组
function generateListByLink(link) {
  const list = [];
  while (link) {
    list.push(link.val);
    link = link.next;
  }
  return list;
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
// console.log(deleteDuplicates(generateLinkList([1, 1, 1, 2, 2, 3, 4, 5])));

/**
 * leetcode 19. 删除链表的倒数第 N 个结点
 * 思路：快慢指针（快指针移动 N 步后，间隔 N。然后快慢指针同时移动，快指针移动到null时，慢指针为倒数第 N 个节点）
 */
var removeNthFromEnd = function (head, n) {
  // dummy 头节点
  const dummy = new ListNode(undefined, head);
  // 快慢指针
  let fast = dummy;
  let slow = dummy;
  // 快指针移动 n 步
  for (let i = 0; i < n; i++) {
    if (fast.next) {
      fast = fast.next;
    } else {
      // 异常处理
      return head;
    }
  }
  // 快慢指针遍历链表
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next;
  }
  // 删除
  slow.next = slow.next.next;
  // 返回
  return dummy.next;
};
// console.log(
//   generateListByLink(removeNthFromEnd(generateLinkList([1, 2, 3, 4, 5]), 1)),
//   generateListByLink(removeNthFromEnd(generateLinkList([1, 2, 3, 4, 5]), 3)),
//   generateListByLink(removeNthFromEnd(generateLinkList([1, 2, 3, 4, 5]), 5)),
//   generateListByLink(removeNthFromEnd(generateLinkList([1, 2, 3, 4, 5]), 8))
// );

/**
 * 206. 反转链表
 */
// 递归
var reverseList = function (head) {
  // 递归终止条件（返回尾节点）
  if (!head || !head.next) return head;
  // 递归函数
  const newHead = reverseList(head.next);
  // 从后往前处理链表(根据head处理head.next节点)
  head.next.next = head;
  head.next = null; // 处理头节点，避免遍历输出时死循环
  // 返回头节点
  return newHead;
};

// 循环 使用变量记录节点信息（前驱 当前 后继节点），直接遍历反转
// 前驱节点 和 当前节点 指针反转，后继节点记录下次遍历位置
var reverseList2 = function (head) {
  let prev = null; // 前驱节点（end -> ... -> head -> null)
  let cur = head; // 当前节点
  while (cur) {
    const next = cur.next; // 后继节点
    // 指针反转
    cur.next = prev;
    // 双指针后移
    prev = cur;
    cur = next;
  }
  return prev;
};
// console.log(generateListByLink(reverseList2(generateLinkList([1, 2, 3, 4]))));
// console.log(generateListByLink(reverseList(generateLinkList([1, 2, 3, 4]))));

/**
 * 92. 反转链表 II
 */
// 循环
var reverseBetween = function (head, m, n) {
  // dummy 节点
  const dummy = new ListNode(0, head);
  let p = dummy;
  // 链表 0 - m-2 遍历
  for (let i = 0; i < m - 1; i++) {
    p = p.next;
  }

  const leftHead = p; // m-1
  const start = leftHead.next; // m
  let prev = start; // 前驱节点 m
  let cur = prev.next; // 当前节点, m + 1

  // m+1 -> n 节点遍历，反转
  for (let i = m; i < n; i++) {
    const next = cur.next; // 后继节点
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  // 处理 m-1 和 m 节点赋值
  leftHead.next = prev;
  start.next = cur;
  return dummy.next;
};
// 递归
var reverseBetween2 = function (head, m, n) {
  let last; // n+1 节点
  // 走到需要反转的节点， 反转（m-1 节点）
  // 终止条件
  if (m === 1) {
    return reverse(head, n);
  }
  // 链表遍历(m-1节点 -> n节点, 穿针引线)
  // 递归函数
  const newHead = reverseBetween2(head.next, m - 1, n - 1); // n节点
  head.next = newHead;
  return head;

  // 反转 count 个节点（m - n 反转），并返回 m
  function reverse(head, count) {
    // 终止条件
    if (count === 1) {
      last = head.next; // n+1 节点
      return head;
    }
    // 递归函数
    let cur = reverse(head.next, count - 1);
    // 后续遍历, 从最后往前翻转.
    head.next.next = head;
    head.next = last; // n+1 <- m <- m+1 <- ... <- n
    return cur;
  }
};
console.log(
  generateListByLink(reverseBetween(generateLinkList([1, 2, 3, 4, 5]), 2, 4)),
  generateListByLink(reverseBetween2(generateLinkList([1, 2, 3, 4, 5]), 2, 4))
);
