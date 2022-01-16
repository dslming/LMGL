import { Scene } from "./scene";
import { Camera } from "../Cameras/camera";
import { Light } from "../Lights/light";
import { Material } from "../Materials/material";
import { BaseTexture } from "../Materials/Textures/baseTexture";
import { AbstractMesh } from "../Meshes/abstractMesh";
import { Geometry } from "../Meshes/geometry";
import { Nullable } from "../types";
import { ISmartArrayLike } from "../Misc/smartArray";
import { TransformNode } from "../Meshes/transformNode";
import { SubMesh } from "../Meshes/subMesh";
import { Constants } from "../Engine/constants";

export class SceneNode {
  public _blockEntityCollection = false;
  public scene: Scene;

  /** @hidden */
  private _defaultMeshCandidates: ISmartArrayLike<AbstractMesh> = {
    data: [],
    length: 0,
  };

  constructor(scene: Scene) {
    this.scene = scene;
  }

  /*----------------------------------- transform node ------------------------------------*/
  /**
   * Add a transform node to the list of scene's transform nodes
   * @param newTransformNode defines the transform node to add
   */
  public addTransformNode(newTransformNode: TransformNode) {
    if (this._blockEntityCollection) {
      return;
    }
    newTransformNode._indexInSceneTransformNodesArray = this.scene.transformNodes.length;
    this.scene.transformNodes.push(newTransformNode);

    if (!newTransformNode.parent) {
      newTransformNode._addToSceneRootNodes();
    }

    //   this.scene.sceneEventTrigger.onNewTransformNodeAddedObservable.notifyObservers(newTransformNode);
  }

  /*----------------------------------- light ------------------------------------*/
  /**
   * Gets or sets a boolean indicating if lights must be sorted by priority (off by default)
   * This is useful if there are more lights that the maximum simulteanous authorized
   */
  public requireLightSorting = false;
  /**
   * Adds the given light to this scene.scene
   * @param newLight The light to add
   */
  public addLight(newLight: Light): void {
    if (this._blockEntityCollection) {
      return;
    }
    this.scene.lights.push(newLight);
    this.sortLightsByPriority();

    // if (!newLight.parent) {
    //     newLight._addToSceneRootNodes();
    // }

    // Add light to all meshes (To support if the light is removed and then re-added)
    for (var mesh of this.scene.meshes) {
      if (mesh.lightSources.indexOf(newLight) === -1) {
        mesh.lightSources.push(newLight);
        mesh._resyncLightSources();
      }
    }

    this.scene.sceneEventTrigger.onNewLightAddedObservable.notifyObservers(newLight);
  }

  /**
   * Sorts the list list based on light priorities
   */
  public sortLightsByPriority(): void {
    if (this.requireLightSorting) {
      this.scene.lights.sort(Light.CompareLightsPriority);
    }
  }

  /*----------------------------------- camera ------------------------------------*/
  /**
   * Adds the given camera to this scene.scene
   * @param newCamera The camera to add
   */
  public addCamera(newCamera: Camera): void {
    if (this._blockEntityCollection) {
      return;
    }

    this.scene.cameras.push(newCamera);
    this.scene.sceneEventTrigger.onNewCameraAddedObservable.notifyObservers(newCamera);

    // if (!newCamera.parent) {
    //     newCamera._addToSceneRootNodes();
    // }
  }
  /**
   * Remove a camera for the list of scene's cameras
   * @param toRemove defines the camera to remove
   * @returns the index where the camera was in the camera list
   */
  public removeCamera(toRemove: Camera): number {
    var index = this.scene.cameras.indexOf(toRemove);
    if (index !== -1) {
      // Remove from the scene if mesh found
      this.scene.cameras.splice(index, 1);
      if (!toRemove.parent) {
        toRemove._removeFromSceneRootNodes();
      }
    }
    // Remove from activeCameras
    if (this.scene.sceneRender.activeCameras) {
      var index2 = this.scene.sceneRender.activeCameras.indexOf(toRemove);
      if (index2 !== -1) {
        // Remove from the scene if mesh found
        this.scene.sceneRender.activeCameras.splice(index2, 1);
      }
    }
    // Reset the activeCamera
    if (this.scene.sceneRender.activeCamera === toRemove) {
      if (this.scene.cameras.length > 0) {
        this.scene.sceneRender.activeCamera = this.scene.cameras[0];
      } else {
        this.scene.sceneRender.activeCamera = null;
      }
    }
    this.scene.sceneEventTrigger.onCameraRemovedObservable.notifyObservers(toRemove);
    return index;
  }

