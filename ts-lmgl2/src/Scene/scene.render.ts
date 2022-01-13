import { Constants } from "../Engine/constants";
import { Scene } from "./scene";

export class SceneRender {
  scene: Scene;
  public _renderId = 0;
  public _frameId = 0;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  public render(updateCameras = true, ignoreAnimations = false): void {

  }

  private _forceWireframe = false;
  /**
   * Gets or sets a boolean indicating if all rendering must be done in wireframe
   */
  public set forceWireframe(value: boolean) {
    if (this._forceWireframe === value) {
      return;
    }
    this._forceWireframe = value;
    this.scene.markAllMaterialsAsDirty(Constants.MATERIAL_MiscDirtyFlag);
  }
  public get forceWireframe(): boolean {
    return this._forceWireframe;
  }

  /**
  * Gets an unique Id for the current render phase
  * @returns a number
  */
  public getRenderId(): number {
    return this._renderId;
  }

}
