import { Scene } from "./scene";
import { Color3, Color4 } from "../Maths/math";
import { Camera } from "../Cameras/camera";
import { Nullable } from "../types";

export class SceneRender {
  private scene: Scene;
  private _renderId = 0;
  public autoClearDepthAndStencil = true;
  public autoClear = true;
  public clearColor: Color4 = new Color4(0.2, 0.2, 0.3, 1.0);
  public ambientColor = new Color3(0, 0, 0);
  public activeCamera: Nullable<Camera>;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  private _renderForCamera(camera: Camera) {}

  /**
   * Gets an unique Id for the current render phase
   * @returns a number
   */
  public getRenderId(): number {
    return this._renderId;
  }
}
