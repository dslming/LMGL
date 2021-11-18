import dao from './Dao.js'
import * as WebGLInterface from '../webgl/index.js'


// 把渲染的内容输出到到一张纹理中
export class RenderTarget {
  constructor(width, height) {
    this.width = width
    this.height = height
    const gl = dao.getData("gl");
    this.texture = WebGLInterface.createTexture(gl);
    WebGLInterface.bindTexture(gl, this.texture);

    this.texture.flipY = false;
    WebGLInterface.setTextureNull(gl, this.texture, width, height)

    this.framebuffer = WebGLInterface.createFramebuffer(gl)
    WebGLInterface.bindFramebuffer(gl, this.framebuffer)
    WebGLInterface.attachFramebufferTexture(gl, this.texture)

    this.renderbuffer = WebGLInterface.createRenderbuffer(gl)
    WebGLInterface.bindRenderbuffer(gl, this.renderbuffer)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer);

    // WebGLInterface.checkFrameBufferStatus(gl)
    // WebGLInterface.bindRenderbuffer(gl, null)
    //  WebGLInterface.bindFramebuffer(gl, null)
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    WebGLInterface.checkFrameBufferStatus(gl)
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
