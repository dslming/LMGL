import Renderer from './Renderer.js'
import * as WebGLInterface from './WebGLInterface.js'
import { MESH_TYPE,VERSION,SIDE } from './global.js'
import MyOrbitControls from './camera-control/MyOrbitControls.js'
import { PerspectiveCamera } from './camera/PerspectiveCamera.js'
import { Matrix4 } from './math/Matrix4.js'

export * from "./geometry/Circle.js"
export * from "./geometry/Cube.js"
export * from "./global.js"
export * from "./ImageLoader.js"

export * from "./math/Euler.js"
export * from "./math/MathUtils.js"
export * from "./math/Matrix3.js"
export * from "./math/Matrix4.js"
export * from "./math/Vector2.js"
export * from "./math/Vector3.js"
export * from "./math/Vector4.js"

export class Stage {
  constructor() {
    window.lm = this
    this.gl = null
    this.indicesLength = 0
    this.geoType = null
    this.run = this.run.bind(this)
  }

  _buildUniform(uniforms, program) {
    if (!uniforms) return
    const { gl, renderer, camera } = this
    const keys = Object.keys(uniforms)
    for (let i = 0; i < keys.length; i++) {
      const name = keys[i]
      const { value, type } = uniforms[name]
      let uParam = gl.getUniformLocation(program, name);

      switch (type) {
        case "v2":
          gl.uniform2f(uParam, value.x, value.y);
          break;

        case "v4":
          gl.uniform4f(uParam, value.x, value.y, value.z, value.w);
          break;

        case "m4":
          gl.uniformMatrix4fv(uParam, false, value.elements);
          break

        case "t":
          WebGLInterface.setTexture(gl, uParam, value)
          break
      }
    }


  }

  _updateUniformMatrix() {
     const { gl, camera, program } = this
    const projectionMatrixGL = gl.getUniformLocation(program, "projectionMatrix");
    camera.updateProjectionMatrix()
    gl.uniformMatrix4fv(projectionMatrixGL, false, camera.projectionMatrix.elements);

    const modelViewMatrix = new Matrix4()
    const matrixWorld = new Matrix4()
    modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, matrixWorld);
    const modelViewMatrixGL = gl.getUniformLocation(program, "modelViewMatrix");
    gl.uniformMatrix4fv(modelViewMatrixGL, false, modelViewMatrix.elements);
  }

  _buildTriangleMesh(geo, program) {
    const { indices, attribute } = geo
    const { gl, renderer } = this

    let vertexLength = 0
    const keys = Object.keys(attribute)
    for (let i = 0; i < keys.length; i++) {
      const name = keys[i]
      const { value, itemSize } = attribute[name]
      // 一个属性对应一个buffer
      WebGLInterface.createAttribute(gl, program, {
        attribureName: name,
        attriburData: value,
        itemSize: itemSize
      })
      vertexLength = value.length / itemSize
    }
    renderer.setVertexLength(vertexLength)

    if (indices) {
      this.indicesLength += indices.length
      const indicesBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
      renderer.setIndicesLength(this.indicesLength)
    }
  }

  _buildPointMesh(geo) {

  }

  initRender(...param) {
    this.renderer = new Renderer(...param)
    this.gl = this.renderer.getContext()
    this.camera = new PerspectiveCamera(30, param[1] / param[2], 1, 10000)
    this.control = new MyOrbitControls(this.camera, param[0])
    // this.control.
  }

  createMaterial(mat) {
    const { gl } = this
    const { uniforms,side } = mat
    const program = WebGLInterface.createProgram(gl, mat);
    gl.useProgram(program);
    this._buildUniform(uniforms, program)
    this.program = program
    this._updateUniformMatrix()

    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);

    if (side !== undefined) {
      gl.cullFace(gl.FRONT);
      return program
    }

    switch (side) {
      case SIDE.FrontSide:
        gl.cullFace(gl.FRONT);
        break

      case SIDE.BackSide:
        gl.cullFace(gl.BACK);
        break

      case SIDE.FrontSide:
        gl.cullFace(gl.FRONT_AND_BACK);
      break
    }
    return program
  }

  createMesh(geo,mat) {
    const { renderer ,gl} = this
    const program = this.createMaterial(mat)
    if (!geo.type) { geo.type = MESH_TYPE.TRIANGLES }
    if (geo.type == MESH_TYPE.POINTS) {
      this._buildPointMesh()
    } else if (geo.type == MESH_TYPE.TRIANGLES) {
      this._buildTriangleMesh(geo, program)
    }
    renderer.clear()
    renderer.render(geo.type)
    this.geoType = geo.type
  }

  run() {
    // return
    window.requestAnimationFrame(this.run)
    this.camera.updateMatrix()
    this.camera.updateMatrixWorld()
    // this.camera.update
    this._updateUniformMatrix()
    this.renderer.render(this.geoType)
  }
}

console.log(VERSION);
