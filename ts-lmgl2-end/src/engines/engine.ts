import { Logger } from "../misc/logger";
import { Nullable } from "../types";

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
export interface EngineOptions extends WebGLContextAttributes {}

export class Engine {
  public gl: WebGLRenderingContext;
  private _renderingCanvas: Nullable<HTMLCanvasElement>;
  public _contextWasLost = false;

  constructor(canvas: HTMLCanvasElement, options?: EngineOptions) {
    this._renderingCanvas = canvas;
    try {
      this.gl = canvas.getContext("webgl2", options) as any;
    } catch (err) {
      throw new Error("仅支持 webgl2.0");
    }

    canvas.addEventListener("webglcontextlost", this._contextLostHandler, false);
  }

  private _contextLostHandler(event: Event) {
    event.preventDefault();
    this._contextWasLost = true;
    Logger.Error("WebGL context lost");
  }
}
