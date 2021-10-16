// 数据访问对象
class Dao {
  constructor() {}

  setData({ name, data }) {
    this[name] = data
  }

  getData(name) {
    return this[name]
  }

  dispose() {
    const keys = Object.keys(this)
    keys.forEach(name => {
      this[name].dispose && this[name].dispose()
      this[name] = null
    })
  }
}

// 单例
export default new Dao()
