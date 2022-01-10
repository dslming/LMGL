
function getValue(target:any,key:any) {
  let value = null;
  let type = ""

  if (target[key] !== undefined) {
    value = target[key];
  } else {
    for (let i in target) {
      var temp = target[i]
      if (temp !== undefined) {
        type = Object.prototype.toString.call(temp).toLocaleLowerCase()
        if (type === "[object object]") {
          value = temp[key];
          if (value !== undefined) {
            break;
          }
        }
      }
    }
  }

  return {
    value,
    type:Object.prototype.toString.call(value).toLocaleLowerCase()
  }
}

function proxyClass(_class: any, _get: any, _set: any): any {
    return new Proxy(_class, {
    get(target, key) {
        const info = getValue(target, key);
        return info.value;
    },
    set(target, key, value) {
      _set(target, key, value);
      const info = getValue(target, key);
      if (info.value === undefined) {
        target[key] = value;
      } else {
        info.value = value;
      }
      return target;
    }
  });
}


export function creator(_class: any, param:any) {
  let ins = new _class(param);
  ins = proxyClass(ins, (i:any) => {
            // console.error(i);
        }, (i:any) => {
    // console.error(i);


  })
  return ins;
}
