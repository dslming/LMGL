import dao from './Dao.js'
import * as WebGLInterface from '../webgl/index.js'


// 把渲染的内容输出到到一张纹理中
export class RenderTarget {
  constructor(width, height, opations) {
    this.width = width
    this.height = height
    const sample = 8;

    const gl = dao.getData("gl");
    this.texture = WebGLInterface.createTexture(gl);
    WebGLInterface.bindTexture(gl, this.texture);
    WebGLInterface.setTextureNull(gl, width, height)

    this.framebuffer = WebGLInterface.createFramebuffer(gl);
    WebGLInterface.bindFramebuffer(gl, this.framebuffer)
    WebGLInterface.attachFramebufferTexture(gl, this.texture)

    if (opations && opations.depth) {
      this.renderbufferDepth = WebGLInterface.createRenderbuffer(gl)
      gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbufferDepth);
      if (opations.isMultisample) {
        gl.renderbufferStorageMultisample(gl.RENDERBUFFER, sample, gl.DEPTH_COMPONENT16, width, height)
      } else {
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
      }
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbufferDepth)
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }

    if (opations && opations.isMultisample) {
      this.renderbuffer = WebGLInterface.createRenderbuffer(gl)
      gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
      if (opations.isMultisample) {
        gl.renderbufferStorageMultisample(gl.RENDERBUFFER, sample, gl.RGB8, width, height);
      } else {
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGB8, width, height);
      }
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
