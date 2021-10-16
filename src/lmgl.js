import Renderer from './core/Renderer.js'
import * as WebGLInterface from './webgl/index.js'
import { GEOMETRY_TYPE,VERSION,SIDE } from './core/global.js'
import MyOrbitControls from './camera-control/MyOrbitControls.js'
import { PerspectiveCamera } from './camera/PerspectiveCamera.js'

import dao from './core/Dao.js'

export * from "./geometry/Circle.js"
export * from "./geometry/Cube.js"
export * from "./core/global.js"

// loader
export * from "./loader/ImageLoader.js"

export * from "./math/Euler.js"
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
    this.updateChildren = new Map()
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

  init(...param) {
    this.renderer = new Renderer(...param)
    this.gl = this.renderer.getContext()
    this.camera = new PerspectiveCamera(30, param[1] / param[2], 1, 10000)
    this.control = new MyOrbitControls(this.camera, param[0])

    dao.setData({ name: "gl", data: this.gl })
    dao.setData({ name: "camera", data: this.camera })
  }

  resize(width, height) {
    this.renderer.handleResize(width, height)
  }

  run() {
    window.requestAnimationFrame(this.run)
    this.camera.updateMatrix()
    this.camera.updateMatrixWorld()
    this.renderer.render()

    this.updateChildren.forEach(cb => {
      cb();
    })
  }

  addOnUpdate(name, cb) {
    this.updateChildren.set(name, cb);
  }

  removeOnUpdate(name) {
    this.updateChildren.delete(name)
  }
}

console.log("lmgl", VERSION);
