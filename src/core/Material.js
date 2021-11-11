import dao from './Dao.js'
import * as WebGLInterface from '../webgl/index.js'
import { SIDE } from './constants.js'

export default class Material {
  constructor(mat) {
    const gl = dao.getData("gl");
    this.program = this._buildMaterial(mat);
    this.uniforms = mat.uniforms || {};

    // this._buildUniform(this.uniforms, this.program)
    // this.opacity = 1;
    // this.format = RGBAFormat;
    // this.transparent = false;

    this.blending = false;
    this.depthTest = true;
    this.side = SIDE.FrontSide;
    // this.blendSrc = SrcAlphaFactor;
    // this.blendDst = OneMinusSrcAlphaFactor;
    // this.blendEquation = AddEquation;
    // this.blendSrcAlpha = null;
    // this.blendDstAlpha = null;
    // this.blendEquationAlpha = null;

    // this.side = FrontSide;

    // this.depthFunc = LessEqualDepth;
    // this.depthWrite = true;
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
