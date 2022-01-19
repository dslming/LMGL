import { Observable } from "../Misc/observable";
import { Nullable } from "../types";
import { Engine } from "./engine";

export class EngineObservable {
  // Observables

  /**
   * Observable event triggered each time the rendering canvas is resized
   */
  public onResizeObservable = new Observable<Engine>();

  /**
   * Observable event triggered each time the canvas loses focus
   */
  public onCanvasBlurObservable = new Observable<Engine>();

  /**
   * Observable event triggered each time the canvas gains focus
   */
  public onCanvasFocusObservable = new Observable<Engine>();

  /**
   * Observable event triggered each time the canvas receives pointerout event
   */
  public onCanvasPointerOutObservable = new Observable<PointerEvent>();

  /**
   * Observable raised when the engine begins a new frame
   */
  public onBeginFrameObservable = new Observable<Engine>();

  /**
   * If set, will be used to request the next animation frame for the render loop
   */
  // public customAnimationFrameRequester: Nullable<ICustomAnimationFrameRequester> = null;

  /**
   * Observable raised when the engine ends the current frame
   */
  public onEndFrameObservable = new Observable<Engine>();

  /**
   * Observable raised when the engine is about to compile a shader
   */
  public onBeforeShaderCompilationObservable = new Observable<Engine>();

  /**
   * Observable raised when the engine has jsut compiled a shader
   */
  public onAfterShaderCompilationObservable = new Observable<Engine>();
}
