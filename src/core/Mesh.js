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

    if (!this.geometry.type) {
      this.geometry.type = GEOMETRY_TYPE.TRIANGLES
    }

    if (!this.geometry.indices) {
      this.geometry.indices = []
    }
  }
}

export { Mesh }
