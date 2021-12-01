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


export function getName() {
  const gl = lm.getGl();
  for (let i in gl) {
    if (gl[i] == 32849) {
      console.error(i)
    }
  }
}
