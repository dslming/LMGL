
export default class Renderer {
  constructor(domId, width, height) {
    const canvas = document.getElementById(domId)
    this.canvas = canvas
    this.handleResize(width, height)
    const gl = this.getContext()
    this.gl = gl
  }

  getContext() {
    return this.canvas.getContext("webgl");
  }

  setIndicesLength(v) {
    this.indicesLength = v
  }

  handleResize(width, height) {
    const { canvas} = this
    const ratio = window.devicePixelRatio
    canvas.width = width
    canvas.height = height
    // canvas.style.width = width * ratio+"px"
    // canvas.style.height = height * ratio + "px"
  }

  render() {
    const { gl } = this
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.drawArrays(gl.POINTS, 0, 1);

    let primitiveType = gl.TRIANGLES;
    let drawOffset = 0;
    // gl.drawArrays(primitiveType, drawOffset, 3);

    gl.drawElements(gl.TRIANGLES, this.indicesLength, gl.UNSIGNED_SHORT, 0);

  }

}
