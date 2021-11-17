import * as MathUtils from '../math/MathUtils.js';
import * as WebGLInterface from '../webgl/index.js'
import Material from './Material.js'
import dao from './Dao.js'
import { GEOMETRY_TYPE, SIDE } from './constants.js'
import { Matrix4 } from '../math/Matrix4.js';
import { Matrix3 } from '../math/Matrix3.js';
import { Vector3 } from '../math/Vector3.js';
import { Euler } from '../math/Euler.js';
import { Sphere } from '../math/Sphere.js';
import { Quaternion } from '../math/Quaternion.js';
import { addProxy } from '../utils/Tool.js';


class Mesh {
  constructor(geometry, material) {
    this.uuid = MathUtils.generateUUID();
    this.material = new Material(material);
    this.geometry = geometry;
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

    this._buildGeometry(geometry)
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

  raycast(raycaster, intersects) {

    const geometry = this.geometry;
    const material = this.material;
    const matrixWorld = this.matrix;

    const _sphere = new Sphere();

    if (material === undefined) return;

    // Checking boundingSphere distance to ray

    if (geometry.boundingSphere === null) geometry.computeBoundingSphere();

    _sphere.copy(geometry.boundingSphere);
    _sphere.applyMatrix4(matrixWorld);

    if (raycaster.ray.intersectsSphere(_sphere) === false) return;

    //

    _inverseMatrix.copy(matrixWorld).invert();
    _ray.copy(raycaster.ray).applyMatrix4(_inverseMatrix);

    // Check boundingBox before continuing

    if (geometry.boundingBox !== null) {

      if (_ray.intersectsBox(geometry.boundingBox) === false) return;

    }

    let intersection;

    if (geometry.isBufferGeometry) {

      const index = geometry.index;
      const position = geometry.attributes.position;
      const morphPosition = geometry.morphAttributes.position;
      const morphTargetsRelative = geometry.morphTargetsRelative;
      const uv = geometry.attributes.uv;
      const uv2 = geometry.attributes.uv2;
      const groups = geometry.groups;
      const drawRange = geometry.drawRange;

      if (index !== null) {

        // indexed buffer geometry

        if (Array.isArray(material)) {

          for (let i = 0, il = groups.length; i < il; i++) {

            const group = groups[i];
            const groupMaterial = material[group.materialIndex];

            const start = Math.max(group.start, drawRange.start);
            const end = Math.min(index.count, Math.min((group.start + group.count), (drawRange.start + drawRange.count)));

            for (let j = start, jl = end; j < jl; j += 3) {

              const a = index.getX(j);
              const b = index.getX(j + 1);
              const c = index.getX(j + 2);

              intersection = checkBufferGeometryIntersection(this, groupMaterial, raycaster, _ray, position, morphPosition, morphTargetsRelative, uv, uv2, a, b, c);

              if (intersection) {

                intersection.faceIndex = Math.floor(j / 3); // triangle number in indexed buffer semantics
                intersection.face.materialIndex = group.materialIndex;
                intersects.push(intersection);

              }

            }

          }

        } else {

          const start = Math.max(0, drawRange.start);
          const end = Math.min(index.count, (drawRange.start + drawRange.count));

          for (let i = start, il = end; i < il; i += 3) {

            const a = index.getX(i);
            const b = index.getX(i + 1);
            const c = index.getX(i + 2);

            intersection = checkBufferGeometryIntersection(this, material, raycaster, _ray, position, morphPosition, morphTargetsRelative, uv, uv2, a, b, c);

            if (intersection) {

              intersection.faceIndex = Math.floor(i / 3); // triangle number in indexed buffer semantics
              intersects.push(intersection);

            }

          }

        }

      } else if (position !== undefined) {

        // non-indexed buffer geometry

        if (Array.isArray(material)) {

          for (let i = 0, il = groups.length; i < il; i++) {

            const group = groups[i];
            const groupMaterial = material[group.materialIndex];

            const start = Math.max(group.start, drawRange.start);
            const end = Math.min(position.count, Math.min((group.start + group.count), (drawRange.start + drawRange.count)));

            for (let j = start, jl = end; j < jl; j += 3) {

              const a = j;
              const b = j + 1;
              const c = j + 2;

              intersection = checkBufferGeometryIntersection(this, groupMaterial, raycaster, _ray, position, morphPosition, morphTargetsRelative, uv, uv2, a, b, c);

              if (intersection) {

                intersection.faceIndex = Math.floor(j / 3); // triangle number in non-indexed buffer semantics
                intersection.face.materialIndex = group.materialIndex;
                intersects.push(intersection);

              }

            }

          }

        } else {

          const start = Math.max(0, drawRange.start);
          const end = Math.min(position.count, (drawRange.start + drawRange.count));

          for (let i = start, il = end; i < il; i += 3) {

            const a = i;
            const b = i + 1;
            const c = i + 2;

            intersection = checkBufferGeometryIntersection(this, material, raycaster, _ray, position, morphPosition, morphTargetsRelative, uv, uv2, a, b, c);

            if (intersection) {

              intersection.faceIndex = Math.floor(i / 3); // triangle number in non-indexed buffer semantics
              intersects.push(intersection);

            }

          }

        }

      }

    }
  }
}

export { Mesh }
