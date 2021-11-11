import dao from './Dao.js'
import * as WebGLInterface from '../webgl/index.js'

export class ImageTexture {
  constructor(img) {
    const gl = dao.getData("gl");
    this.texture = WebGLInterface.createTexture(gl);
    this.texture.flipY = true;
    WebGLInterface.setTextureImage(gl, img, this.texture)
  }

  getTexture() {
    return this.texture;
  }
}
