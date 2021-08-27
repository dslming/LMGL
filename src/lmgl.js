import Renderer from './Renderer.js'
import * as WebGLInterface from './WebGLInterface.js'

export default class lmgl {
  constructor() {
    this.gl = null
  }

  initRender(...param) {
    this.renderer = new Renderer(...param)
    this.gl = this.renderer.getContext()
  }

  createMaterial(mat) {
    const { gl } = this
    const { uniforms } = mat
    const program = WebGLInterface.createProgram(gl, mat);
    gl.useProgram(program);

    const keys = Object.keys(uniforms)
    for (let i = 0; i < keys.length; i++) {
      const name = keys[i]
      const {value,type} = uniforms[name]
      let uParam = gl.getUniformLocation(program, name);

      switch (type) {
        case "v2":
          gl.uniform2f(uParam, value.x, value.y);
          break;

        case "v4":
          gl.uniform4f(uParam, value.x, value.y, value.z, value.w);
          break;
      }
    }
    return program
  }

  createMesh(geo,mat) {
    const { gl } = this
    const program = this.createMaterial(mat)

    const keys = Object.keys(geo)
    for (let i = 0; i < keys.length; i++) {
      const name = keys[i]
      const { value, itemSize } = geo[name]
      WebGLInterface.createAttribute(gl, program, {
        attribureName: name,
        attriburData: value,
        itemSize: itemSize
      })
    }
  }

  run() {
    this.renderer.render()
  }
}
