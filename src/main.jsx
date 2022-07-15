import dva, { connect } from "./dva";
import { Router, Link, Route, Routes,routerRedux } from "./dva/router";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
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
  // 异步操作 结合saga
  effects: {
    // 等待组件向仓库派发asyncAdd动作，派发后执行该saga
    // 会等待 counter/asyncAdd动作的派发 派发完成后执行此saga生成器函数
    *asyncAdd(action, { call, put }) {
      yield call(delay, 1000);
      yield put({ type: "counter/add" });
    },
    *goto({ payload: to }, { put }) {
      yield put(routerRedux.push(to));
    },
  },
});
const Counter = (props) => {
  return (
    <div>
      <h2>{props.number}</h2>
      {/* 传统写法 我们增加了一个actionCreator方法以后不需要这种写了 */}
      <button onClick={() => props.dispatch({ type: "counter/add" })}>
        +1
      </button>
      <button onClick={() => props.dispatch({ type: "counter/asyncAdd" })}>
        + async 1
      </button>
      <button
        onClick={() => props.dispatch({ type: "counter/goto", payload: "/" })}
      >
        跳转路径 home
      </button>
      {/* <button onClick={props["counter/add"]}>+1</button> */}
    </div>
  );
};
// 支持更简单的书写方式 源码没有该方法
const actionCreators = app.createActionCreators();
// 连接组件和状态 connect其实就是react-redux里面的 counter是命名空间的名字
const ConnectedCounter = connect(
  (state) => state.counter
  // actionCreators
)(Counter);
const Home = () => {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
};

// 定义路由
app.router(() => (
  <>
    <Link to="/">Home</Link>
    <Link to="/counter">counter</Link>
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/counter" element={<ConnectedCounter />}></Route>
    </Routes>
  </>
));
// 启动
app.start("#root");
