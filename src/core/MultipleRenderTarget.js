import dao from './Dao.js'
import * as WebGLInterface from '../webgl/index.js'


// 把渲染的内容输出到到多张纹理中
export class MultipleRenderTarget {
  constructor(width, height, opations) {
    this.width = width
    this.height = height
    const gl = dao.getData("gl");


    this.framebuffer = WebGLInterface.createFramebuffer(gl);
    WebGLInterface.bindFramebuffer(gl, this.framebuffer)

    if (opations && opations.textureCount) {
      this.texture = [];
      this.drawBuffers = [];

      for (let i = 0; i < opations.textureCount; i++) {
        this.texture[i] = WebGLInterface.createTexture(gl);
        WebGLInterface.bindTexture(gl, this.texture[i]);
        WebGLInterface.setTextureNull(gl, this.texture[i], width, height);
        this.drawBuffers[i] = gl.COLOR_ATTACHMENT0 + i;
      }
    }

    if (opations && opations.depth) {
      this.renderbuffer = WebGLInterface.createRenderbuffer(gl)
      gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer)
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }
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
