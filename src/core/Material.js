import dao from './Dao.js'
import * as WebGLInterface from '../webgl/index.js'
import { SIDE, BLENDING_TYPE, BLENDING_FACTOR } from './constants.js'
export class Material {
  constructor(uniform, shader) {
    let mat = Object.assign(uniform, shader || {});
    if (!uniform.uniforms) {
      // 深拷贝对象
      //  mat = JSON.parse(JSON.stringify(mat))
    }


    this.program = this._buildMaterial(mat);
    this.uniforms = mat.uniforms || {};

    this.blending = false;
    this.blendingType = BLENDING_TYPE.RGBA;
    this.blendRGBASrc = BLENDING_FACTOR.ONE;
    this.blendRGBADst = BLENDING_FACTOR.ONE;
    this.blendRGB_ASrc = BLENDING_FACTOR.SRC_ALPHA
    this.blendRGB_ADst = BLENDING_FACTOR.ONE_MINUS_SRC_ALPHA;

    this.depthTest = true;
    this.side = SIDE.FrontSide;
    // 是否需要每帧更新uniform变量
    this.needUpdate = true;
    this.setUniform();
  }

  _buildMaterial(mat) {
    const gl = dao.getData("gl")
    return WebGLInterface.createProgram(gl, mat);
  }

  setUniform() {
    const { program, uniforms } = this
    const gl = dao.getData("gl");
    WebGLInterface.useProgram(gl, program);

    const keys = Object.keys(uniforms)
    for (let i = 0; i < keys.length; i++) {
      const name = keys[i]
      const { value, type } = uniforms[name]
      WebGLInterface.setUniform(gl, program, name, value, type, this.texture)
    }
  }
}
