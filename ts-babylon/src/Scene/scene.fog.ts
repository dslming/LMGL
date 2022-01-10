import { Constants } from "../Engines/constants";
import { Color3 } from "../Maths/math";
import { Scene } from "./scene";

export class SceneFog {
  // Fog

  private _fogEnabled = true;
  scene: Scene;
  /**
  * Gets or sets a boolean indicating if fog is enabled on this scene
  * @see https://doc.babylonjs.com/babylon101/environment#fog
  * (Default is true)
  */
  public set fogEnabled(value: boolean) {
    if (this._fogEnabled === value) {
      return;
    }
    this._fogEnabled = value;
    this.scene.markAllMaterialsAsDirty(Constants.MATERIAL_MiscDirtyFlag);
  }
  public get fogEnabled(): boolean {
    return this._fogEnabled;
  }

  private _fogMode = Scene.FOGMODE_NONE;
  /**
  * Gets or sets the fog mode to use
  * @see https://doc.babylonjs.com/babylon101/environment#fog
  * | mode | value |
  * | --- | --- |
  * | FOGMODE_NONE | 0 |
  * | FOGMODE_EXP | 1 |
  * | FOGMODE_EXP2 | 2 |
  * | FOGMODE_LINEAR | 3 |
  */
  public set fogMode(value: number) {
    if (this._fogMode === value) {
      return;
    }
    this._fogMode = value;
    this.scene.markAllMaterialsAsDirty(Constants.MATERIAL_MiscDirtyFlag);
  }
  public get fogMode(): number {
    return this._fogMode;
  }

  /**
  * Gets or sets the fog color to use
  * @see https://doc.babylonjs.com/babylon101/environment#fog
  * (Default is Color3(0.2, 0.2, 0.3))
  */
  public fogColor = new Color3(0.2, 0.2, 0.3);
  /**
  * Gets or sets the fog density to use
  * @see https://doc.babylonjs.com/babylon101/environment#fog
  * (Default is 0.1)
  */
  public fogDensity = 0.1;
  /**
  * Gets or sets the fog start distance to use
  * @see https://doc.babylonjs.com/babylon101/environment#fog
  * (Default is 0)
  */
  public fogStart = 0;
  /**
  * Gets or sets the fog end distance to use
  * @see https://doc.babylonjs.com/babylon101/environment#fog
  * (Default is 1000)
  */
  public fogEnd = 1000.0;

  constructor(scene: Scene) {
    this.scene = scene;
  }
}
