# dva学习

## 什么是Dva

dva 首先是一个基于 `redux` 和 `redux-saga` 的数据流方案，然后为了简化开发体验，dva 还额外内置了 `react-router` 和 `fetch`，所以也可以理解为一个轻量级的应用框架

## dva的简单使用

```jsx
import dva, { connect } from "dva";
const app = dva();
// 定义模型
app.model({
  namespace: "counter", // 命名空间
  state: { number: 0 }, // 模型对应的状态
  reducers: {
    // 改变仓库状态的reducer
    add(state, action) {
      return { number: state.number + 1 };
    },
  },
});
const Counter = (props) => {
  return (
    <div>
      <h2>{props.number}</h2>
      <button onClick={() => props.dispatch({ type: "counter/add" })}>
        +1
      </button>
    </div>
  );
};
// 连接组件和状态 connect其实就是react-redux里面的 counter是命名空间的名字
const ConnectedCounter = connect(
  (state) => state.counter,
)(Counter);
// 定义路由
app.router(() => <ConnectedCounter />);
// 启动
app.start("#root");
```
