import * as MathUtils from '../math/MathUtils.js';
import * as WebGLInterface from '../WebGLInterface.js'
import Material from './Material.js'
import dao from '../Dao.js'
import { GEOMETRY_TYPE, SIDE } from '../global.js'

class Mesh {
  constructor(geo, mat) {
    this.uuid = MathUtils.generateUUID();
    this.material = new Material(mat);
    this.geometry = geo;
    this.attributeBuffer = {};

    if (!this.geometry.type) {
      this.geometry.type = GEOMETRY_TYPE.TRIANGLES
    }

    if (!this.geometry.indices) {
      this.geometry.indices = []
    }

    // 创建顶点缓冲区
    const { attribute, indices } = geo
    if (!indices) {
      console.error("geometry 需要 indices");
      return;
    }
    if (attribute.indices) {
      console.error("attribute和indices是并列关系...");
      return
    }
    const keys = Object.keys(attribute)
    for (let i = 0; i < keys.length; i++) {
      const name = keys[i]
      this.attributeBuffer[name] = this._createAttributeBuffer();
    }
    this.indicesBuffer = this._createAttributeBuffer();
  }

  _createAttributeBuffer() {
    const gl = dao.getData("gl");
    return WebGLInterface.createBuffer(gl)
  }

}

export { Mesh }
