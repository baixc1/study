- useEffect 会在调用新的 effect 之前，对前一个 effect 进行清理
  - 第一次渲染（mounted）时，订阅
  - 组件更新（updated）时，先 解绑上一次订阅，再重新订阅（避免 class 组件中没有处理更新逻辑而导致的错误）
  - useEffect 第二个参数有值时，值更新时类似上述过程

```javascript
useEffect(() => {
  // ...
  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
});
```
