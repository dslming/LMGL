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
}
