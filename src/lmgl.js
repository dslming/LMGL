import Renderer from './core/Renderer.js'
import * as WebGLInterface from './WebGLInterface.js'
import { GEOMETRY_TYPE,VERSION,SIDE } from './global.js'
import MyOrbitControls from './camera-control/MyOrbitControls.js'
import { PerspectiveCamera } from './camera/PerspectiveCamera.js'

import dao from './Dao.js'

export * from "./geometry/Circle.js"
export * from "./geometry/Cube.js"
export * from "./global.js"
export * from "./ImageLoader.js"

export * from "./math/Euler.js"
// export * from "./math/MathUtils.js"
export * from "./math/Matrix3.js"
export * from "./math/Matrix4.js"
export * from "./math/Vector2.js"
export * from "./math/Vector3.js"
export * from "./math/Vector4.js"

export * from "./core/Mesh.js"

export class Stage {
  constructor() {
    window.lm = this

    this.children = []
    this.gl = null
    this.indicesLength = 0
    this.geoType = null
    this.run = this.run.bind(this)
  }

  add(object) {
    this.children.push(object);
    dao.setData({ name: "allMesh", data: this.children })
  }

  remove(object) {
    const index = this.children.indexOf(object);
    if (index !== -1) {
      object.parent = null;
      this.children.splice(index, 1);
    }
  }

  // _updateUniformMatrix() {
  //    const { gl, camera, program } = this
  //   const projectionMatrixGL = gl.getUniformLocation(program, "projectionMatrix");
  //   camera.updateProjectionMatrix()
  //   gl.uniformMatrix4fv(projectionMatrixGL, false, camera.projectionMatrix.elements);

  //   const modelViewMatrix = new Matrix4()
  //   const matrixWorld = new Matrix4()
  //   modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, matrixWorld);
  //   const modelViewMatrixGL = gl.getUniformLocation(program, "modelViewMatrix");
  //   gl.uniformMatrix4fv(modelViewMatrixGL, false, modelViewMatrix.elements);
  // }

  init(...param) {
    this.renderer = new Renderer(...param)
    this.gl = this.renderer.getContext()
    this.camera = new PerspectiveCamera(30, param[1] / param[2], 1, 10000)
    this.control = new MyOrbitControls(this.camera, param[0])

    dao.setData({ name: "gl", data: this.gl })
    dao.setData({ name: "camera", data: this.camera })
  }


  run() {
    // return
    window.requestAnimationFrame(this.run)
    this.camera.updateMatrix()
    this.camera.updateMatrixWorld()
    // this.camera.update
    // this._updateUniformMatrix()
    this.renderer.render()
  }
}

console.log(VERSION);
