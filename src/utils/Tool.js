export function addProxy(proxyObj, setCb, getCb) {
  return new Proxy(proxyObj, {
    get(target, key) {
      let result = target[key];
      getCb && getCb(result)
      return result;
    },
    set(target, key, value) {
      target[key] = value;
      setCb && setCb(this)
      return this;
    }
  });
}
