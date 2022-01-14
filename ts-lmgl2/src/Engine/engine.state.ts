import { AlphaState, StencilState } from "./States";
import { DepthCullingState } from "./States/depthCullingState";

export class EngineState {
  protected _depthCullingState = new DepthCullingState();
  public cullBackFaces = true;
  private _gl: WebGLRenderingContext;
  protected _stencilState = new StencilState();
  public _alphaState = new AlphaState();
  protected _colorWriteChanged = true;
  protected _colorWrite = true;

  constructor(_gl: WebGLRenderingContext) {
    this._gl = _gl;
  }

  /**
   * Set the z offset to apply to current rendering
   * @param value defines the offset to apply
   */
  public setZOffset(value: number): void {
    this._depthCullingState.zOffset = value;
  }

  /**
   * Set various states to the webGL context
   * @param culling defines backface culling state
   * @param zOffset defines the value to apply to zOffset (0 by default)
   * @param force defines if states must be applied even if cache is up to date
   * @param reverseSide defines if culling must be reversed (CCW instead of CW and CW instead of CCW)
   */
  public setState(
    culling: boolean,
    zOffset: number = 0,
    force?: boolean,
    reverseSide = false
  ): void {
    // Culling
    if (this._depthCullingState.cull !== culling || force) {
      this._depthCullingState.cull = culling;
    }

    // Cull face
    var cullFace = this.cullBackFaces ? this._gl.BACK : this._gl.FRONT;
    if (this._depthCullingState.cullFace !== cullFace || force) {
      this._depthCullingState.cullFace = cullFace;
    }

    // Z offset
    this.setZOffset(zOffset);

    // Front face
    var frontFace = reverseSide ? this._gl.CW : this._gl.CCW;
    if (this._depthCullingState.frontFace !== frontFace || force) {
      this._depthCullingState.frontFace = frontFace;
    }
  }

  /**
   * Apply all cached states (depth, culling, stencil and alpha)
   */
  public applyStates() {
    this._depthCullingState.apply(this._gl);
    this._stencilState.apply(this._gl);
    this._alphaState.apply(this._gl);

    if (this._colorWriteChanged) {
      this._colorWriteChanged = false;
      const enable = this._colorWrite;
      this._gl.colorMask(enable, enable, enable, enable);
    }
  }
}
