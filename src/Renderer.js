
import { MESH_TYPE} from './global.js'
export default class Renderer {
  constructor(dom, width, height) {
    const canvas = dom
    this.canvas = canvas
    this.handleResize(width, height)
    const gl = this.getContext()
    this.gl = gl
    this._setGlState()
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

  _setGlState() {
    const { gl} = this
     gl.enable(gl.DEPTH_TEST);
  }
  clear() {
     const { gl } = this
     gl.clearColor(0, 0, 0, 1.0);
     gl.clear(gl.COLOR_BUFFER_BIT);
  }

  render(type) {
    this.clear()
    const { gl } = this
    if (type == MESH_TYPE.POINTS) {
      gl.drawArrays(gl.POINTS, 0, 1);
    } else if (type == MESH_TYPE.TRIANGLES) {
      if (this.indicesLength) {
        gl.drawElements(gl.TRIANGLES, this.indicesLength, gl.UNSIGNED_SHORT, 0);
      } else {
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vertexLength);
      }
    }
  }
}
