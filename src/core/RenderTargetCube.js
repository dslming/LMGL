import dao from './Dao.js'
import * as WebGLInterface from '../webgl/index.js'


// 把渲染的内容输出到到一张立方体纹理中
export class RenderTargetCube {
  constructor(width, height, opations) {
    this.width = width
    this.height = height
    const gl = dao.getData("gl");
    this.texture = WebGLInterface.createTexture(gl);
    WebGLInterface.bindCubeTexture(gl, this.texture)
    WebGLInterface.setTextureNullCube(gl, width, height)
    this.framebuffer = WebGLInterface.createFramebuffer(gl)
    WebGLInterface.bindFramebuffer(gl, this.framebuffer)

    if (opations && opations.depth) {
      this.renderbuffer = WebGLInterface.createRenderbuffer(gl)
      gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer)
      // gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }
  }

  getFrameBuffer() {
    return this.framebuffer;
  }

  getTexture() {
    return this.texture;
  }
}
