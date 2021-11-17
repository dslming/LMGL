export default class Attribute {
  constructor(attr) {
    this.attr = attr;
    this.count = attr.value.length / attr.itemSize;
    this.value = attr.value;
    this.itemSize = attr.itemSize
  }

  getX(i) {
    return this.value[i * this.itemSize+0]
  }

  getX(i) {
    return this.value[i * this.itemSize + 1]
  }

  getX(i) {
    return this.value[i * this.itemSize + 2]
  }
}
