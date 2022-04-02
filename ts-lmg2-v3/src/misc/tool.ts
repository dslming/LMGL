export function addProxy(proxyObj: any, setCb: any, getCb?: any) {
  const handler = {
      get(target: any, key: any) {
          let result = target[key];
          getCb && getCb(result);
          return result;
      },
      set(target: any, key: any, value: any) {
          target[key] = value;
          setCb && setCb(this);
          return this;
      },
  };
    return new Proxy(proxyObj, handler as any);
}
