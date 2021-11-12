import * as MathUtils from '../math/MathUtils.js';
import * as WebGLInterface from '../webgl/index.js'
import Material from './Material.js'
import dao from './Dao.js'
import { GEOMETRY_TYPE, SIDE } from './constants.js'
import { Matrix4 } from '../math/Matrix4.js';
import { Vector3 } from '../math/Vector3.js';
import { Euler } from '../math/Euler.js';
import { Quaternion } from '../math/Quaternion.js';
import { addProxy } from '../utils/Tool.js';

class Mesh {
  constructor(geometry, material) {
    this.uuid = MathUtils.generateUUID();
    this.material = new Material(material);
    this.geometry = geometry;
    this.attributeBuffer = {};
    this.matrix = new Matrix4();
    this.position = new Vector3();
    this.scale = new Vector3(1, 1, 1);
    this.rotation = new Euler();
    this.quaternion = new Quaternion();
    this.setVBO = false;
    this.updateMatrix = this.updateMatrix.bind(this);
    this._onRotationChange = this._onRotationChange.bind(this);

    this.position = addProxy(this.position, this.updateMatrix)
    this.scale = addProxy(this.scale, this.updateMatrix)
    this.rotation = addProxy(this.rotation, this._onRotationChange)

    this._buildGeometry(geometry)
    this.setAttributesBuffer()
  }


  _onRotationChange() {
    this.quaternion.setFromEuler(this.rotation, false);
    this.updateMatrix()
  }

  _buildGeometry(geometry) {
    const gl = dao.getData("gl");

    if (!this.geometry.type) {
      this.geometry.type = GEOMETRY_TYPE.TRIANGLES
    }

    if (!this.geometry.indices) {
      this.geometry.indices = []
    }

    // 创建属性缓冲区
    const { attribute, indices } = geometry
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
    indices.length>0 && (this.indicesBuffer = WebGLInterface.createBuffer(gl));
  }

  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale);
  }

  // 设置VBO
  setAttributesBuffer() {
    const { attributeBuffer, indicesBuffer, geometry } = this;
    const {program} = this.material;

    const { indices, attribute } = geometry
    const gl = dao.getData("gl");

    const keys = Object.keys(attribute)
    for (let i = 0; i < keys.length; i++) {
      const name = keys[i]
      const { value, itemSize } = attribute[name]
      // 一个属性对应一个buffer
      WebGLInterface.setAttribBuffer(
        gl,
        program,
        attributeBuffer[name], {
          attribureName: name,
          attriburData: value,
          itemSize: itemSize
        })
    }

    if (indices.length > 0) {
      WebGLInterface.setIndicesBuffer(gl, indicesBuffer, indices)
    }
  }

  dispose() {
    // todo: 删除vao,vbo...
  }
}

export { Mesh }
