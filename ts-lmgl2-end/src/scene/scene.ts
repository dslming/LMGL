import { Camera } from "../camera/camera";
import { Engine } from "../engines/engine";
import { Color4 } from "../maths/math.color";
import { Scalar } from "../maths/math.scalar";
import { Mesh } from "../meshes/mesh";
import { EventHandler } from "../misc/event.handler";
import { Logger } from "../misc/logger";
import { PrecisionDate } from "../misc/precisionDate";

export class Scene extends EventHandler {
  public engine: Engine;

  constructor(engine: Engine) {
    super();
    this.engine = engine;
    Logger.Log("Powered by EasyCG " + Engine.Version);

    this._renderLoop = this._renderLoop.bind(this);
    // this.resizeCanvas();
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

  public meshes = new Array<Mesh>();
  public addMesh(newMesh: Mesh) {
    this.meshes.push(newMesh);
  }
  public removeMesh(toRemove: Mesh): number {
    var index = this.meshes.indexOf(toRemove);
    if (index !== -1) {
      this.meshes[index] = this.meshes[this.meshes.length - 1];
      this.meshes.pop();
    }
    return index;
  }

  private _activeCamera: Camera;
  setActiveCamera(camera: Camera) {
    this._activeCamera = camera;
  }

  private _frameId = 0;
  public autoClear = true;
  public autoClearDepthAndStencil = true;
  public clearColor: Color4 = new Color4(0.2, 0.2, 0.3, 1.0);
  render() {
    this._frameId++;
    this.engine.engineFramebuffer.restoreDefaultFramebuffer();
    this.engine.engineDraw.clear(this.clearColor, this.autoClear, this.autoClearDepthAndStencil, this.autoClearDepthAndStencil);
  }
}
