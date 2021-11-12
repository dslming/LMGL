import dao from './Dao.js'
import * as WebGLInterface from '../webgl/index.js'


// 把渲染的内容输出到到一张纹理中
export class RenderTarget {
  constructor(width, height) {
    const gl = dao.getData("gl");
    this.texture = WebGLInterface.createTexture(gl);
    this.texture.flipY = false;
    WebGLInterface.setTextureNull(gl, this.texture, width, height)
    this.framebuffer = WebGLInterface.createFramebuffer(gl, this.texture)
  }

  getFrameBuffer() {
    return this.framebuffer;
  }

  getTexture() {
    return this.texture;
  }
}
