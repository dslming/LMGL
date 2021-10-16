
// WebGLIndexedBufferRenderer.js


import { GEOMETRY_TYPE, SIDE } from '../global.js'
import dao from '../Dao.js'
import * as WebGLInterface from '../WebGLInterface.js'
import { Matrix4 } from '../math/Matrix4.js'

export default class Renderer {
  constructor(dom, width, height) {
    const canvas = dom
    this.canvas = canvas
    this.handleResize(width, height)
    // const gl = this.getContext()
    this.gl = dao.getData("gl")
    // this._setGlState()
    this.currentPrograme = null
    this.autoClear = false;
  }

  _setGlState() {
    const { gl } = this
    gl.enable(gl.DEPTH_TEST);
  }

  _updateUniformMatrix(program) {
    const gl = dao.getData("gl")
    const camera = dao.getData("camera")

    camera.updateProjectionMatrix()
    WebGLInterface.setUniform(gl, program, "projectionMatrix", camera.projectionMatrix.elements, "m4")

    const modelViewMatrix = new Matrix4()
    const matrixWorld = new Matrix4()
    modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, matrixWorld);
    WebGLInterface.setUniform(gl, program, "modelViewMatrix", modelViewMatrix.elements, "m4")
  }

  _buildMaterial(mat) {
    // const gl = dao.getData("gl")
    // const { uniforms, side } = mat
    // const program = WebGLInterface.createProgram(gl, mat);
    // gl.useProgram(program);
    // this._buildUniform(uniforms, program)
    // this.program = program
    // gl.enable(gl.CULL_FACE);
    // gl.frontFace(gl.CCW);

    // if (side !== undefined) {
    //   gl.cullFace(gl.FRONT);
    //   return program
    // }

    // switch (side) {
    //   case SIDE.FrontSide:
    //     gl.cullFace(gl.FRONT);
    //     break

    //   case SIDE.BackSide:
    //     gl.cullFace(gl.BACK);
    //     break

    //   case SIDE.FrontSide:
    //     gl.cullFace(gl.FRONT_AND_BACK);
    //     break
    // }
    // return program
  }

   _setAttributes(attributeBuffer, indicesBuffer, geo, program) {
     const { indices, attribute } = geo
     const gl = dao.getData("gl");
     this.indicesLength = 0

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

     if (indices) {
       WebGLInterface.setIndicesBuffer(gl, indicesBuffer, indices)
     }
   }

  _render(geoType, count) {
    const gl = dao.getData("gl")
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    if (geoType == GEOMETRY_TYPE.POINTS) {
      gl.drawArrays(gl.POINTS, 0, 1);
    } else if (geoType == GEOMETRY_TYPE.TRIANGLES) {
      gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
    }
  }

  getContext() {
    return this.canvas.getContext("webgl");
  }

  setIndicesLength(v) {
    this.indicesLength = v
  }

  setVertexLength(v) {
    this.vertexLength = v
  }

  handleResize(width, height) {
    const { canvas} = this
    const ratio = window.devicePixelRatio
    canvas.width = width
    canvas.height = height;

    const camera = dao.getData("camera")
    camera && (camera.aspect = width / height);
    // canvas.style.width = width * ratio+"px"
    // canvas.style.height = height * ratio + "px"
  }

  clear() {
     const gl = dao.getData("gl")
     gl.clearColor(0, 0, 0, 1.0);
     gl.clear(gl.COLOR_BUFFER_BIT);
  }

  render() {
    const gl = dao.getData("gl")
    const allMesh = dao.getData("allMesh")
    this.clear()


    for (let i = 0; i < allMesh.length; i++) {
      const mesh = allMesh[i]
      const mat = mesh.material;
      const geo = mesh.geometry;
      const program = mat.program;
      WebGLInterface.useProgram(gl, program);
      // 开启深度检测
      gl.enable(gl.DEPTH_TEST);

      this._updateUniformMatrix(program);

      if (geo.type == GEOMETRY_TYPE.POINTS) {
        //  todo
      } else if (geo.type == GEOMETRY_TYPE.TRIANGLES) {
        this._setAttributes(mesh.attributeBuffer, mesh.indicesBuffer, geo, program)
      }

      let count = geo.indices.length;
      this._render(geo.type, count)
    }
  }
}
