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
        WebGLInterface.setTextureNull(gl, width, height, i);
        WebGLInterface.activeTexture(gl, i);
        WebGLInterface.bindTexture(gl, this.texture[i]);

        const name = gl.COLOR_ATTACHMENT0 + i;
        this.drawBuffers[i] = name;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, name, gl.TEXTURE_2D, this.texture[i], 0);
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
