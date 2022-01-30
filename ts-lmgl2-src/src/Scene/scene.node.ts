import { Scene } from "./scene";
import { Camera } from "../Cameras/camera";
import { Nullable } from "../types";
import { Material } from "../Materials/material";
import { Mesh } from "../Meshes/mesh";

export class SceneNode {
  public scene: Scene;
  public cameras = new Array<Camera>();
  public meshes = new Array<Mesh>();
  public materials = new Array<Material>();

  constructor(scene: Scene) {
    this.scene = scene;
  }

  /*----------------------------------- mesh ------------------------------------*/
  /**
   * Remove a mesh for the list of scene's meshes
   * @param toRemove defines the mesh to remove
   * @param recursive if all child meshes should also be removed from the scene
   * @returns the index where the mesh was in the mesh list
   */
  public removeMesh(toRemove: Mesh, recursive = false): number {
    var index = this.meshes.indexOf(toRemove);
    if (index !== -1) {
      // Remove from the scene if mesh found
      this.meshes[index] = this.meshes[this.meshes.length - 1];
      this.meshes.pop();

      // if (!toRemove.parent) {
      //   toRemove._removeFromSceneRootNodes();
      // }
    }

    // this.scene.sceneEventTrigger.onMeshRemovedObservable.notifyObservers(toRemove);
    // if (recursive) {
    //   toRemove.getChildMeshes().forEach((m) => {
    //     this.removeMesh(m);
    //   });
    // }
    return index;
  }

  // private _defaultSubMeshCandidates: ISmartArrayLike<SubMesh> = {
  //   data: [],
  //   length: 0,
  // };

  /**
   * Lambda returning the list of potentially active meshes.
   */
  // public getActiveMeshCandidates: () => ISmartArrayLike<AbstractMesh>;

  /**
   * Add a mesh to the list of scene's meshes
   * @param newMesh defines the mesh to add
   * @param recursive if all child meshes should also be added to the scene
   */
  public addMesh(newMesh: Mesh, recursive = false) {
    if (this._blockEntityCollection) {
      return;
    }

    this.meshes.push(newMesh);

    // newMesh._resyncLightSources();

    // if (!newMesh.parent) {
    //   newMesh._addToSceneRootNodes();
    // }

    // this.scene.sceneEventTrigger.onNewMeshAddedObservable.notifyObservers(newMesh);

    // if (recursive) {
    //   newMesh.getChildMeshes().forEach((m) => {
    //     this.addMesh(m);
    //   });
    // }
  }

  /*----------------------------------- material ------------------------------------*/
  public readonly useMaterialMeshMap: boolean = true;
  /**
   * Will flag all materials as dirty to trigger new shader compilation
   * @param flag defines the flag used to specify which material part must be marked as dirty
   * @param predicate If not null, it will be used to specifiy if a material has to be marked as dirty
   */
  public markAllMaterialsAsDirty(flag: number, predicate?: (mat: Material) => boolean): void {
    for (var material of this.materials) {
      if (predicate && !predicate(material)) {
        continue;
      }
      // material.markAsDirty(flag);
    }
  }
  /**
   * get a material using its id
   * @param id defines the material's ID
   * @return the material or null if none found.
   */
  public getMaterialByID(id: string): Nullable<Material> {
    for (var index = 0; index < this.materials.length; index++) {
      if (this.materials[index].id === id) {
        return this.materials[index];
      }
    }

    return null;
  }
  /**
   * Adds the given material to this scene.scene
   * @param newMaterial The material to add
   */
  public addMaterial(newMaterial: Material): void {
    if (this._blockEntityCollection) {
      return;
    }

    newMaterial._indexInSceneMaterialArray = this.materials.length;
    this.materials.push(newMaterial);
    // this.scene.sceneEventTrigger.onNewMaterialAddedObservable.notifyObservers(newMaterial);
  }

  /**
   * Removes the given material from this scene.
   * @param toRemove The material to remove
   * @returns The index of the removed material
   */
  public removeMaterial(toRemove: Material): number {
    var index = toRemove._indexInSceneMaterialArray;
    if (index !== -1 && index < this.materials.length) {
      if (index !== this.materials.length - 1) {
        const lastMaterial = this.materials[this.materials.length - 1];
        this.materials[index] = lastMaterial;
        lastMaterial._indexInSceneMaterialArray = index;
      }

      toRemove._indexInSceneMaterialArray = -1;
      this.materials.pop();
    }

    // this.scene.sceneEventTrigger.onMaterialRemovedObservable.notifyObservers(toRemove);

    return index;
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
