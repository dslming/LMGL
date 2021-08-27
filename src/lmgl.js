import Renderer from './Renderer.js'
import * as WebGLInterface from './WebGLInterface.js'
import { MESH_TYPE } from './global.js'

export * from "./geometry/Circle.js"
export * from "./global.js"

export class Stage {
  constructor() {
    this.gl = null
    this.indicesLength = 0
  }

  _buildUniform(uniforms, program) {
    if (!uniforms) return
    const { gl, renderer } = this
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
      }
    }
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
  }

  createMaterial(mat) {
    const { gl } = this
    const { uniforms } = mat
    const program = WebGLInterface.createProgram(gl, mat);
    gl.useProgram(program);
    this._buildUniform(uniforms, program)
    return program
  }

  createMesh(geo,mat) {
    const { renderer } = this
    const program = this.createMaterial(mat)
    if (!geo.type) { geo.type = MESH_TYPE.TRIANGLES }
    if (geo.type == MESH_TYPE.POINTS) {
      this._buildPointMesh()
    } else if (geo.type == MESH_TYPE.TRIANGLES) {
      this._buildTriangleMesh(geo, program)
    }
    renderer.clear()
    renderer.render(geo.type)
  }

  run() {
    this.renderer.render()
  }
}
