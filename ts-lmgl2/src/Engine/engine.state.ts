import { Engine } from "..";
import { Nullable } from "../types";
import { Constants } from "./constants";
import { AlphaState, StencilState } from "./States";
import { DepthCullingState } from "./States/depthCullingState";

export class EngineState {
  engine: Engine;
  _cachedStencilBuffer: boolean;
  _cachedStencilFunction: number;
  _cachedStencilMask: number;
  _cachedStencilOperationPass: number;
  _cachedStencilOperationFail: number;
  _cachedStencilOperationDepthFail: number;
  _cachedStencilReference: number;
  _isStencilEnable = false;

  /**
   * Gets the depth culling state manager
   */
  public get depthCullingState(): DepthCullingState {
    return this._depthCullingState;
  }
  isStencilEnable = false;
  protected _depthCullingState = new DepthCullingState();
  public cullBackFaces = true;
  private _gl: WebGLRenderingContext;
  protected _stencilState = new StencilState();
  protected _colorWriteChanged = true;
  protected _colorWrite = true;

  constructor(_gl: WebGLRenderingContext, engine: Engine) {
    this._gl = _gl;
    this.engine = engine;
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
  public setState(culling: boolean, zOffset: number = 0, force?: boolean, reverseSide = false): void {
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
    this.engine.engineAlpha._alphaState.apply(this._gl);

    if (this._colorWriteChanged) {
      this._colorWriteChanged = false;
      const enable = this._colorWrite;
      this._gl.colorMask(enable, enable, enable, enable);
    }
  }

  /*------------------------------------ stencil -----------------------------------*/
  /**
   * Gets a boolean indicating if stencil buffer is enabled
   * @returns the current stencil buffer state
   */
  public getStencilBuffer(): boolean {
    return this._stencilState.stencilTest;
  }

  /**
   * Enable or disable the stencil buffer
   * @param enable defines if the stencil buffer must be enabled or disabled
   */
  public setStencilBuffer(enable: boolean): void {
    this._stencilState.stencilTest = enable;
  }

  /**
   * Gets the current stencil mask
   * @returns a number defining the new stencil mask to use
   */
  public getStencilMask(): number {
    return this._stencilState.stencilMask;
  }

  /**
   * Sets the current stencil mask
   * @param mask defines the new stencil mask to use
   */
  public setStencilMask(mask: number): void {
    this._stencilState.stencilMask = mask;
  }

  /**
   * Gets the current stencil function
   * @returns a number defining the stencil function to use
   */
  public getStencilFunction(): number {
    return this._stencilState.stencilFunc;
  }

  /**
   * Gets the current stencil reference value
   * @returns a number defining the stencil reference value to use
   */
  public getStencilFunctionReference(): number {
    return this._stencilState.stencilFuncRef;
  }

  /**
   * Gets the current stencil mask
   * @returns a number defining the stencil mask to use
   */
  public getStencilFunctionMask(): number {
    return this._stencilState.stencilFuncMask;
  }

  /**
   * Sets the current stencil function
   * @param stencilFunc defines the new stencil function to use
   */
  public setStencilFunction(stencilFunc: number) {
    this._stencilState.stencilFunc = stencilFunc;
  }

  /**
   * Sets the current stencil reference
   * @param reference defines the new stencil reference to use
   */
  public setStencilFunctionReference(reference: number) {
    this._stencilState.stencilFuncRef = reference;
  }

  /**
   * Sets the current stencil mask
   * @param mask defines the new stencil mask to use
   */
  public setStencilFunctionMask(mask: number) {
    this._stencilState.stencilFuncMask = mask;
  }

  /**
   * Gets the current stencil operation when stencil fails
   * @returns a number defining stencil operation to use when stencil fails
   */
  public getStencilOperationFail(): number {
    return this._stencilState.stencilOpStencilFail;
  }

  /**
   * Gets the current stencil operation when depth fails
   * @returns a number defining stencil operation to use when depth fails
   */
  public getStencilOperationDepthFail(): number {
    return this._stencilState.stencilOpDepthFail;
  }

  /**
   * Gets the current stencil operation when stencil passes
   * @returns a number defining stencil operation to use when stencil passes
   */
  public getStencilOperationPass(): number {
    return this._stencilState.stencilOpStencilDepthPass;
  }

  /**
   * Sets the stencil operation to use when stencil fails
   * @param operation defines the stencil operation to use when stencil fails
   */
  public setStencilOperationFail(operation: number): void {
    this._stencilState.stencilOpStencilFail = operation;
  }

  /**
   * Sets the stencil operation to use when depth fails
   * @param operation defines the stencil operation to use when depth fails
   */
  public setStencilOperationDepthFail(operation: number): void {
    this._stencilState.stencilOpDepthFail = operation;
  }

  /**
   * Sets the stencil operation to use when stencil passes
   * @param operation defines the stencil operation to use when stencil passes
   */
  public setStencilOperationPass(operation: number): void {
    this._stencilState.stencilOpStencilDepthPass = operation;
  }

  /*------------------------------------ depth  -----------------------------------*/
  /**
   * Sets a boolean indicating if the dithering state is enabled or disabled
   * @param value defines the dithering state
   */
  public setDitheringState(value: boolean): void {
    if (value) {
      this._gl.enable(this._gl.DITHER);
    } else {
      this._gl.disable(this._gl.DITHER);
    }
  }

  /**
   * Gets the current depth function
   * @returns a number defining the depth function
   */
  public getDepthFunction(): Nullable<number> {
    return this._depthCullingState.depthFunc;
  }

  /**
   * Sets the current depth function
   * @param depthFunc defines the function to use
   */
  public setDepthFunction(depthFunc: number) {
    this._depthCullingState.depthFunc = depthFunc;
  }

  /**
   * Sets the current depth function to GREATER
   */
  public setDepthFunctionToGreater(): void {
    this.setDepthFunction(Constants.GREATER);
  }

  /**
   * Sets the current depth function to GEQUAL
   */
  public setDepthFunctionToGreaterOrEqual(): void {
    this.setDepthFunction(Constants.GEQUAL);
  }

  /**
   * Sets the current depth function to LESS
   */
  public setDepthFunctionToLess(): void {
    this.setDepthFunction(Constants.LESS);
  }

  /**
   * Sets the current depth function to LEQUAL
   */
  public setDepthFunctionToLessOrEqual(): void {
    this.setDepthFunction(Constants.LEQUAL);
  }

  /**
   * Enable or disable color writing
   * @param enable defines the state to set
   */
  public setColorWrite(enable: boolean): void {
    if (enable !== this._colorWrite) {
      this._colorWriteChanged = true;
      this._colorWrite = enable;
    }
  }

  /**
   * Gets a boolean indicating if color writing is enabled
   * @returns the current color writing state
   */
  public getColorWrite(): boolean {
    return this._colorWrite;
  }

  /**
   * Enable or disable depth writing
   * @param enable defines the state to set
   */
  public setDepthWrite(enable: boolean): void {
    this._depthCullingState.depthMask = enable;
  }

  /**
  * Enable or disable depth buffering
  * @param enable defines the state to set
  */
  public setDepthBuffer(enable: boolean): void {
    this._depthCullingState.depthTest = enable;
  }

  /**
  * Caches the the state of the stencil buffer
  */
  public cacheStencilState() {
    this._cachedStencilBuffer = this.getStencilBuffer();
    this._cachedStencilFunction = this.getStencilFunction();
    this._cachedStencilMask = this.getStencilMask();
    this._cachedStencilOperationPass = this.getStencilOperationPass();
    this._cachedStencilOperationFail = this.getStencilOperationFail();
    this._cachedStencilOperationDepthFail = this.getStencilOperationDepthFail();
    this._cachedStencilReference = this.getStencilFunctionReference();
  }

  /**
  * Restores the state of the stencil buffer
  */
  public restoreStencilState() {
    this.setStencilFunction(this._cachedStencilFunction);
    this.setStencilMask(this._cachedStencilMask);
    this.setStencilBuffer(this._cachedStencilBuffer);
    this.setStencilOperationPass(this._cachedStencilOperationPass);
    this.setStencilOperationFail(this._cachedStencilOperationFail);
    this.setStencilOperationDepthFail(this._cachedStencilOperationDepthFail);
    this.setStencilFunctionReference(this._cachedStencilReference);
  }
}
