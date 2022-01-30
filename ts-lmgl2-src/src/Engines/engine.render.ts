import { DomManagement } from "../Misc/domManagement";
import { WebGLEngine } from "./webglEngine";

export class EngineRender {
  protected _renderingQueueLaunched = false;
  protected _activeRenderLoops = new Array<() => void>();
  engine: WebGLEngine;
  public _frameHandler: number;
  public _boundRenderFunction: any;

  constructor(engine: WebGLEngine) {
    this.engine = engine;
  }

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
      this._boundRenderFunction = this._renderLoop.bind(this);
      this._frameHandler = this._queueNewFrame(
        this._boundRenderFunction
        // this.getHostWindow()
      );
    }
  }

  public _renderLoop(): void {
    if (!this.engine._contextWasLost) {
      var shouldRender = true;
      // if (!this.renderEvenInBackground && this._windowIsBackground) {
      //     shouldRender = false;
      // }

      if (shouldRender) {
        // Start new frame
        this.beginFrame();

        for (var index = 0; index < this._activeRenderLoops.length; index++) {
          var renderFunction = this._activeRenderLoops[index];

          renderFunction();
        }

        // Present
        this.endFrame();
      }
    }

    if (this._activeRenderLoops.length > 0) {
      this._frameHandler = this._queueNewFrame(
        this._boundRenderFunction
        // this.getHostWindow()
      );
    } else {
      this._renderingQueueLaunched = false;
    }
  }

  /**
   * Begin a new frame
   */
  public beginFrame(): void {}

  /**
   * Enf the current frame
   */
  public endFrame(): void {
    // Force a flush in case we are using a bad OS.
    // if (this._badOS) {
    //     this.flushFramebuffer();
    // }
  }

  /**
   * Queue a new function into the requested animation frame pool (ie. this function will be executed byt the browser for the next frame)
   * @param func - the function to be called
   * @param requester - the object that will request the next frame. Falls back to window.
   * @returns frame number
   */
  public static QueueNewFrame(func: () => void, requester?: any): number {
    if (!DomManagement.IsWindowObjectExist()) {
      if (typeof requestAnimationFrame !== "undefined") {
        return requestAnimationFrame(func);
      }

      return setTimeout(func, 16) as any;
    }

    if (!requester) {
      requester = window;
    }

    if (requester.requestPostAnimationFrame) {
      return requester.requestPostAnimationFrame(func);
    } else if (requester.requestAnimationFrame) {
      return requester.requestAnimationFrame(func);
    } else if (requester.msRequestAnimationFrame) {
      return requester.msRequestAnimationFrame(func);
    } else if (requester.webkitRequestAnimationFrame) {
      return requester.webkitRequestAnimationFrame(func);
    } else if (requester.mozRequestAnimationFrame) {
      return requester.mozRequestAnimationFrame(func);
    } else if (requester.oRequestAnimationFrame) {
      return requester.oRequestAnimationFrame(func);
    } else {
      return window.setTimeout(func, 16);
    }
  }

  /**
   * Can be used to override the current requestAnimationFrame requester.
   * @hidden
   */
  protected _queueNewFrame(bindedRenderFunction: any, requester?: any): number {
    return EngineRender.QueueNewFrame(bindedRenderFunction, requester);
  }

  private _deltaTime = 0;
  /**
   * Gets the time spent between current and previous frame
   * @returns a number representing the delta time in ms
   */
  public getDeltaTime(): number {
    return this._deltaTime;
  }

  public getFps() {
    return 0;
  }
}
