import dao from '../Dao.js'
import * as WebGLInterface from '../WebGLInterface.js'

export default class Material {
  constructor(mat) {
    this.program = this._buildMaterial(mat);
    this.uniforms = mat.uniforms;

    // this.opacity = 1;
    // this.format = RGBAFormat;
    // this.transparent = false;

    // this.blending = NormalBlending;
    // this.blendSrc = SrcAlphaFactor;
    // this.blendDst = OneMinusSrcAlphaFactor;
    // this.blendEquation = AddEquation;
    // this.blendSrcAlpha = null;
    // this.blendDstAlpha = null;
    // this.blendEquationAlpha = null;

    // this.side = FrontSide;

    // this.depthFunc = LessEqualDepth;
    // this.depthTest = true;
    // this.depthWrite = true;
  }

  _buildMaterial(mat) {
    const gl = dao.getData("gl")
    return WebGLInterface.createProgram(gl, mat);
  }
}
