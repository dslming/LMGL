import * as WebGLInterface from './WebGLInterface.js'

export default class Render {
  constructor(domId, width, height) {
    const canvas = document.getElementById(domId)
    this.canvas = canvas
    this.handleResize(width, height)
    const gl = this.getContext()
    this.gl = gl

    const program = WebGLInterface.createProgram(gl, {
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    gl.useProgram(program);
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);
  }

  getContext(canvas) {
    return canvas.getContext("webgl");
  }

  handleResize(width, height) {
    const { canvas} = this
    const ratio = window.devicePixelRatio
    canvas.width = width
    canvas.height = height
    canvas.style.width = width * ratio+"px"
    canvas.style.height = height * ratio + "px"
  }
}
