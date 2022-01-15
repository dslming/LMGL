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
import { ISceneComponent } from "./sceneComponent";
import { SceneCatch } from "./scene.catch";
import { RenderingManager } from "../Rendering/renderingManager";
import { ISmartArrayLike, SmartArray } from "../Misc/smartArray";
import { SubMesh } from "../Meshes/subMesh";
import { Ray } from "../Culling/ray";
import { Collider } from "../Collisions/collider";
import { PerfCounter } from "../Misc/perfCounter";
import { ICollisionCoordinator } from "../Collisions/collisionCoordinator";
import { _DevTools } from "../Misc/devTools";

export class Scene extends AbstractScene {
  lightsEnabled: boolean = true;
  public _renderingManager: RenderingManager;
  public _totalVertices = new PerfCounter();
  public webGLVersion: number = 2;
  public forcePointsCloud = false;
  public activeCamera: any;
  public activeCameras: any;
  public sceneClipPlane = new SceneClipPlane();
  public materials = new Array<Material>();
  public transformNodes = new Array<TransformNode>();
  public _engine: Engine;
  public meshes = new Array<AbstractMesh>();
  public sceneRender: SceneRender;
  public scenePaddingData: ScenePaddingData;
  public readonly useMaterialMeshMap: boolean = true;
  public geometriesByUniqueId: Nullable<{
    [uniqueId: string]: number | undefined;
  }> = null;
  public geometries = new Array<Geometry>();
  public _blockEntityCollection = false;
  public sceneEventTrigger: SceneEventTrigger;
  public cameras = new Array<Camera>();
  public lights = new Array<Light>();
  public sceneNode = new SceneNode(this);

  public _activeIndices = new PerfCounter();

  // Collisions
  /**
   * Gets or sets a boolean indicating if collisions are enabled on this scene
   * @see https://doc.babylonjs.com/babylon101/cameras,_mesh_collisions_and_gravity
   */
  public collisionsEnabled = true;
  private _collisionCoordinator: ICollisionCoordinator;
  sceneCatch: SceneCatch;

  /**
   * Factory used to create the a collision coordinator.
   * @returns The collision coordinator
   */
  public static CollisionCoordinatorFactory(): ICollisionCoordinator {
    throw _DevTools.WarnImport("DefaultCollisionCoordinator");
  }

  /** @hidden */
  public get collisionCoordinator(): ICollisionCoordinator {
    if (!this._collisionCoordinator) {
      this._collisionCoordinator = Scene.CollisionCoordinatorFactory();
      this._collisionCoordinator.init(this);
    }

    return this._collisionCoordinator;
  }

  /**
   * Gets or sets a boolean indicating if lights must be sorted by priority (off by default)
   * This is useful if there are more lights that the maximum simulteanous authorized
   */
  public requireLightSorting = false;

  /**
   * Flag indicating that the frame buffer binding is handled by another component
   */
  public prePass: boolean = false;
  public _activeCamera: Nullable<Camera>;
  /**
   * Gets the list of root nodes (ie. nodes with no parent)
   */
  public rootNodes = new Array<Node>();
  public textures = new Array<BaseTexture>();
  public sceneMatrix: SceneMatrix;
  public _components: ISceneComponent[] = [];
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

  /**
   * Will flag all materials as dirty to trigger new shader compilation
   * @param flag defines the flag used to specify which material part must be marked as dirty
   * @param predicate If not null, it will be used to specifiy if a material has to be marked as dirty
   */
  public markAllMaterialsAsDirty(
    flag: number,
    predicate?: (mat: Material) => boolean
  ): void {
    for (var material of this.materials) {
      if (predicate && !predicate(material)) {
        continue;
      }
      material.markAsDirty(flag);
    }
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
    this.markAllMaterialsAsDirty(Constants.MATERIAL_MiscDirtyFlag);
  }

  public get useRightHandedSystem(): boolean {
    return this._useRightHandedSystem;
  }

  private _blockMaterialDirtyMechanism = false;
  /**
   * Gets or sets a boolean blocking all the calls to markAllMaterialsAsDirty (ie. the materials won't be updated if they are out of sync)
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

  getClassName(): String {
    return "Scene";
  }

  public _getComponent(name: string): Nullable<ISceneComponent> {
    for (let component of this._components) {
      if (component.name === name) {
        return component;
      }
    }
    return null;
  }

  public _addComponent(component: ISceneComponent) {
    this._components.push(component);
    // this._transientComponents.push(component);

    // const serializableComponent = component as ISceneSerializableComponent;
    // if (
    //   (serializableComponent as any).addFromContainer &&
    //   serializableComponent.serialize
    // ) {
    //   this._serializableComponents.push(serializableComponent);
    // }
  }

  /**
   * Lambda returning the list of potentially active meshes.
   */
  public getActiveMeshCandidates: () => ISmartArrayLike<AbstractMesh>;

  /**
   * Lambda returning the list of potentially active sub meshes.
   */
  public getActiveSubMeshCandidates: (
    mesh: AbstractMesh
  ) => ISmartArrayLike<SubMesh>;

  /**
   * Lambda returning the list of potentially intersecting sub meshes.
   */
  public getIntersectingSubMeshCandidates: (
    mesh: AbstractMesh,
    localRay: Ray
  ) => ISmartArrayLike<SubMesh>;

  /**
   * Lambda returning the list of potentially colliding sub meshes.
   */
  public getCollidingSubMeshCandidates: (
    mesh: AbstractMesh,
    collider: Collider
  ) => ISmartArrayLike<SubMesh>;
}
