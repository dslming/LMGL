import { Constants } from "./constants";
import { Engine } from "./engine";
import { AlphaState } from "./States/alphaCullingState";

export class EngineAlpha {
  public engine: Engine;
  private _gl: WebGLRenderingContext;
  public _alphaState = new AlphaState();
  private _alphaMode: number;
  private _alphaEquation: number;

  constructor(_gl: WebGLRenderingContext, engine: Engine) {
    this._gl = _gl;
    this.engine = engine;
    this._alphaMode = Constants.ALPHA_ADD;
    this._alphaEquation = Constants.ALPHA_DISABLE;
  }

  /**
   * Sets alpha constants used by some alpha blending modes
   * @param r defines the red component
   * @param g defines the green component
   * @param b defines the blue component
   * @param a defines the alpha component
   */
  setAlphaConstants(r: number, g: number, b: number, a: number): void {
    this._alphaState.setAlphaBlendConstants(r, g, b, a);
  }

  /**
   * Sets the current alpha mode
   * @param mode defines the mode to use (one of the Engine.ALPHA_XXX)
   * @param noDepthWriteChange defines if depth writing state should remains unchanged (false by default)
   * @see https://doc.babylonjs.com/resources/transparency_and_how_meshes_are_rendered
   */
  setAlphaMode(mode: number, noDepthWriteChange?: boolean): void {
    if (this._alphaMode === mode) {
      return;
    }

    switch (mode) {
      case Constants.ALPHA_DISABLE:
        this._alphaState.alphaBlend = false;
        break;
      case Constants.ALPHA_PREMULTIPLIED:
        this._alphaState.setAlphaBlendFunctionParameters(this._gl.ONE, this._gl.ONE_MINUS_SRC_ALPHA, this._gl.ONE, this._gl.ONE);
        this._alphaState.alphaBlend = true;
        break;
      case Constants.ALPHA_PREMULTIPLIED_PORTERDUFF:
        this._alphaState.setAlphaBlendFunctionParameters(this._gl.ONE, this._gl.ONE_MINUS_SRC_ALPHA, this._gl.ONE, this._gl.ONE_MINUS_SRC_ALPHA);
        this._alphaState.alphaBlend = true;
        break;
      case Constants.ALPHA_COMBINE:
        this._alphaState.setAlphaBlendFunctionParameters(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA, this._gl.ONE, this._gl.ONE);
        this._alphaState.alphaBlend = true;
        break;
      case Constants.ALPHA_ONEONE:
        this._alphaState.setAlphaBlendFunctionParameters(this._gl.ONE, this._gl.ONE, this._gl.ZERO, this._gl.ONE);
        this._alphaState.alphaBlend = true;
        break;
      case Constants.ALPHA_ADD:
        this._alphaState.setAlphaBlendFunctionParameters(this._gl.SRC_ALPHA, this._gl.ONE, this._gl.ZERO, this._gl.ONE);
        this._alphaState.alphaBlend = true;
        break;
      case Constants.ALPHA_SUBTRACT:
        this._alphaState.setAlphaBlendFunctionParameters(this._gl.ZERO, this._gl.ONE_MINUS_SRC_COLOR, this._gl.ONE, this._gl.ONE);
        this._alphaState.alphaBlend = true;
        break;
      case Constants.ALPHA_MULTIPLY:
        this._alphaState.setAlphaBlendFunctionParameters(this._gl.DST_COLOR, this._gl.ZERO, this._gl.ONE, this._gl.ONE);
        this._alphaState.alphaBlend = true;
        break;
      case Constants.ALPHA_MAXIMIZED:
        this._alphaState.setAlphaBlendFunctionParameters(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_COLOR, this._gl.ONE, this._gl.ONE);
        this._alphaState.alphaBlend = true;
        break;
      case Constants.ALPHA_INTERPOLATE:
        this._alphaState.setAlphaBlendFunctionParameters(
          this._gl.CONSTANT_COLOR,
          this._gl.ONE_MINUS_CONSTANT_COLOR,
          this._gl.CONSTANT_ALPHA,
          this._gl.ONE_MINUS_CONSTANT_ALPHA
        );
        this._alphaState.alphaBlend = true;
        break;
      case Constants.ALPHA_SCREENMODE:
        this._alphaState.setAlphaBlendFunctionParameters(this._gl.ONE, this._gl.ONE_MINUS_SRC_COLOR, this._gl.ONE, this._gl.ONE_MINUS_SRC_ALPHA);
        this._alphaState.alphaBlend = true;
        break;
      case Constants.ALPHA_ONEONE_ONEONE:
        this._alphaState.setAlphaBlendFunctionParameters(this._gl.ONE, this._gl.ONE, this._gl.ONE, this._gl.ONE);
        this._alphaState.alphaBlend = true;
        break;
      case Constants.ALPHA_ALPHATOCOLOR:
        this._alphaState.setAlphaBlendFunctionParameters(this._gl.DST_ALPHA, this._gl.ONE, this._gl.ZERO, this._gl.ZERO);
        this._alphaState.alphaBlend = true;
        break;
      case Constants.ALPHA_REVERSEONEMINUS:
        this._alphaState.setAlphaBlendFunctionParameters(
          this._gl.ONE_MINUS_DST_COLOR,
          this._gl.ONE_MINUS_SRC_COLOR,
          this._gl.ONE_MINUS_DST_ALPHA,
          this._gl.ONE_MINUS_SRC_ALPHA
        );
        this._alphaState.alphaBlend = true;
        break;
      case Constants.ALPHA_SRC_DSTONEMINUSSRCALPHA:
        this._alphaState.setAlphaBlendFunctionParameters(this._gl.ONE, this._gl.ONE_MINUS_SRC_ALPHA, this._gl.ONE, this._gl.ONE_MINUS_SRC_ALPHA);
        this._alphaState.alphaBlend = true;
        break;
      case Constants.ALPHA_ONEONE_ONEZERO:
        this._alphaState.setAlphaBlendFunctionParameters(this._gl.ONE, this._gl.ONE, this._gl.ONE, this._gl.ZERO);
        this._alphaState.alphaBlend = true;
        break;
      case Constants.ALPHA_EXCLUSION:
        this._alphaState.setAlphaBlendFunctionParameters(this._gl.ONE_MINUS_DST_COLOR, this._gl.ONE_MINUS_SRC_COLOR, this._gl.ZERO, this._gl.ONE);
        this._alphaState.alphaBlend = true;
        break;
      case Constants.ALPHA_LAYER_ACCUMULATE:
        // Same as ALPHA_COMBINE but accumulates (1 - alpha) values in the alpha channel for a later readout in order independant transparency
        this._alphaState.setAlphaBlendFunctionParameters(
          this._gl.SRC_ALPHA,
          this._gl.ONE_MINUS_SRC_ALPHA,
          this._gl.ONE,
          this._gl.ONE_MINUS_SRC_ALPHA
        );
        this._alphaState.alphaBlend = true;
        break;
    }
    if (!noDepthWriteChange) {
      this.engine.engineState.depthCullingState.depthMask = mode === Constants.ALPHA_DISABLE;
    }
    this._alphaMode = mode;
  }

