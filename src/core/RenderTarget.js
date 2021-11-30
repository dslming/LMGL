import dao from './Dao.js'
import * as WebGLInterface from '../webgl/index.js'


// 把渲染的内容输出到到一张纹理中
export class RenderTarget {
  constructor(width, height, opations) {
    this.width = width
    this.height = height
    const gl = dao.getData("gl");
    this.texture = WebGLInterface.createTexture(gl);
    WebGLInterface.bindTexture(gl, this.texture);
    WebGLInterface.setTextureNull(gl, width, height)

    this.framebuffer = WebGLInterface.createFramebuffer(gl);
    WebGLInterface.bindFramebuffer(gl, this.framebuffer)
    WebGLInterface.attachFramebufferTexture(gl, this.texture)

    if (opations && opations.depth) {
      this.renderbuffer = WebGLInterface.createRenderbuffer(gl)
      gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer)
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }

    //  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    WebGLInterface.bindTexture(gl, null);
  }

  getFrameBuffer() {
    return this.framebuffer;
  }

  getRenderBuffer() {
    return this.renderbuffer;
  }

  getTexture() {
    return this.texture;
  }
}
