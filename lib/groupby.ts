// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const groupBy = function (list: any[], key: any) {
  return list.reduce(function (rv, x) {
    const v = key instanceof Function ? key(x) : x[key];
    (rv[v] = rv[v] || []).push(x);
    return rv;
  }, {});
};
