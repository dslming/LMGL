// camera
import { PerspectiveCamera } from './camera/PerspectiveCamera.js'
import MyOrbitControls from './camera-control/MyOrbitControls.js'
import { CameraControl } from './camera-control/CameraControl.js'
export * from "./camera/CubeCamera.js"
export * from "./camera/PerspectiveCamera.js"
export * from "./camera/OrthographicCamera.js"

// geometry
import * as geometryLib from './geometryLib/index.js'
export { geometryLib }

// core
import dao from './core/Dao.js'
import Renderer from './core/Renderer.js'
import { Raycaster } from './core/Raycaster.js'
export * from "./core/constants.js"
export * from "./core/ImageTexture.js"
export * from "./core/ImageCubeTexture.js"
export * from "./core/Mesh.js"
export * from "./core/RenderTarget.js"
export * from "./core/RenderTargetCube.js"
export * from "./core/MultipleRenderTarget.js"
export * from "./core/Material.js"
export * from "./core/MultisampleFrameBuffer.js"

// shader lib
import * as shaderLib from "./shaderLib/index.js"
export { shaderLib }

import * as modules from "./modules/index.js"
export { modules }

// loader
export * from "./loader/ImageLoader.js"
export * from "./loader/RGBELoader.js"

// math
import * as MathUtils from './math/MathUtils.js'
import { Vector3 } from './math/Vector3.js'
export * from "./math/Euler.js"
export * from "./math/Matrix3.js"
export * from "./math/Matrix4.js"
export * from "./math/Vector2.js"
export * from "./math/Vector3.js"
export * from "./math/Vector4.js"
export { MathUtils };

// mesh lib
import * as meshLib from './meshLib/index.js'
export { meshLib }

// webgl
import * as webgl from './webgl/index.js'
export { webgl }

export class Stage {
  constructor(cb) {
    window.lm = this
    this.failCallback = cb;
    this.enablePick = false;
    this.children = []
    this.gl = null
    this.indicesLength = 0
    this.geoType = null
    this.run = this.run.bind(this)
    this.updateChildren = new Map()
    this.renderFlag = true;
    this.resize = this.resize.bind(this)

    this.raycaster = new Raycaster()
  }

  // 拾取
  onClick(event) {
    if (!this.enablePick) return;

    var mouse = {}
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(mouse, this.camera);
    const intersections = this.raycaster.intersectObjects(this.children);
    // console.error(intersections);
    this.clickCb && this.clickCb(intersections)
  }

  setClickCb(cb) {
    this.clickCb = cb;
  }

  getGl() {
    return this.gl;
  }

  setRenderState(v) {
    this.renderFlag = v;
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
    if (!this.gl) {
      this.failCallback && this.failCallback({
        errorCode: 0,
        desc: "不支持webgl2"
      });
      const fail = document.querySelector(".fail")
      fail && (fail.style.display = "flex")
    }
    this.camera = new PerspectiveCamera(45, param[1] / param[2], 0.01, 5000)

    // this.control = new CameraControl({
    //   distance: this.camera.position.z,
    // }, this.camera, param[0])
    this.control = new MyOrbitControls(this.camera, param[0])

    dao.setData({ name: "gl", data: this.gl })
    dao.setData({ name: "camera", data: this.camera })

    const dom = param[0];
    const resize = () => {
       const width = window.innerWidth//dom.clientWidth
       const height = window.innerHeight//dom.clientHeight
       this.resize(width, height)
    }
    this.resize(window.innerWidth, window.innerHeight)
    window.addEventListener("resize", resize.bind(this))
    window.addEventListener("click", this.onClick.bind(this))
  }

  resize(width, height) {
    this.renderer.handleResize(width, height)
  }

  run() {
    this.control.update()
    window.requestAnimationFrame(this.run)
    this.camera.updateMatrix()
    this.camera.updateMatrixWorld()
    this.renderFlag && this.renderer.render()

    this.updateChildren.forEach(cb => {
      cb();
    })

  }

  addUpdate(name, cb) {
    this.updateChildren.set(name, cb);
  }

  removeOnUpdate(name) {
    this.updateChildren.delete(name)
  }
}
