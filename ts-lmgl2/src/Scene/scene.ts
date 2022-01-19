import { Constants } from "../Engine/constants";
import { Engine } from "../Engine/engine";
import { Material } from "../Materials/material";
import { AbstractMesh } from "../Meshes/abstractMesh";
import { UniqueIdGenerator } from "../Misc/uniqueIdGenerator";
import { SceneClipPlane } from "./scene.clipPlane";
import { SceneRender } from "./scene.render";
import { ScenePaddingData } from "./scene.paddingData";
import { Nullable } from "../types";
import { SceneEventTrigger } from "./scene.eventTrigger";
import { Camera } from "../Cameras/camera";
import { SceneNode } from "./scene.node";
import { SceneMatrix } from "./scene.matrix";
import { AbstractScene } from "./abstractScene";
import { SceneCatch } from "./scene.catch";
import { RenderingManager } from "../Rendering/renderingManager";
import { SmartArray } from "../Misc/smartArray";
import { PerfCounter } from "../Misc/perfCounter";
import { _DevTools } from "../Misc/devTools";
import { SceneComponent } from "./scene.component";
import { SceneFog } from "./scene.fog";
import { ScenePost } from "./scene.post";
import { Mesh } from "../Meshes/mesh";

export class Scene extends AbstractScene {
  public _engine: Engine;
  public lightsEnabled: boolean = true;

  public sceneClipPlane = new SceneClipPlane();
  public sceneRender: SceneRender;
  public scenePaddingData: ScenePaddingData;
  public sceneEventTrigger: SceneEventTrigger;
  public sceneNode = new SceneNode(this);
  public sceneComponent = new SceneComponent();
  public sceneCatch: SceneCatch;
  public sceneMatrix: SceneMatrix;
  public sceneFog = new SceneFog(this);
  public scenePost = new ScenePost();
    layers: any;

  constructor(engine: Engine) {
    super();
    this._engine = engine;

    this.sceneRender = new SceneRender(this);
    this.scenePaddingData = new ScenePaddingData();
    this.sceneMatrix = new SceneMatrix(this, engine);
    this.sceneCatch = new SceneCatch(this);
    this.sceneEventTrigger = new SceneEventTrigger(this);
    this.sceneCatch.resetCachedMaterial();
    this.sceneMatrix._createUbo();
    this.sceneNode.setDefaultCandidateProviders();
  }

  /*------------------------------------- Coordinates system ---------------------------*/
  private _useRightHandedSystem = false;
  /**
   * Gets or sets a boolean indicating if the scene must use right-handed coordinates system
   */
  public set useRightHandedSystem(value: boolean) {
    if (this._useRightHandedSystem === value) {
      return;
    }
    this._useRightHandedSystem = value;
    this.sceneNode.markAllMaterialsAsDirty(Constants.MATERIAL_MiscDirtyFlag);
  }

  public get useRightHandedSystem(): boolean {
    return this._useRightHandedSystem;
  }

  /*------------------------------------- 一些get方法 ---------------------------*/
  public getEngine(): Engine {
    return this._engine;
  }

  /**
   * Gets an unique (relatively to the current scene) Id
   * @returns an unique number for the scene
   */
  public getUniqueId() {
    return UniqueIdGenerator.UniqueId;
  }

  getClassName(): String {
    return "Scene";
  }

  /**
    * This function will check if the scene can be rendered (textures are loaded, shaders are compiled)
    * Delay loaded resources are not taking in account
    * @return true if all required resources are ready
    */
  public isReady(): boolean {
    // if (this._isDisposed) {
    //   return false;
    // }

    let index: number;
    let engine = this.getEngine();

    // Effects
    if (!engine.areAllEffectsReady()) {
      return false;
    }

    // Pending data
    // if (this._pendingData.length > 0) {
    //   return false;
    // }

    // Meshes
    for (index = 0; index < this.meshes.length; index++) {
      var mesh = this.meshes[index];

      if (!mesh.isEnabled()) {
        continue;
      }

      if (!mesh.subMeshes || mesh.subMeshes.length === 0) {
        continue;
      }

      if (!mesh.isReady(true)) {
        return false;
      }

      let hardwareInstancedRendering = mesh.hasThinInstances || mesh.getClassName() === "InstancedMesh" || mesh.getClassName() === "InstancedLinesMesh" || engine.getCaps().instancedArrays && (<Mesh>mesh).meshInstanced.instances.length > 0;
      // Is Ready For Mesh
      // for (let step of this._isReadyForMeshStage) {
      //   if (!step.action(mesh, hardwareInstancedRendering)) {
      //     return false;
      //   }
      // }
    }

    // Geometries
    for (index = 0; index < this.geometries.length; index++) {
      var geometry = this.geometries[index];

      if (geometry.delayLoadState === Constants.DELAYLOADSTATE_LOADING) {
        return false;
      }
    }

    // Post-processes
    if (this.sceneRender.activeCameras && this.sceneRender.activeCameras.length > 0) {
      for (var camera of this.sceneRender.activeCameras) {
        if (!camera.isReady(true)) {
          return false;
        }
      }
    } else if (this.sceneRender.activeCamera) {
      if (!this.sceneRender.activeCamera.isReady(true)) {
        return false;
      }
    }

    // Particles
    // for (var particleSystem of this.particleSystems) {
    //   if (!particleSystem.isReady()) {
    //     return false;
    //   }
    // }

    return true;
  }

  /**
   * Flag indicating that the frame buffer binding is handled by another component
   */
  public prePass: boolean = false;
}
