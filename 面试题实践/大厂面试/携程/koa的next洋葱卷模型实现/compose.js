function compose(middleware) {
  return (ctx, next) => {
    return dispatch(0);
    function dispatch(i) {
      const fn = middleware[i];
      if (!fn) return Promise.resolve();
      return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));
    }
  };
}
module.exports = { compose };
