import dao from './Dao.js'
import * as WebGLInterface from '../webgl/index.js'


// 把渲染的内容输出到到一张立方体纹理中
export class RenderTargetCube {
  constructor(width, height) {
    this.width = width
    this.height = height
    const gl = dao.getData("gl");
    this.texture = WebGLInterface.createTexture(gl);
    WebGLInterface.setTextureNullCube(gl, this.texture, width, height)
    this.framebuffer = WebGLInterface.createFramebuffer(gl)
  }

  getFrameBuffer() {
    return this.framebuffer;
  }

  getTexture() {
    return this.texture;
  }
}