  /*----------------------------------- texture ------------------------------------*/
  /**
   * Adds the given texture to this scene.
   * @param newTexture The texture to add
   */
  public addTexture(newTexture: BaseTexture): void {
    if (this._blockEntityCollection) {
      return;
    }
    this.scene.textures.push(newTexture);
    this.scene.sceneEventTrigger.onNewTextureAddedObservable.notifyObservers(newTexture);
  }
  /**
   * Removes the given texture from this scene.scene.
   * @param toRemove The texture to remove
   * @returns The index of the removed texture
   */
  public removeTexture(toRemove: BaseTexture): number {
    var index = this.scene.textures.indexOf(toRemove);
    if (index !== -1) {
      this.scene.textures.splice(index, 1);
    }
    this.scene.sceneEventTrigger.onTextureRemovedObservable.notifyObservers(toRemove);

    return index;
  }

  /*----------------------------------- geometry ------------------------------------*/
  public geometriesByUniqueId: Nullable<{ [uniqueId: string]: number | undefined }> = null;

  /**
   * Adds the given geometry to this scene.scene
   * @param newGeometry The geometry to add
   */
  public addGeometry(newGeometry: Geometry): void {
    if (this._blockEntityCollection) {
      return;
    }

    if (this.geometriesByUniqueId) {
      this.geometriesByUniqueId[newGeometry.uniqueId] = this.scene.geometries.length;
    }

    this.scene.geometries.push(newGeometry);
  }

  /**
   * Add a new geometry to this scene
   * @param geometry defines the geometry to be added to the scene.
   * @param force defines if the geometry must be pushed even if a geometry with this id already exists
   * @return a boolean defining if the geometry was added or not
   */
  public pushGeometry(geometry: Geometry, force?: boolean): boolean {
    if (!force && this._getGeometryByUniqueID(geometry.uniqueId)) {
      return false;
    }

    this.addGeometry(geometry);

    // this.scene.sceneEventTrigger.onNewGeometryAddedObservable.notifyObservers(geometry);

    return true;
  }

  /**
   * Removes an existing geometry
   * @param geometry defines the geometry to be removed from the scene
   * @return a boolean defining if the geometry was removed or not
   */
  public removeGeometry(geometry: Geometry): boolean {
    let index;
    if (this.geometriesByUniqueId) {
      index = this.geometriesByUniqueId[geometry.uniqueId];
      if (index === undefined) {
        return false;
      }
    } else {
      index = this.scene.geometries.indexOf(geometry);
      if (index < 0) {
        return false;
      }
    }

    if (index !== this.scene.geometries.length - 1) {
      const lastGeometry = this.scene.geometries[this.scene.geometries.length - 1];
      if (lastGeometry) {
        this.scene.geometries[index] = lastGeometry;
        if (this.geometriesByUniqueId) {
          this.geometriesByUniqueId[lastGeometry.uniqueId] = index;
          this.geometriesByUniqueId[geometry.uniqueId] = undefined;
        }
      }
    }

    this.scene.geometries.pop();

    this.scene.sceneEventTrigger.onGeometryRemovedObservable.notifyObservers(geometry);
    return true;
  }

