import * as MathUtils from '../math/MathUtils.js';
import * as WebGLInterface from '../webgl/index.js'
import dao from './Dao.js'
import { GEOMETRY_TYPE, SIDE } from './constants.js'
import { Matrix4 } from '../math/Matrix4.js';
import { Matrix3 } from '../math/Matrix3.js';
import { Vector3 } from '../math/Vector3.js';
import { Euler } from '../math/Euler.js';
import { Ray } from '../math/Ray.js';
import { Sphere } from '../math/Sphere.js';
import { Quaternion } from '../math/Quaternion.js';
import { addProxy } from '../utils/Tool.js';
import Geometry from './Geometry.js'
import { checkBufferGeometryIntersection } from '../utils/check.js'
import Attribute from './Attribute.js'
class Mesh {
  constructor(geometryInfo, material) {
    this.uuid = MathUtils.generateUUID();
    this.material = material;
    this.geometry = new Geometry(geometryInfo);
    // VBO 集合
    this.attributeBuffer = {};
    this.matrix = new Matrix4();
    this.normalMatrix = new Matrix3();
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

    const gl = dao.getData("gl");
    this.VAO = WebGLInterface.createVertexArray(gl);
    WebGLInterface.bindVertexArray(gl, this.VAO)
    this._buildGeometry()
    this._setAttributesBuffer()
    WebGLInterface.bindVertexArray(gl, null)
    this._disableVertexAttrib();
  }


  _onRotationChange() {
    this.quaternion.setFromEuler(this.rotation, false);
    this.updateMatrix()
  }

  _buildGeometry() {
    const gl = dao.getData("gl");

    if (!this.geometry.type) {
      this.geometry.type = GEOMETRY_TYPE.TRIANGLES
    }

    if (!this.geometry.indices) {
      this.geometry.indices = []
    }

    // 创建属性缓冲区
    const { attribute, indices } = this.geometry
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

  // 设置VBO
  _setAttributesBuffer() {
    const { attributeBuffer, indicesBuffer, geometry } = this;
    const { program } = this.material;

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

  _disableVertexAttrib() {
    const { geometry } = this;
    const { attribute } = geometry
    const keys = Object.keys(attribute)
    const { program } = this.material;
    const gl = dao.getData("gl");

    for (let i = 0; i < keys.length; i++) {
      const attribureName = keys[i];
      const attribure = WebGLInterface.getAttribLocation(gl, program, attribureName);
      attribure != -1 && WebGLInterface.disableVertexAttribArray(gl, attribure);
    }
  }

  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale);
  }

  render() {
    const gl = dao.getData("gl");
    WebGLInterface.bindVertexArray(gl, this.VAO);
    // this._setAttributesBuffer()
  }

  renderAfter() {
    const gl = dao.getData("gl")
    // WebGLInterface.bindVertexArray(gl, null)
  }

  dispose() {
    const { program } = this.material;
    // todo: 删除vao,vbo...
    WebGLInterface.deleteProgram(program);
    WebGLInterface.deleteVertexArray(this.VAO);
  }

  raycast(raycaster, intersects) {

    const geometry = this.geometry;
    const material = this.material;
    const matrixWorld = this.matrix;

    const _sphere = new Sphere();

    if (material === undefined) return;

    const _inverseMatrix = new Matrix4();
    const _ray = new Ray();

    // Checking boundingSphere distance to ray

    if (geometry.boundingSphere === null) geometry.computeBoundingSphere();

    _sphere.copy(geometry.boundingSphere);
    _sphere.applyMatrix4(matrixWorld);

    if (raycaster.ray.intersectsSphere(_sphere) === false) return;

    _inverseMatrix.copy(matrixWorld).invert();
    _ray.copy(raycaster.ray).applyMatrix4(_inverseMatrix);

    // Check boundingBox before continuing
    if (geometry.boundingBox !== null) {
      if (_ray.intersectsBox(geometry.boundingBox) === false) return;
    }

    let intersection;

    const indices = geometry.indices;
    const position = new Attribute(geometry.attribute.aPosition);
    const triangleCount = geometry.triangleCount;

    if (indices == null) return;

    for (let i = 0, il = triangleCount; i < il; i += 3) {
      const a = indices[i + 0]
      const b = indices[i + 1]
      const c = indices[i + 2]

      intersection = checkBufferGeometryIntersection(this, material, raycaster, _ray, position, a, b, c);
      if (intersection) {
        intersection.faceIndex = Math.floor(i / 3); // triangle number in indexed buffer semantics
        intersects.push(intersection);
      }
    }
  }
}

export { Mesh }
