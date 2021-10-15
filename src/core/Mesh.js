import * as MathUtils from '../math/MathUtils.js';
import * as WebGLInterface from '../WebGLInterface.js'
import Material from './Material.js'
import dao from '../Dao.js'

class Mesh {
  constructor(geo, mat) {
    this.uuid = MathUtils.generateUUID();
    this.material = new Material(mat);
    this.geometry = geo;
  }
}

export { Mesh }