  private _getGeometryByUniqueID(uniqueId: number): Nullable<Geometry> {
    if (this.geometriesByUniqueId) {
      const index = this.geometriesByUniqueId[uniqueId];
      if (index !== undefined) {
        return this.scene.geometries[index];
      }
    } else {
      for (var index = 0; index < this.scene.geometries.length; index++) {
        if (this.scene.geometries[index].uniqueId === uniqueId) {
          return this.scene.geometries[index];
        }
      }
    }

    return null;
  }

  /*----------------------------------- mesh ------------------------------------*/
  /**
   * Remove a mesh for the list of scene's meshes
   * @param toRemove defines the mesh to remove
   * @param recursive if all child meshes should also be removed from the scene
   * @returns the index where the mesh was in the mesh list
   */
  public removeMesh(toRemove: AbstractMesh, recursive = false): number {
    var index = this.scene.meshes.indexOf(toRemove);
    if (index !== -1) {
      // Remove from the scene if mesh found
      this.scene.meshes[index] = this.scene.meshes[this.scene.meshes.length - 1];
      this.scene.meshes.pop();

      if (!toRemove.parent) {
        toRemove._removeFromSceneRootNodes();
      }
    }

    this.scene.sceneEventTrigger.onMeshRemovedObservable.notifyObservers(toRemove);
    if (recursive) {
      toRemove.getChildMeshes().forEach((m) => {
        this.removeMesh(m);
      });
    }
    return index;
  }

  private _defaultSubMeshCandidates: ISmartArrayLike<SubMesh> = {
    data: [],
    length: 0,
  };

  /**
   * Lambda returning the list of potentially active meshes.
   */
  public getActiveMeshCandidates: () => ISmartArrayLike<AbstractMesh>;

  /**
   * Add a mesh to the list of scene's meshes
   * @param newMesh defines the mesh to add
   * @param recursive if all child meshes should also be added to the scene
   */
  public addMesh(newMesh: AbstractMesh, recursive = false) {
    if (this._blockEntityCollection) {
      return;
    }

    this.scene.meshes.push(newMesh);

    newMesh._resyncLightSources();

    if (!newMesh.parent) {
      newMesh._addToSceneRootNodes();
    }

    this.scene.sceneEventTrigger.onNewMeshAddedObservable.notifyObservers(newMesh);

    if (recursive) {
      newMesh.getChildMeshes().forEach((m) => {
        this.addMesh(m);
      });
    }
  }

  /**
   * Lambda returning the list of potentially active sub meshes.
   */
  public getActiveSubMeshCandidates: (mesh: AbstractMesh) => ISmartArrayLike<SubMesh>;

  /**
   * @hidden
   */
  public _getDefaultMeshCandidates(): ISmartArrayLike<AbstractMesh> {
    this._defaultMeshCandidates.data = this.scene.meshes;
    this._defaultMeshCandidates.length = this.scene.meshes.length;
    return this._defaultMeshCandidates;
  }

  /**
   * @hidden
   */
  public _getDefaultSubMeshCandidates(mesh: AbstractMesh): ISmartArrayLike<SubMesh> {
    this._defaultSubMeshCandidates.data = mesh.subMeshes;
    this._defaultSubMeshCandidates.length = mesh.subMeshes.length;
    return this._defaultSubMeshCandidates;
  }
  /**
   * Sets the default candidate providers for the scene.
   * This sets the getActiveMeshCandidates, getActiveSubMeshCandidates, getIntersectingSubMeshCandidates
   * and getCollidingSubMeshCandidates to their default function
   */
  public setDefaultCandidateProviders(): void {
    this.getActiveMeshCandidates = this._getDefaultMeshCandidates.bind(this);

    this.getActiveSubMeshCandidates = this._getDefaultSubMeshCandidates.bind(this);
    // this.scene.getIntersectingSubMeshCandidates =
    this._getDefaultSubMeshCandidates.bind(this);
    // this.scene.getCollidingSubMeshCandidates = this._getDefaultSubMeshCandidates.bind(this);
  }

