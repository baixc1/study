### 类的相关属性

- 类本身指向构造函数
- 实例属性
  - this 上
  - 类的最顶部
- 静态方法
  - 类本身的方法
  - 非实例方法
- 静态属性
- 原型方法

### 浅比较和深比较

- 浅比较：比较引用是否相等（===）
- 深比较：原值是否相等，不比较引用

### useContext

- React.createContext
  - 创建 Context，包含 Provider, Consumer 对象（组件）
- 子组件使用 useContext(contextInstance)，类似 Consumer 的 props.children
- 简化多个 Consumers 的嵌套
- render props/组合组件
- 观察者模式

```javascript
function HeaderBar() {
  const user = useContext(CurrentUser);
  const notifications = useContext(Notifications);

  return (
    <header>
      Welcome back, {user.name}! You have {notifications.length} notifications.
    </header>
  );
}
```
