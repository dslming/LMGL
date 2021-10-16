import * as MathUtils from '../math/MathUtils.js';
import * as WebGLInterface from '../webgl/index.js'
import Material from './Material.js'
import dao from './Dao.js'
import { GEOMETRY_TYPE, SIDE } from './global.js'
import { Matrix4 } from '../math/Matrix4.js';
import { Vector3 } from '../math/Vector3.js';
import { Euler } from '../math/Euler.js';
import { Quaternion } from '../math/Quaternion.js';
import { addProxy } from '../utils/Tool.js';

class Mesh {
  constructor(geo, mat) {
    this.uuid = MathUtils.generateUUID();
    this.material = new Material(mat);
    this.geometry = geo;
    this.attributeBuffer = {};
    this.matrix = new Matrix4();
    this.position = new Vector3();
    this.scale = new Vector3(1, 1, 1);
    this.rotation = new Euler();
    this.quaternion = new Quaternion();

    this.updateMatrix = this.updateMatrix.bind(this);
    this._onRotationChange = this._onRotationChange.bind(this);

    this.position = addProxy(this.position, this.updateMatrix)
    this.scale = addProxy(this.scale, this.updateMatrix)
    this.rotation = addProxy(this.rotation, this._onRotationChange)

    this._buildGeometry(geo)
  }


  _onRotationChange() {
    this.quaternion.setFromEuler(this.rotation, false);
    this.updateMatrix()
  }


  _buildGeometry(geo) {
    const gl = dao.getData("gl");

    if (!this.geometry.type) {
      this.geometry.type = GEOMETRY_TYPE.TRIANGLES
    }

    if (!this.geometry.indices) {
      this.geometry.indices = []
    }

    // 创建属性缓冲区
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
      this.attributeBuffer[name] = WebGLInterface.createBuffer(gl);
    }

    // 创建顶点缓冲区
    this.indicesBuffer = WebGLInterface.createBuffer(gl);
  }

  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale);
  }
}

export { Mesh }
