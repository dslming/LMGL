import { Constants } from "./constants";
import { Engine } from "./engine";

export class EngineDraw {
  public engine: Engine;
  private _gl: WebGLRenderingContext;

  constructor(_gl: WebGLRenderingContext, engine: Engine) {
    this._gl = _gl;
    this.engine = engine;
  }

  drawElementsType(
    fillMode: number,
    indexStart: number,
    indexCount: number,
    instancesCount?: number
  ): void {
    // Apply states
    this.engine.engineState.applyStates();

    // this._reportDrawCall();

    // Render

    const drawMode = this._drawMode(fillMode);
    var indexFormat = this.engine.engineVertex._uintIndicesCurrentlySet
      ? this._gl.UNSIGNED_INT
      : this._gl.UNSIGNED_SHORT;
    var mult = this.engine.engineVertex._uintIndicesCurrentlySet ? 4 : 2;
    if (instancesCount) {
      this._gl.drawElementsInstanced(
        drawMode,
        indexCount,
        indexFormat,
        indexStart * mult,
        instancesCount
      );
    } else {
      this._gl.drawElements(
        drawMode,
        indexCount,
        indexFormat,
        indexStart * mult
      );
    }
  }

  /**
   * Draw a list of unindexed primitives
   * @param fillMode defines the primitive to use
   * @param verticesStart defines the index of first vertex to draw
   * @param verticesCount defines the count of vertices to draw
   * @param instancesCount defines the number of instances to draw (if instanciation is enabled)
   */
  public drawArraysType(
    fillMode: number,
    verticesStart: number,
    verticesCount: number,
    instancesCount?: number
  ): void {
    // Apply states
    this.engine.engineState.applyStates();

    // this._reportDrawCall();

    const drawMode = this._drawMode(fillMode);
    if (instancesCount) {
      this._gl.drawArraysInstanced(
        drawMode,
        verticesStart,
        verticesCount,
        instancesCount
      );
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
}
