import dao from './Dao.js'
import * as WebGLInterface from '../webgl/index.js'

// 立方体纹理
export class ImageCubeTexture {
  constructor(images) {
    const gl = dao.getData("gl");
    this.texture = WebGLInterface.createTexture(gl);
    WebGLInterface.bindCubeTexture(gl, this.texture)
    WebGLInterface.setCubeTextureImage(gl, images)
  }

  getTexture() {
    return this.texture;
  }
}
