import { Plane } from "../Maths/math";
import { Nullable } from "../types";
import { IClipPlanesHolder } from '../Misc/interfaces/iClipPlanesHolder';

export interface ISceneClipPlane{
  clipPlane: Nullable<Plane>;
  clipPlane2: Nullable<Plane>;
  clipPlane3: Nullable<Plane>;
  clipPlane4: Nullable<Plane>;
  clipPlane5: Nullable<Plane>;
  clipPlane6: Nullable<Plane>;
  frustumPlanes: Plane[];
}
export class SceneClipPlane implements IClipPlanesHolder ,ISceneClipPlane{
  constructor() { }

  /**
   * Gets the list of frustum planes (built from the active camera)
   */
  public frustumPlanes: Plane[];

  /**
     * Gets or sets the active clipplane 1
     */
  public clipPlane: Nullable<Plane>;

  /**
   * Gets or sets the active clipplane 2
   */
  public clipPlane2: Nullable<Plane>;

  /**
   * Gets or sets the active clipplane 3
   */
  public clipPlane3: Nullable<Plane>;

  /**
   * Gets or sets the active clipplane 4
   */
  public clipPlane4: Nullable<Plane>;

  /**
   * Gets or sets the active clipplane 5
   */
  public clipPlane5: Nullable<Plane>;

  /**
   * Gets or sets the active clipplane 6
   */
  public clipPlane6: Nullable<Plane>;
}
