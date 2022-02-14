import { Engine } from "./engines/engine";
import { Scalar } from "./maths/math.scalar";
import { EventHandler } from "./misc/event.handler";
import { Logger } from "./misc/logger";
import { PrecisionDate } from "./misc/precisionDate";

export class Application extends EventHandler {
  public engine: Engine;

  constructor(canvas: any, options?: any) {
    super();
    this.engine = new Engine(canvas, options);
    Logger.Log("Powered by EasyCG " + Engine.Version);

    this._renderLoop = this._renderLoop.bind(this);
    this.resizeCanvas();
  }

  /**
   * Begin a new frame
   */
  public beginFrame(): void {}

  /**
   * Enf the current frame
   */
  public endFrame(): void {}

  /**
   * Scales the global time delta. Defaults to 1.
   *
   * @type {number}
   * @example
   * // Set the app to run at half speed
   * this.app.timeScale = 0.5;
   */
  public timeScale: number = 1;
  private _time: number = 0;

  /**
   * Clamps per-frame delta time to an upper bound. Useful since returning from a tab
   * deactivation can generate huge values for dt, which can adversely affect game state.
   * Defaults to 0.1 (seconds).
   *
   * @type {number}
   * @example
   * // Don't clamp inter-frame times of 200ms or less
   * this.app.maxDeltaTime = 0.2;
   */
  public maxDeltaTime: number = 0.1; // Maximum delta is 0.1s or 10 fps.
  public _frameHandler: number | null;
  protected _renderingQueueLaunched: boolean = false;
  protected _activeRenderLoops = new Array<() => void>();

  /**
   * Register and execute a render loop. The engine can have more than one render function
   * @param renderFunction defines the function to continuously execute
   */
  public runRenderLoop(renderFunction: () => void): void {
    if (this._activeRenderLoops.indexOf(renderFunction) !== -1) {
      return;
    }
    this._activeRenderLoops.push(renderFunction);

    if (!this._renderingQueueLaunched) {
      this._renderingQueueLaunched = true;
      this._frameHandler = requestAnimationFrame(this._renderLoop);
    }
  }

  /**
   * 渲染循环
   */
  private _renderLoop(): void {
    if (!this.engine._contextWasLost) {
      this.beginFrame();
      for (var index = 0; index < this._activeRenderLoops.length; index++) {
        const renderFunction = this._activeRenderLoops[index];
        renderFunction();
      }
      this.endFrame();
    }

    const currentTime = PrecisionDate.Now;
    const ms = currentTime - (this._time || currentTime);
    let dt = ms / 1000.0;
    dt = Scalar.Clamp(dt, 0, this.maxDeltaTime);
    dt *= this.timeScale;
    this._time = currentTime;

    if (this._activeRenderLoops.length > 0) {
      this._frameHandler = requestAnimationFrame(this._renderLoop);
    } else {
      this._renderingQueueLaunched = false;
      if (this._frameHandler) {
        window.cancelAnimationFrame(this._frameHandler);
        this._frameHandler = null;
      }
    }
  }

  /**
   * Force a specific size of the canvas
   * @param width defines the new canvas' width
   * @param height defines the new canvas' height
   * @returns true if the size was changed
   */
  public resizeCanvas(width?: number, height?: number): boolean {
    if (!this.engine._renderingCanvas) {
      return false;
    }

    width = width ? width : window.innerWidth;
    height = height ? height : window.innerHeight;

    if (this.engine._renderingCanvas.width === width && this.engine._renderingCanvas.height === height) {
      return false;
    }

    this.engine._renderingCanvas.width = width;
    this.engine._renderingCanvas.height = height;

    return true;
  }
}
