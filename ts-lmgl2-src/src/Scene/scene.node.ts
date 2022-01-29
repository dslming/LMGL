import { Scene } from "./scene";
import { Camera } from "../Cameras/camera";
import { Nullable } from "../types";

export class SceneNode {
  public scene: Scene;
  public cameras = new Array<Camera>();

  constructor(scene: Scene) {
    this.scene = scene;
  }

  /**
   * Will flag all materials as dirty to trigger new shader compilation
   * @param flag defines the flag used to specify which material part must be marked as dirty
   * @param predicate If not null, it will be used to specifiy if a material has to be marked as dirty
   */
  public markAllMaterialsAsDirty(flag: number, predicate?: (mat: Material) => boolean): void {
    for (var material of this.scene.materials) {
      if (predicate && !predicate(material)) {
        continue;
      }
      material.markAsDirty(flag);
    }
  }

  /*----------------------------------- camera ------------------------------------*/
  public _blockEntityCollection = false;
  /**
   * Adds the given camera to this scene.scene
   * @param newCamera The camera to add
   */
  public addCamera(newCamera: Camera): void {
    if (this._blockEntityCollection) {
      return;
    }

    this.cameras.push(newCamera);
  }

  /**
   * Remove a camera for the list of scene's cameras
   * @param toRemove defines the camera to remove
   * @returns the index where the camera was in the camera list
   */
  public removeCamera(toRemove: Camera): number {
    var index = this.cameras.indexOf(toRemove);
    if (index !== -1) {
      // Remove from the scene if mesh found
      this.cameras.splice(index, 1);
    }
    // Reset the activeCamera
    if (this.scene.sceneRender.activeCamera === toRemove) {
      if (this.cameras.length > 0) {
        this.scene.sceneRender.activeCamera = this.cameras[0];
      } else {
        this.scene.sceneRender.activeCamera = null;
      }
    }
    return index;
  }
  /**
   * Gets a camera using its id
   * @param id defines the id to look for
   * @returns the camera or null if not found
   */
  public getCameraByID(id: string): Nullable<Camera> {
    for (var index = 0; index < this.cameras.length; index++) {
      if (this.cameras[index].id === id) {
        return this.cameras[index];
      }
    }

    return null;
  }
}