  /**
   * Gets the current alpha mode
   * @see https://doc.babylonjs.com/resources/transparency_and_how_meshes_are_rendered
   * @returns the current alpha mode
   */
  getAlphaMode(): number {
    return this._alphaMode;
  }

  /**
   * Sets the current alpha equation
   * @param equation defines the equation to use (one of the Engine.ALPHA_EQUATION_XXX)
   */
  setAlphaEquation(equation: number): void {
    if (this._alphaEquation === equation) {
      return;
    }

    switch (equation) {
      case Constants.ALPHA_EQUATION_ADD:
        this._alphaState.setAlphaEquationParameters(Constants.GL_ALPHA_EQUATION_ADD, Constants.GL_ALPHA_EQUATION_ADD);
        break;
      case Constants.ALPHA_EQUATION_SUBSTRACT:
        this._alphaState.setAlphaEquationParameters(Constants.GL_ALPHA_EQUATION_SUBTRACT, Constants.GL_ALPHA_EQUATION_SUBTRACT);
        break;
      case Constants.ALPHA_EQUATION_REVERSE_SUBTRACT:
        this._alphaState.setAlphaEquationParameters(Constants.GL_ALPHA_EQUATION_REVERSE_SUBTRACT, Constants.GL_ALPHA_EQUATION_REVERSE_SUBTRACT);
        break;
      case Constants.ALPHA_EQUATION_MAX:
        this._alphaState.setAlphaEquationParameters(Constants.GL_ALPHA_EQUATION_MAX, Constants.GL_ALPHA_EQUATION_MAX);
        break;
      case Constants.ALPHA_EQUATION_MIN:
        this._alphaState.setAlphaEquationParameters(Constants.GL_ALPHA_EQUATION_MIN, Constants.GL_ALPHA_EQUATION_MIN);
        break;
      case Constants.ALPHA_EQUATION_DARKEN:
        this._alphaState.setAlphaEquationParameters(Constants.GL_ALPHA_EQUATION_MIN, Constants.GL_ALPHA_EQUATION_ADD);
        break;
    }
    this._alphaEquation = equation;
  }

  /**
   * Gets the current alpha equation.
   * @returns the current alpha equation
   */
  getAlphaEquation(): number {
    return this._alphaEquation;
  }
}
