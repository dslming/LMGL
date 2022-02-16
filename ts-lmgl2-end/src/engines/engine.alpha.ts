import { Engine } from "./engine";

export enum BlendMode {
  BLENDMODE_ZERO = 0,
  BLENDMODE_ONE = 1,
  BLENDMODE_SRC_COLOR =2,
  BLENDMODE_ONE_MINUS_SRC_COLOR =3,
  BLENDMODE_DST_COLOR = 4,
  BLENDMODE_ONE_MINUS_DST_COLOR = 5,
  BLENDMODE_SRC_ALPHA = 5,
  BLENDMODE_SRC_ALPHA_SATURATE = 7,
  BLENDMODE_ONE_MINUS_SRC_ALPHA = 8,
  BLENDMODE_DST_ALPHA = 9,
  BLENDMODE_ONE_MINUS_DST_ALPHA = 10,
};

export enum BlendeEquation {
  BLENDEQUATION_ADD = 0,
  BLENDEQUATION_SUBTRACT = 1,
  BLENDEQUATION_REVERSE_SUBTRACT = 2,
  BLENDEQUATION_MIN = 3,
  BLENDEQUATION_MAX = 4,
}

export class EngineAplha {
  private glBlendFunction: number[];
  private glComparison: number[];
  private glBlendEquation: number[];

  private _engine: Engine;
  private blendSrc: BlendMode;
  private blendDst: BlendMode;
  private separateAlphaBlend: boolean;
  private _gl: WebGLRenderingContext;
  blendDstAlpha: BlendMode;
  blendSrcAlpha: BlendMode;
  blendEquation: BlendeEquation;
  separateAlphaEquation: boolean;

  constructor(engine: Engine) {
    this._engine = engine;
    this._gl = this._engine.gl;
    this._init();
  }

  private _init() {
    const { _gl: gl } = this;
    this.glBlendFunction = [
      gl.ZERO,
      gl.ONE,
      gl.SRC_COLOR,
      gl.ONE_MINUS_SRC_COLOR,
      gl.DST_COLOR,
      gl.ONE_MINUS_DST_COLOR,
      gl.SRC_ALPHA,
      gl.SRC_ALPHA_SATURATE,
      gl.ONE_MINUS_SRC_ALPHA,
      gl.DST_ALPHA,
      gl.ONE_MINUS_DST_ALPHA,
    ];

    this.glComparison = [gl.NEVER, gl.LESS, gl.EQUAL, gl.LEQUAL, gl.GREATER, gl.NOTEQUAL, gl.GEQUAL, gl.ALWAYS];

    this.glBlendEquation = [gl.FUNC_ADD, gl.FUNC_SUBTRACT, gl.FUNC_REVERSE_SUBTRACT, gl.MIN, gl.MAX];
  }

  setBlendFunction(blendSrc: BlendMode, blendDst: BlendMode) {
    const { _gl: gl } = this;
    if (this.blendSrc !== blendSrc || this.blendDst !== blendDst || this.separateAlphaBlend) {
      gl.blendFunc(this.glBlendFunction[blendSrc], this.glBlendFunction[blendDst]);
      this.blendSrc = blendSrc;
      this.blendDst = blendDst;
      this.separateAlphaBlend = false;
    }
  }

  setBlendFunctionSeparate(blendSrc: BlendMode, blendDst: BlendMode, blendSrcAlpha: BlendMode, blendDstAlpha: BlendMode) {
    const { _gl: gl } = this;

    if (this.blendSrc !== blendSrc || this.blendDst !== blendDst || this.blendSrcAlpha !== blendSrcAlpha || this.blendDstAlpha !== blendDstAlpha || !this.separateAlphaBlend) {
      gl.blendFuncSeparate(this.glBlendFunction[blendSrc], this.glBlendFunction[blendDst], this.glBlendFunction[blendSrcAlpha], this.glBlendFunction[blendDstAlpha]);
      this.blendSrc = blendSrc;
      this.blendDst = blendDst;
      this.blendSrcAlpha = blendSrcAlpha;
      this.blendDstAlpha = blendDstAlpha;
      this.separateAlphaBlend = true;
    }
  }

  setBlendEquation(blendEquation: BlendeEquation) {
    const { _gl: gl } = this;

    if (this.blendEquation !== blendEquation || this.separateAlphaEquation) {
      gl.blendEquation(this.glBlendEquation[blendEquation]);
      this.blendEquation = blendEquation;
      this.separateAlphaEquation = false;
    }
  }
}
