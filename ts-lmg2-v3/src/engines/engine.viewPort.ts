import { Engine } from "./engine";
import { IViewportLike } from "../maths/math.like";

export class EngineViewPort {
  private _engine: Engine;
  public viewportCached: IViewportLike = { x: 0, y: 0, width: 0, height: 0 };

  constructor(engine: Engine) {
    this._engine = engine;
  }

  /**
   * Set the WebGL's viewport
   * @param viewport defines the viewport element to be used
   * @param requiredWidth defines the width required for rendering. If not provided the rendering canvas' width is used
   * @param requiredHeight defines the height required for rendering. If not provided the rendering canvas' height is used
   */
  public setViewport(viewport: IViewportLike, requiredWidth?: number, requiredHeight?: number): void {
    // var width = requiredWidth || this._engine.engineDraw.getRenderWidth();
    // var height = requiredHeight || this._engine.engineDraw.getRenderHeight();
    // var x = viewport.x || 0;
    // var y = viewport.y || 0;

    // this._viewport(x * width, y * height, width * viewport.width, height * viewport.height);
    this._engine.gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
  }

  private _viewport(x: number, y: number, width: number, height: number): void {
    if (x !== this.viewportCached.x || y !== this.viewportCached.y || width !== this.viewportCached.width || height !== this.viewportCached.height) {
      this.viewportCached.x = x;
      this.viewportCached.y = y;
      this.viewportCached.width = width;
      this.viewportCached.height = height;
      this._engine.gl.viewport(x, y, width, height);
    }
  }
}
