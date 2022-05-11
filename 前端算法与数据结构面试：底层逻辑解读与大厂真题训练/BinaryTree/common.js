function ListNode(val) {
  this.val = val === undefined ? 0 : val;
}

function arrayToBST(arr) {
  const len = arr.length;
  if (!arr.length) return null;
  let i = 1;
  const root = new ListNode(arr[0]);
  const queue = [root];
  while (i < len) {
    const cur = queue.shift();
    cur.left = new ListNode(arr[i++]);
    if (i < len) {
      cur.right = new ListNode(arr[i++]);
    }
    queue.push(cur.left);
    queue.push(cur.right);
  }
  return root;
}

module.exports = {
  arrayToBST,
};
