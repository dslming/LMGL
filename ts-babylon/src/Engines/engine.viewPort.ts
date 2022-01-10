import { IViewportLike } from "../Maths/math.like";
import { Nullable } from "../types";
import { ThinEngine } from "./thinEngine";

export class EngineViewPort {
  public _cachedViewport: Nullable<IViewportLike>;
  public _viewportCached = { x: 0, y: 0, z: 0, w: 0 };
  engine: ThinEngine;


  constructor(engine: ThinEngine) {
    this.engine = engine;

  }

   /**
     * Set the WebGL's viewport
     * @param viewport defines the viewport element to be used
     * @param requiredWidth defines the width required for rendering. If not provided the rendering canvas' width is used
     * @param requiredHeight defines the height required for rendering. If not provided the rendering canvas' height is used
     */
    public setViewport(viewport: IViewportLike, requiredWidth?: number, requiredHeight?: number): void {
        var width = requiredWidth || this.engine.getRenderWidth();
        var height = requiredHeight || this.engine.getRenderHeight();
        var x = viewport.x || 0;
        var y = viewport.y || 0;

        this._cachedViewport = viewport;

        this._viewport(x * width, y * height, width * viewport.width, height * viewport.height);
    }

   public _viewport(x: number, y: number, width: number, height: number): void {
        if (x !== this._viewportCached.x ||
            y !== this._viewportCached.y ||
            width !== this._viewportCached.z ||
            height !== this._viewportCached.w) {
            this._viewportCached.x = x;
            this._viewportCached.y = y;
            this._viewportCached.z = width;
            this._viewportCached.w = height;

            this.engine._gl.viewport(x, y, width, height);
        }
   }

   /**
   * Gets the current viewport
   */
  public get currentViewport(): Nullable<IViewportLike> {
      return this._cachedViewport;
  }
}