  /*----------------------------------- material ------------------------------------*/
  public readonly useMaterialMeshMap: boolean = true;

  /**
   * Freeze all materials
   * A frozen material will not be updatable but should be faster to render
   */
  public freezeMaterials(): void {
    for (var i = 0; i < this.scene.materials.length; i++) {
      this.scene.materials[i].freeze();
    }
  }

  /**
   * Unfreeze all scene.materials
   * A frozen material will not be updatable but should be faster to render
   */
  public unfreezeMaterials(): void {
    for (var i = 0; i < this.scene.materials.length; i++) {
      this.scene.materials[i].unfreeze();
    }
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

  private _blockMaterialDirtyMechanism = false;
  /**
   * Gets or sets a boolean blocking all the calls to markAllMaterialsAsDirty (ie. the materials won't be updated if they are out of sync)
   * 获取或设置一个布尔值，阻止对markAllMaterialsAsDirty的所有调用（即，如果材质不同步，则不会更新）
   */
  public get blockMaterialDirtyMechanism(): boolean {
    return this._blockMaterialDirtyMechanism;
  }

  public set blockMaterialDirtyMechanism(value: boolean) {
    if (this._blockMaterialDirtyMechanism === value) {
      return;
    }

    this._blockMaterialDirtyMechanism = value;

    if (!value) {
      // Do a complete update
      this.markAllMaterialsAsDirty(Constants.MATERIAL_AllDirtyFlag);
    }
  }
  /**
   * Get a material using its unique id
   * @param uniqueId defines the material's unique id
   * @return the material or null if none found.
   */
  public getMaterialByUniqueID(uniqueId: number): Nullable<Material> {
    for (var index = 0; index < this.scene.materials.length; index++) {
      if (this.scene.materials[index].uniqueId === uniqueId) {
        return this.scene.materials[index];
      }
    }

    return null;
  }

  /**
   * get a material using its id
   * @param id defines the material's ID
   * @return the material or null if none found.
   */
  public getMaterialByID(id: string): Nullable<Material> {
    for (var index = 0; index < this.scene.materials.length; index++) {
      if (this.scene.materials[index].id === id) {
        return this.scene.materials[index];
      }
    }

    return null;
  }

  /**
   * Gets a the last added material using a given id
   * @param id defines the material's ID
   * @return the last material with the given id or null if none found.
   */
  public getLastMaterialByID(id: string): Nullable<Material> {
    for (var index = this.scene.materials.length - 1; index >= 0; index--) {
      if (this.scene.materials[index].id === id) {
        return this.scene.materials[index];
      }
    }

    return null;
  }

  /**
   * Gets a material using its name
   * @param name defines the material's name
   * @return the material or null if none found.
   */
  public getMaterialByName(name: string): Nullable<Material> {
    for (var index = 0; index < this.scene.materials.length; index++) {
      if (this.scene.materials[index].name === name) {
        return this.scene.materials[index];
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

    newMaterial._indexInSceneMaterialArray = this.scene.materials.length;
    this.scene.materials.push(newMaterial);
    this.scene.sceneEventTrigger.onNewMaterialAddedObservable.notifyObservers(newMaterial);
  }

  /**
   * Removes the given material from this scene.
   * @param toRemove The material to remove
   * @returns The index of the removed material
   */
  public removeMaterial(toRemove: Material): number {
    var index = toRemove._indexInSceneMaterialArray;
    if (index !== -1 && index < this.scene.materials.length) {
      if (index !== this.scene.materials.length - 1) {
        const lastMaterial = this.scene.materials[this.scene.materials.length - 1];
        this.scene.materials[index] = lastMaterial;
        lastMaterial._indexInSceneMaterialArray = index;
      }

      toRemove._indexInSceneMaterialArray = -1;
      this.scene.materials.pop();
    }

    // this.scene.sceneEventTrigger.onMaterialRemovedObservable.notifyObservers(toRemove);

    return index;
  }
}
