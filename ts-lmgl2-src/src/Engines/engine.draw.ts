import { IColor4Like } from "../Maths/math.like";
import { Nullable } from "../types";
import { Constants } from "./constants";
import { WebGLEngine } from "./webglEngine";

export class EngineDraw {
  public engine: WebGLEngine;
  private _gl: WebGLRenderingContext;

  constructor(_gl: WebGLRenderingContext, engine: WebGLEngine) {
    this._gl = _gl;
    this.engine = engine;
  }

  drawElementsType(fillMode: number, indexStart: number, indexCount: number, instancesCount?: number): void {
    // Apply states
    this.engine.engineState.applyStates();

    // this._reportDrawCall();

    // Render

    const drawMode = this._drawMode(fillMode);
    var indexFormat = this.engine.engineVertex._uintIndicesCurrentlySet ? this._gl.UNSIGNED_INT : this._gl.UNSIGNED_SHORT;
    var mult = this.engine.engineVertex._uintIndicesCurrentlySet ? 4 : 2;
    if (instancesCount) {
      this._gl.drawElementsInstanced(drawMode, indexCount, indexFormat, indexStart * mult, instancesCount);
    } else {
      this._gl.drawElements(drawMode, indexCount, indexFormat, indexStart * mult);
    }
  }

  /**
   * Draw a list of unindexed primitives
   * @param fillMode defines the primitive to use
   * @param verticesStart defines the index of first vertex to draw
   * @param verticesCount defines the count of vertices to draw
   * @param instancesCount defines the number of instances to draw (if instanciation is enabled)
   */
  public drawArraysType(fillMode: number, verticesStart: number, verticesCount: number, instancesCount?: number): void {
    // Apply states
    this.engine.engineState.applyStates();

    // this._reportDrawCall();

    const drawMode = this._drawMode(fillMode);
    if (instancesCount) {
      this._gl.drawArraysInstanced(drawMode, verticesStart, verticesCount, instancesCount);
    } else {
      this._gl.drawArrays(drawMode, verticesStart, verticesCount);
    }
  }

  private _drawMode(fillMode: number): number {
    switch (fillMode) {
      // Triangle views
      case Constants.MATERIAL_TriangleFillMode:
        return this._gl.TRIANGLES;
      case Constants.MATERIAL_PointFillMode:
        return this._gl.POINTS;
      case Constants.MATERIAL_WireFrameFillMode:
        return this._gl.LINES;
      // Draw modes
      case Constants.MATERIAL_PointListDrawMode:
        return this._gl.POINTS;
      case Constants.MATERIAL_LineListDrawMode:
        return this._gl.LINES;
      case Constants.MATERIAL_LineLoopDrawMode:
        return this._gl.LINE_LOOP;
      case Constants.MATERIAL_LineStripDrawMode:
        return this._gl.LINE_STRIP;
      case Constants.MATERIAL_TriangleStripDrawMode:
        return this._gl.TRIANGLE_STRIP;
      case Constants.MATERIAL_TriangleFanDrawMode:
        return this._gl.TRIANGLE_FAN;
      default:
        return this._gl.TRIANGLES;
    }
  }

  /**
   * Clear the current render buffer or the current render target (if any is set up)
   * @param color defines the color to use
   * @param backBuffer defines if the back buffer must be cleared
   * @param depth defines if the depth buffer must be cleared
   * @param stencil defines if the stencil buffer must be cleared
   */
  public clear(color: Nullable<IColor4Like>, backBuffer: boolean, depth: boolean, stencil: boolean = false): void {
    this.engine.engineState.applyStates();

    var mode = 0;
    if (backBuffer && color) {
      this._gl.clearColor(color.r, color.g, color.b, color.a !== undefined ? color.a : 1.0);
      mode |= this._gl.COLOR_BUFFER_BIT;
    }

    if (depth) {
      // if (this.useReverseDepthBuffer) {
      //   this._depthCullingState.depthFunc = this._gl.GREATER;
      //   this._gl.clearDepth(0.0);
      // } else {
      //   this._gl.clearDepth(1.0);
      // }
      mode |= this._gl.DEPTH_BUFFER_BIT;
    }
    if (stencil) {
      this._gl.clearStencil(0);
      mode |= this._gl.STENCIL_BUFFER_BIT;
    }
    this._gl.clear(mode);
  }
}
