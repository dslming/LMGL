
// WebGLIndexedBufferRenderer.js


import { GEOMETRY_TYPE, SIDE } from './constants.js'
import dao from './Dao.js'
import * as WebGLInterface from '../webgl/index.js'
import { Matrix4 } from '../math/Matrix4.js'

let flag = false;
export default class Renderer {
  constructor(dom, width, height) {
    const canvas = dom
    this.canvas = canvas
    this.handleResize(width, height)
    this.currentPrograme = null
    this.autoClear = false;
  }

  _updateUniformMatrix(program, matrixWorld) {
    const gl = dao.getData("gl")
    const camera = dao.getData("camera")

    camera.updateProjectionMatrix()
    WebGLInterface.setUniform(gl, program, "projectionMatrix", camera.projectionMatrix.elements, "m4")

    const modelViewMatrix = new Matrix4()
    modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, matrixWorld);
    WebGLInterface.setUniform(gl, program, "modelViewMatrix", modelViewMatrix.elements, "m4")
  }

  // 根据材质设置webgl状态
  _readMaterial(material) {
    const gl = dao.getData("gl")
    const { blending, depthTest,side } = material;
    WebGLInterface.setDepthTest(gl, depthTest);
    WebGLInterface.setBlend(gl, blending);
    WebGLInterface.setSide(gl, side);
  }

  renderMesh(mesh) {
    const gl = dao.getData("gl")
    const { geometry, material } = mesh;
    const program = material.program;
    WebGLInterface.useProgram(gl, program);

    mesh.setAttributesBuffer();
    this._updateUniformMatrix(program, mesh.matrix);
    material.setUniform()

    const geoType = geometry.type;
    let count = geometry.indices.length;
    count = count == 0 ? geometry.count : count;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    this._readMaterial(material);
    if (geoType == GEOMETRY_TYPE.POINTS) {
      gl.drawArrays(gl.POINTS, 0, 1);
    } else if (geoType == GEOMETRY_TYPE.TRIANGLES) {
      gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
    } else if (geoType == GEOMETRY_TYPE.TRIANGLE_FAN) {
      // gl.drawArrays(gl.TRIANGLE_FAN, 0, count);
    }
  }

  getContext() {
    return this.canvas.getContext("experimental-webgl");
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
    const allMesh = dao.getData("allMesh")|| []
    this.clear()

    for (let i = 0; i < allMesh.length; i++) {
      const mesh = allMesh[i]
      this.renderMesh(mesh)
    }
  }
}
