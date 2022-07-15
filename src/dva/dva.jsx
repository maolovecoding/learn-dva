import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { combineReducers, createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import * as sagaEffects from "redux-saga/effects";
import { createBrowserHistory } from "history";
import { HistoryRouter } from "redux-first-history/rr6";
import { createReduxHistoryContext } from "redux-first-history";
import { prefixNamespace } from "./prefixNamespace";

const { routerMiddleware, routerReducer, createReduxHistory } =
  createReduxHistoryContext({ history: createBrowserHistory() });

export const getReducer = (model) => {
  const { reducers, state: initialState } = model;
  const reducer = (state = initialState, action) => {
    // action.type = "counter/add"
    const reducer = reducers[action.type];
    if (reducer) return reducer(state, action);
    else return state;
  };
  return reducer;
};
/**
 * dva 函数 返回一个app对象
 */
const dva = () => {
  const model = (model) => {
    const prefixedModel = prefixNamespace(model);
    app._models.push(prefixedModel);
    return prefixedModel;
  };
  const router = (router) => {
    app._router = router;
  };
  const initialReducers = {
    // 配置路由 reducer
    router: routerReducer,
  };
  const createReducer = () => {
    return combineReducers(initialReducers);
  };
  /**
   * 扩展方法
   * @returns
   */
  const createActionCreators = () => {
    const actionCreators = {};
    for (const model of app._models) {
      const { reducers, state } = model;
      for (const type in reducers) {
        actionCreators[type] = () => ({ type });
      }
    }
    return actionCreators;
  };
  const start = (selector) => {
    for (const model of app._models) {
      initialReducers[model.namespace] = getReducer(model);
    }
    const rootReducer = createReducer();
    const sagas = getSagas(app);
    const sagaMiddleware = createSagaMiddleware();
    const store = applyMiddleware(routerMiddleware,sagaMiddleware)(createStore)(rootReducer);
    // 依次启动每一个saga生成器
    sagas.forEach(sagaMiddleware.run);
    const history = createReduxHistory(store)
    // router函数的返回值就是需要渲染的根组件
    ReactDOM.createRoot(document.querySelector(selector)).render(
      <Provider store={store}>
        <HistoryRouter history={history} >{app._router()}</HistoryRouter>
      </Provider>
    );
  };
  const app = {
    _models: [],
    model,
    _router: null,
    router,
    start,
    createActionCreators,
  };
  return app;
};

const getSagas = (app) => {
  const sagas = [];
  for (const model of app._models) {
    sagas.push(getSaga(model));
  }
  return sagas;
};

const getSaga = (model) => {
  const { effects } = model;
  return function* () {
    for (const key in effects) {
      yield sagaEffects.takeEvery(key, function* (action) {
        yield effects[key](action, sagaEffects);
      });
    }
  };
};

export default dva;
