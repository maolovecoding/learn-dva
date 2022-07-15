/**
 * 预处理命名空间 给action添加前缀
 * @param {*} model
 */
export const prefixNamespace = (model) => {
  if (model.reducers) {
    model.reducers = prefix(model.reducers, model.namespace);
  }
  if (model.effects) {
    model.effects = prefix(model.effects, model.namespace);
  }
  return model;
};
const prefix = (reducers, namespace) => {
  // 返回一个处理后的reducers
  return Object.keys(reducers).reduce((memo, key) => {
    const newKey = `${namespace}/${key}`;
    memo[newKey] = reducers[key];
    return memo;
  }, {});
};
