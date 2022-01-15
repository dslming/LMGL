import { Constants } from "../Engine/constants";
import { Engine } from "../Engine/engine";
import { Material } from "../Materials/material";
import { BaseTexture } from "../Materials/Textures/baseTexture";
import { AbstractMesh } from "../Meshes/abstractMesh";
import { UniqueIdGenerator } from "../Misc/uniqueIdGenerator";
import { SceneClipPlane } from "./scene.clipPlane";
import { SceneRender } from "./scene.render";
import { Node } from "../node";
import { ScenePaddingData } from "./scene.paddingData";
import { Nullable } from "../types";
import { Geometry } from "../Meshes/geometry";
import { SceneEventTrigger } from "./scene.eventTrigger";
import { Camera } from "../Cameras/camera";
import { Light } from "../Lights/light";
import { SceneNode } from "./scene.node";
import { SceneMatrix } from "./scene.matrix";
import { TransformNode } from "../Meshes/transformNode";
import { AbstractScene } from "./abstractScene";
import { SceneCatch } from "./scene.catch";
import { RenderingManager } from "../Rendering/renderingManager";
import { ISmartArrayLike, SmartArray } from "../Misc/smartArray";
import { SubMesh } from "../Meshes/subMesh";
import { Ray } from "../Culling/ray";
import { PerfCounter } from "../Misc/perfCounter";
import { _DevTools } from "../Misc/devTools";
import { SceneComponent } from "./scene.component";

export class Scene extends AbstractScene {
  public lightsEnabled: boolean = true;
  public _renderingManager: RenderingManager;
  public _totalVertices = new PerfCounter();
  public webGLVersion: number = 2;
  public forcePointsCloud = false;
  public activeCamera: Nullable<Camera>;
  public activeCameras: Nullable<Array<Camera>>;
  public sceneClipPlane = new SceneClipPlane();
  public materials = new Array<Material>();
  public transformNodes = new Array<TransformNode>();
  public _engine: Engine;
  public meshes = new Array<AbstractMesh>();
  public sceneRender: SceneRender;
  public scenePaddingData: ScenePaddingData;
  public readonly useMaterialMeshMap: boolean = true;
  public geometriesByUniqueId: Nullable<{ [uniqueId: string]: number | undefined }> = null;

  public geometries = new Array<Geometry>();
  public _blockEntityCollection = false;
  public sceneEventTrigger: SceneEventTrigger;
  public cameras = new Array<Camera>();
  public lights = new Array<Light>();
  public sceneNode = new SceneNode(this);
  public sceneComponent = new SceneComponent();

  public _activeIndices = new PerfCounter();
  public sceneCatch: SceneCatch;

  /**
   * Gets or sets a boolean indicating if lights must be sorted by priority (off by default)
   * This is useful if there are more lights that the maximum simulteanous authorized
   */
  public requireLightSorting = false;

  /**
   * Flag indicating that the frame buffer binding is handled by another component
   * 指示帧缓冲区绑定由另一个组件处理的标志
   */
  public prePass: boolean = false;

  public _activeCamera: Nullable<Camera>;
  /**
   * Gets the list of root nodes (ie. nodes with no parent)
   */
  public rootNodes = new Array<Node>();
  public textures = new Array<BaseTexture>();
  public sceneMatrix: SceneMatrix;
  public _activeMeshes = new SmartArray<AbstractMesh>(256);
  public _processedMaterials = new SmartArray<Material>(256);

  /**
   * Gets or sets a boolean indicating that all submeshes of active meshes must be rendered
   * Use this boolean to avoid computing frustum clipping on submeshes (This could help when you are CPU bound)
   */
  public dispatchAllSubMeshesOfActiveMeshes: boolean = false;

  constructor(engine: Engine) {
    super();
    this._engine = engine;
    this.sceneRender = new SceneRender(this);
    this.scenePaddingData = new ScenePaddingData();
    this.sceneMatrix = new SceneMatrix(this, engine);
    this.sceneCatch = new SceneCatch(this);
    this.sceneEventTrigger = new SceneEventTrigger(this);
    this.sceneCatch.resetCachedMaterial();
    this._renderingManager = new RenderingManager(this);
    // Uniform Buffer
    this.sceneMatrix._createUbo();

    this.sceneNode.setDefaultCandidateProviders();
  }

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

  // Coordinates system
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

  getClassName(): String {
    return "Scene";
  }
}
