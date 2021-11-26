import dao from './Dao.js'
import * as WebGLInterface from '../webgl/index.js'

export class ImageTexture {
  constructor(image) {
    this.image = image;
    const gl = dao.getData("gl");
    this.texture = WebGLInterface.createTexture(gl);
    this.texture.flipY = true;

    if (image.isDataImage) {
      WebGLInterface.bindTexture(gl, this.texture)
      WebGLInterface.setTextureImage2(gl, image.data, image.width, image.height)
    } else {
      WebGLInterface.setTextureImage(gl, image, this.texture)
    }
  }

  getTexture() {
    return this.texture;
  }
}
