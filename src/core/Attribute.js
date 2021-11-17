export default class Attribute {
  constructor(attr) {
    this.value = attr.value;
    this.itemSize = attr.itemSize
    this.count = this.value.length / this.itemSize;
  }

  getX(i) {
    return this.value[i * this.itemSize+0]
  }

  getY(i) {
    return this.value[i * this.itemSize + 1]
  }

  getZ(i) {
    return this.value[i * this.itemSize + 2]
  }
}
