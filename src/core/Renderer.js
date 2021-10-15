
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

  _buildUniform(uniforms, program) {
    if (!uniforms) return

    const gl = dao.getData("gl");
    const keys = Object.keys(uniforms)
    for (let i = 0; i < keys.length; i++) {
      const name = keys[i]
      const { value, type } = uniforms[name]
      let uParam = gl.getUniformLocation(program, name);

      switch (type) {
        case "v2":
          gl.uniform2f(uParam, value.x, value.y);
          break;

        case "v3":
         gl.uniform3f(uParam, value.x, value.y, value.z);
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

  _updateUniformMatrix(program) {
    const gl = dao.getData("gl")
    const camera = dao.getData("camera")
    const projectionMatrixGL = gl.getUniformLocation(program, "projectionMatrix");
    camera.updateProjectionMatrix()
    gl.uniformMatrix4fv(projectionMatrixGL, false, new Float32Array(camera.projectionMatrix.elements));

    const modelViewMatrix = new Matrix4()
    const matrixWorld = new Matrix4()
    modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, matrixWorld);
    const modelViewMatrixGL = gl.getUniformLocation(program, "modelViewMatrix");
    gl.uniformMatrix4fv(modelViewMatrixGL, false, new Float32Array(modelViewMatrix.elements));
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

  _buildTriangleMesh(geo, program) {
    const { indices, attribute } = geo
    const gl = dao.getData("gl");
    this.indicesLength = 0

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
    // renderer.setVertexLength(vertexLength)

    if (indices) {
      // this.indicesLength += indices.length
      const indicesBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
      // renderer.setIndicesLength(this.indicesLength)
    }
  }

  _render(geoType, count) {
    //
    const gl = dao.getData("gl")
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
    canvas.height = height
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
      gl.useProgram(program);
      // 开启深度检测
      gl.enable(gl.DEPTH_TEST);
      if (!geo.type) { geo.type = GEOMETRY_TYPE.TRIANGLES }
      if (geo.type == GEOMETRY_TYPE.POINTS) {
        //  todo
      } else if (geo.type == GEOMETRY_TYPE.TRIANGLES) {
        this._buildTriangleMesh(geo, program)
      }

      this._buildUniform(mat.uniforms, program)
      this._updateUniformMatrix(program);

      let count = geo.indices.length;
      this._render(geo.type, count)
    }
  }
}
