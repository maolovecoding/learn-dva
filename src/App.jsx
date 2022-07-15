import dva, { connect } from "dva";
const app = dva();
// 定义模型
app.model({
  namespace: "counter", // 命名空间
  state: { number: 0 }, // 模型对应的状态
  reducer: {
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
// 连接组件和状态
const ConnectedCounter = connect((state) => state.counter)(Counter);
// 定义路由
app.router(() => <ConnectedCounter />);
// 启动
app.start("#root");
export default Counter;
