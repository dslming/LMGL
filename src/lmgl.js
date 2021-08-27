import Renderer from './Renderer.js'
import * as WebGLInterface from './WebGLInterface.js'

export default class lmgl {
  constructor() {
    this.gl = null
    this.indicesLength = 0
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
    const { gl,renderer } = this
    const { indices, attribute } = geo
    const program = this.createMaterial(mat)

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
    }

    if (indices) {
      this.indicesLength += indices.length
        let indicesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
      renderer.setIndicesLength(this.indicesLength)
    }
  }

  run() {
    this.renderer.render()
  }
}
